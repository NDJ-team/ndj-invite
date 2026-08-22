from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

from app.models.invitation import Invitation
from app.models.guest import Guest
from app.models.telegram_user import TelegramProfile
from app.auth.utils import is_admin_user

router = Router()


@router.message(Command("admin"))
async def cmd_admin(message: Message, db):
    if not is_admin_user(db, message.from_user.id):
        await message.answer("\u274c Нет доступа")
        return
    await message.answer(
        "\U0001f6e1\ufe0f <b>Админ-панель</b>\n\n"
        "/stats — статистика\n"
        "/orders — последние заказы"
    )


@router.message(Command("stats"))
async def cmd_stats(message: Message, db):
    if not is_admin_user(db, message.from_user.id):
        return

    total = db.query(Invitation).count()
    active = db.query(Invitation).filter(Invitation.status == "ACTIVE").count()
    total_rsvp = db.query(Guest).count()
    confirmed = db.query(Guest).filter(Guest.status == "CONFIRMED").count()

    await message.answer(
        f"\U0001f4ca <b>NDJ Invite</b>\n\n"
        f"<b>Всего:</b>\n"
        f"Приглашений: {total}\n"
        f"Активных: {active}\n"
        f"RSVP: {total_rsvp}\n"
        f"Подтверждено: {confirmed}"
    )


@router.message(Command("orders"))
async def cmd_orders(message: Message, db):
    if not is_admin_user(db, message.from_user.id):
        return

    invitations = (
        db.query(Invitation)
        .order_by(Invitation.created_at.desc())
        .limit(10)
        .all()
    )

    if not invitations:
        await message.answer("\U0001f4ed Заказов пока нет.")
        return

    lines = ["\U0001f4cb <b>Последние приглашения:</b>\n"]
    for inv in invitations:
        lines.append(
            f"{inv.title} | {inv.status} | {inv.event_date}"
        )

    await message.answer("\n".join(lines))
