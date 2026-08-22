from aiogram import Router
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

from app.auth.utils import get_or_create_telegram_profile
from app.telegram.keyboards.inline import get_main_menu_kb
from app.telegram.i18n import t
from app.telegram.utils.deeplink import parse_deep_link
from app.config import get_settings

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message, db):
    user = message.from_user
    if not user:
        return

    lang = user.language_code or "ru"
    profile = get_or_create_telegram_profile(
        db,
        telegram_user_id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        language_code=lang,
    )

    args = message.text.split(maxsplit=1)
    if len(args) > 1:
        link_type, link_value = parse_deep_link(args[1])
        if link_type == "partner":
            profile.partner_code = link_value
            db.commit()
        elif link_type == "order":
            await handle_order_deep_link(message, db, lang, link_value)
            return

    settings = get_settings()
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(
            text="👉 Открыть создание приглашения",
            web_app={"url": settings.NEXT_PUBLIC_APP_URL},
        )
    )
    builder.row(
        InlineKeyboardButton(text="✨ Создать через бота", callback_data="create_invitation")
    )
    builder.row(
        InlineKeyboardButton(text="📂 Мои приглашения", callback_data="my_invitations"),
        InlineKeyboardButton(text="❓ Помощь", callback_data="help"),
    )

    text = t("start_welcome", lang, name=user.first_name or "друг")
    await message.answer(text, reply_markup=builder.as_markup())


@router.message(Command("menu"))
async def cmd_menu(message: Message):
    lang = (message.from_user and message.from_user.language_code) or "ru"
    settings = get_settings()
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(
            text="👉 Открыть приложение",
            web_app={"url": settings.NEXT_PUBLIC_APP_URL},
        )
    )
    builder.row(
        InlineKeyboardButton(text="✨ Главное меню", callback_data="menu")
    )
    await message.answer(t("menu_title", lang), reply_markup=builder.as_markup())


@router.message(Command("help"))
async def cmd_help(message: Message):
    lang = (message.from_user and message.from_user.language_code) or "ru"
    await message.answer(t("help_text", lang), reply_markup=get_main_menu_kb())


async def handle_order_deep_link(message: Message, db, lang: str, payload: str):
    """Handle /start order_template_name_phone from the order page"""
    parts = payload.split("_", 3)
    if len(parts) < 4:
        return

    template_id = parts[1]
    name = parts[2]
    phone = parts[3]

    from app.services.notification import notification_service
    await notification_service.send_new_order(
        client_name=name,
        event_title=template_id,
        plan=template_id,
        amount=0,
    )

    settings = get_settings()
    text = (
        "✅ <b>Заказ принят!</b>\n\n"
        f"Шаблон: <b>{template_id}</b>\n"
        f"Имя: {name}\n"
        f"Телефон: {phone}\n\n"
        "Наш менеджер свяжется с вами в ближайшее время. 💌"
    )
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(
            text="💬 Написать в чат",
            url=f"https://t.me/{settings.TELEGRAM_BOT_USERNAME}" if settings.TELEGRAM_BOT_USERNAME else "https://t.me/NDJInviteBot",
        )
    )
    builder.row(
        InlineKeyboardButton(text="🏠 Главное меню", callback_data="menu")
    )
    await message.answer(text, reply_markup=builder.as_markup())
