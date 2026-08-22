import io
from datetime import datetime

from aiogram import Router
from aiogram.types import CallbackQuery, Message, BufferedInputFile, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

from app.models.invitation import Invitation
from app.models.photo import Photo
from app.models.guest import Guest
from app.models.telegram_user import TelegramProfile
from app.telegram.keyboards.inline import (
    get_main_menu_kb,
    get_event_type_kb,
    get_skip_kb,
    get_done_kb,
    get_back_to_menu_kb,
    get_share_kb,
    get_mini_app_kb,
)
from app.telegram.i18n import t
from app.services.s3 import upload_file, generate_object_key
from app.services.qr import generate_qr_code
from app.config import get_settings

router = Router()
settings = get_settings()

WIZARD_STEPS = ["title", "date", "time", "venue", "address", "description", "photos"]

EVENT_MAP = {
    "WEDDING": "wedding",
    "BIRTHDAY": "birthday",
    "JUBILEE": "jubilee",
    "GRADUATION": "graduation",
    "CORPORATE": "corporate",
    "OTHER": "other",
}


def get_profile(db, telegram_user_id: int) -> TelegramProfile | None:
    return (
        db.query(TelegramProfile)
        .filter(TelegramProfile.telegram_user_id == telegram_user_id)
        .first()
    )


def get_wizard_step(draft: Invitation) -> str:
    if not draft.title or draft.title == "":
        return "title"
    if draft.event_date == datetime.now().date() and draft.event_time == "18:00":
        return "date"
    if draft.event_time == "18:00" and not draft.location:
        return "time"
    if not draft.location or draft.location == "":
        return "venue"
    if not draft.address or draft.address == "":
        return "address"
    if draft.description is None and draft.program is None:
        return "description"
    return "photos"


@router.callback_query(lambda c: c.data == "menu")
async def cb_menu(callback: CallbackQuery):
    lang = callback.from_user.language_code or "ru"
    await callback.message.edit_text(t("menu_title", lang), reply_markup=get_main_menu_kb())
    await callback.answer()


@router.callback_query(lambda c: c.data == "help")
async def cb_help(callback: CallbackQuery):
    lang = callback.from_user.language_code or "ru"
    await callback.message.edit_text(t("help_text", lang), reply_markup=get_main_menu_kb())
    await callback.answer()


@router.callback_query(lambda c: c.data == "create_invitation")
async def cb_create_invitation(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    await callback.message.edit_text(
        t("select_event_type", lang), reply_markup=get_event_type_kb()
    )
    await callback.answer()


@router.callback_query(lambda c: c.data.startswith("event:"))
async def cb_select_event(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    event_type_str = callback.data.split(":")[1]
    event_type = EVENT_MAP.get(event_type_str, "other")

    import secrets
    slug = f"draft-{secrets.token_hex(6)}"

    invitation = Invitation(
        slug=slug,
        event_type=event_type,
        title="",
        event_date=datetime.now().date(),
        event_time="18:00",
        location="",
        address="",
        status="DRAFT",
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    profile = get_profile(db, callback.from_user.id)
    if profile:
        profile.invitation_id = invitation.id
        db.commit()

    await callback.message.edit_text(
        t("step_title", lang), reply_markup=get_skip_kb()
    )
    await callback.answer()


@router.message(lambda m: m.text and not m.text.startswith("/"))
async def handle_wizard_input(message: Message, db):
    profile = get_profile(db, message.from_user.id)
    if not profile or not profile.invitation_id:
        return

    draft = db.query(Invitation).filter(Invitation.id == profile.invitation_id).first()
    if not draft or draft.status != "DRAFT":
        return

    lang = message.from_user.language_code or "ru"
    text = message.text
    step = get_wizard_step(draft)

    if step == "title":
        draft.title = text
        db.commit()
        await message.answer(t("step_date", lang), reply_markup=get_skip_kb())

    elif step == "date":
        try:
            draft.event_date = datetime.strptime(text, "%d.%m.%Y").date()
            db.commit()
            await message.answer(t("step_time", lang), reply_markup=get_skip_kb())
        except ValueError:
            await message.answer("Формат: ДД.ММ.ГГГГ\nПопробуйте ещё раз:")

    elif step == "time":
        try:
            draft.event_time = datetime.strptime(text, "%H:%M").strftime("%H:%M")
            db.commit()
            await message.answer(t("step_venue", lang), reply_markup=get_skip_kb())
        except ValueError:
            await message.answer("Формат: ЧЧ:ММ\nПопробуйте ещё раз:")

    elif step == "venue":
        draft.location = text
        db.commit()
        await message.answer(t("step_address", lang), reply_markup=get_skip_kb())

    elif step == "address":
        draft.address = text
        db.commit()
        await message.answer(t("step_description", lang), reply_markup=get_skip_kb())

    elif step == "description":
        if text == "\u23ed\ufe0f Пропустить":
            draft.description = None
        else:
            draft.description = text
        db.commit()
        await message.answer(t("step_photos", lang), reply_markup=get_done_kb())


@router.callback_query(lambda c: c.data == "skip_step")
async def cb_skip_step(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    profile = get_profile(db, callback.from_user.id)
    if not profile or not profile.invitation_id:
        return

    draft = db.query(Invitation).filter(Invitation.id == profile.invitation_id).first()
    if not draft:
        return

    step = get_wizard_step(draft)

    if step == "title":
        draft.title = "Без названия"
        db.commit()
        await callback.message.edit_text(t("step_date", lang), reply_markup=get_skip_kb())
    elif step == "date":
        draft.event_date = datetime.now().date()
        db.commit()
        await callback.message.edit_text(t("step_time", lang), reply_markup=get_skip_kb())
    elif step == "time":
        draft.event_time = "18:00"
        db.commit()
        await callback.message.edit_text(t("step_venue", lang), reply_markup=get_skip_kb())
    elif step == "venue":
        draft.location = "—"
        db.commit()
        await callback.message.edit_text(t("step_address", lang), reply_markup=get_skip_kb())
    elif step == "address":
        draft.address = "—"
        db.commit()
        await callback.message.edit_text(t("step_description", lang), reply_markup=get_skip_kb())
    elif step == "description":
        draft.description = None
        db.commit()
        await callback.message.edit_text(t("step_photos", lang), reply_markup=get_done_kb())
    elif step == "description":
        draft.description = None
        db.commit()
        await callback.message.edit_text(t("step_photos", lang), reply_markup=get_done_kb())
    elif step == "photos":
        url = f"{settings.INVITE_BASE_URL}/{draft.slug}"
        await callback.message.edit_text(
            t("invitation_created", lang),
            reply_markup=get_share_kb(draft.slug),
        )
    await callback.answer()


@router.callback_query(lambda c: c.data == "done_photos")
async def cb_done_photos(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    profile = get_profile(db, callback.from_user.id)
    if not profile or not profile.invitation_id:
        return

    draft = db.query(Invitation).filter(Invitation.id == profile.invitation_id).first()
    if not draft:
        return

    await callback.message.edit_text(
        t("invitation_created", lang),
        reply_markup=get_share_kb(draft.slug),
    )
    await callback.answer()


@router.message(lambda m: m.photo)
async def handle_photo(message: Message, db):
    profile = get_profile(db, message.from_user.id)
    if not profile or not profile.invitation_id:
        return

    draft = db.query(Invitation).filter(Invitation.id == profile.invitation_id).first()
    if not draft or draft.status != "DRAFT":
        return

    photo = message.photo[-1]
    file = await message.bot.get_file(photo.file_id)
    file_bytes = await message.bot.download_file(file.file_path)

    content = file_bytes.read()
    object_key = generate_object_key(str(draft.id), f"{photo.file_id}.jpg")
    url = upload_file(content, object_key)

    max_order = db.query(Photo).filter(Photo.invitation_id == draft.id).count()
    photo_record = Photo(
        invitation_id=draft.id,
        url=url,
        object_key=object_key,
        sort_order=max_order,
    )
    db.add(photo_record)
    db.commit()

    await message.answer(f"\u2705 Фото добавлено ({max_order + 1})")


@router.callback_query(lambda c: c.data == "my_invitations")
async def cb_my_invitations(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    profile = get_profile(db, callback.from_user.id)
    if not profile:
        return

    invitations = (
        db.query(Invitation)
        .order_by(Invitation.created_at.desc())
        .limit(10)
        .all()
    )

    if not invitations:
        await callback.message.edit_text(
            t("no_invitations", lang),
            reply_markup=get_mini_app_kb(),
        )
        await callback.answer()
        return

    builder = InlineKeyboardBuilder()
    for inv in invitations:
        is_draft = inv.status == "DRAFT"
        title = inv.title or "Без названия"
        if is_draft:
            builder.row(
                InlineKeyboardButton(
                    text=f"\U0001f504 {title} (черновик)",
                    callback_data=f"continue:{inv.id}",
                )
            )
        else:
            builder.row(
                InlineKeyboardButton(
                    text=f"\u2705 {title}",
                    callback_data=f"inv_card:{inv.id}",
                )
            )

    await callback.message.edit_text(
        "\U0001f4c2 <b>Мои приглашения</b>", reply_markup=builder.as_markup()
    )
    await callback.answer()


@router.callback_query(lambda c: c.data.startswith("continue:"))
async def cb_continue_draft(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    invitation_id = callback.data.split(":")[1]
    inv = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not inv:
        await callback.answer("Not found", show_alert=True)
        return

    profile = get_profile(db, callback.from_user.id)
    if profile:
        profile.invitation_id = inv.id
        db.commit()

    step = get_wizard_step(inv)
    step_texts = {
        "title": t("step_title", lang),
        "date": t("step_date", lang),
        "time": t("step_time", lang),
        "venue": t("step_venue", lang),
        "address": t("step_address", lang),
        "description": t("step_description", lang),
        "photos": t("step_photos", lang),
    }
    text = step_texts.get(step)
    kb = get_done_kb() if step == "photos" else get_skip_kb()
    if text:
        await callback.message.edit_text(text, reply_markup=kb)
    else:
        await callback.message.edit_text(
            t("invitation_created", lang),
            reply_markup=get_share_kb(inv.slug),
        )
    await callback.answer()


@router.callback_query(lambda c: c.data.startswith("inv_card:"))
async def cb_invitation_card(callback: CallbackQuery, db):
    invitation_id = callback.data.split(":")[1]
    inv = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not inv:
        await callback.answer("Not found", show_alert=True)
        return

    from app.telegram.keyboards.inline import get_invitation_card_kb
    is_draft = inv.status == "DRAFT"
    kb = get_invitation_card_kb(str(inv.id), inv.slug, is_draft)
    title = inv.title or "Без названия"
    status_text = "Черновик" if inv.status == "DRAFT" else "Активно"
    date_str = inv.event_date.strftime("%d.%m.%Y") if inv.event_date else "—"
    text = f"<b>{title}</b>\n{status_text}\n{date_str}"
    await callback.message.edit_text(text, reply_markup=kb)
    await callback.answer()


@router.callback_query(lambda c: c.data.startswith("stats:"))
async def cb_stats(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    invitation_id = callback.data.split(":")[1]

    inv = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not inv:
        await callback.answer("Not found", show_alert=True)
        return

    guests = db.query(Guest).filter(Guest.invitation_id == invitation_id).all()
    confirmed = sum(1 for g in guests if g.status == "CONFIRMED")
    declined = sum(1 for g in guests if g.status == "DECLINED")
    pending = sum(1 for g in guests if g.status == "PENDING")
    total_guests = sum(g.guests_count for g in guests if g.status == "CONFIRMED")

    text = (
        t("stats_header", lang, title=inv.title or "—") + "\n\n"
        + t("stats_total", lang, total=len(guests)) + "\n"
        + t("stats_confirmed", lang, confirmed=confirmed) + "\n"
        + t("stats_declined", lang, declined=declined) + "\n"
        + t("stats_pending", lang, pending=pending) + "\n\n"
        + t("stats_guests", lang, guests=total_guests)
    )

    await callback.message.edit_text(text, reply_markup=get_back_to_menu_kb())
    await callback.answer()


@router.callback_query(lambda c: c.data.startswith("qr:"))
async def cb_qr(callback: CallbackQuery, db):
    slug = callback.data.split(":")[1]
    url = f"{settings.INVITE_BASE_URL}/{slug}"
    qr_buffer = generate_qr_code(url)

    photo = BufferedInputFile(qr_buffer.getvalue(), filename="qr.png")
    await callback.message.answer_photo(photo, caption=f"\U0001f4f1 QR-код:\n{url}")
    await callback.answer()


@router.callback_query(lambda c: c.data == "my_link")
async def cb_my_link(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    profile = get_profile(db, callback.from_user.id)
    if not profile:
        return

    invitations = (
        db.query(Invitation)
        .filter(Invitation.status == "ACTIVE")
        .order_by(Invitation.created_at.desc())
        .limit(5)
        .all()
    )

    if not invitations:
        await callback.message.edit_text(
            t("no_invitations", lang), reply_markup=get_mini_app_kb()
        )
        await callback.answer()
        return

    lines = ["\U0001f517 <b>Ваши ссылки:</b>\n"]
    for inv in invitations:
        title = inv.title or "—"
        url = f"{settings.INVITE_BASE_URL}/{inv.slug}"
        lines.append(f"\U0001f48d {title}\n{url}")

    await callback.message.edit_text("\n".join(lines), reply_markup=get_back_to_menu_kb())
    await callback.answer()


@router.callback_query(lambda c: c.data == "my_guests")
async def cb_my_guests(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    profile = get_profile(db, callback.from_user.id)
    if not profile:
        return

    invitations = (
        db.query(Invitation)
        .order_by(Invitation.created_at.desc())
        .limit(10)
        .all()
    )

    if not invitations:
        await callback.message.edit_text(
            t("no_invitations", lang), reply_markup=get_mini_app_kb()
        )
        await callback.answer()
        return

    builder = InlineKeyboardBuilder()
    for inv in invitations:
        guest_count = db.query(Guest).filter(Guest.invitation_id == inv.id).count()
        title = inv.title or "Без названия"
        builder.row(
            InlineKeyboardButton(
                text=f"\U0001f465 {title} ({guest_count})",
                callback_data=f"stats:{inv.id}",
            )
        )
    builder.row(
        InlineKeyboardButton(text="\U0001f3e0 Главное меню", callback_data="menu")
    )

    await callback.message.edit_text(
        "\U0001f465 <b>Гости по приглашениям</b>", reply_markup=builder.as_markup()
    )
    await callback.answer()


@router.callback_query(lambda c: c.data.startswith("edit:"))
async def cb_edit(callback: CallbackQuery, db):
    lang = callback.from_user.language_code or "ru"
    invitation_id = callback.data.split(":")[1]
    inv = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not inv:
        await callback.answer("Not found", show_alert=True)
        return

    profile = get_profile(db, callback.from_user.id)
    if profile:
        profile.invitation_id = inv.id
        db.commit()

    if not inv.title or inv.title == "":
        await callback.message.edit_text(t("step_title", lang), reply_markup=get_skip_kb())
    elif inv.event_date == datetime.now().date() and inv.event_time == "18:00":
        await callback.message.edit_text(t("step_date", lang), reply_markup=get_skip_kb())
    elif inv.event_time == "18:00" and not inv.location:
        await callback.message.edit_text(t("step_time", lang), reply_markup=get_skip_kb())
    elif not inv.location or inv.location == "":
        await callback.message.edit_text(t("step_venue", lang), reply_markup=get_skip_kb())
    elif not inv.address or inv.address == "":
        await callback.message.edit_text(t("step_address", lang), reply_markup=get_skip_kb())
    elif inv.description is None and inv.program is None:
        await callback.message.edit_text(t("step_description", lang), reply_markup=get_skip_kb())
    else:
        await callback.message.edit_text(
            t("invitation_created", lang),
            reply_markup=get_share_kb(inv.slug),
        )
    await callback.answer()
