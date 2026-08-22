import httpx

from app.config import get_settings

settings = get_settings()


class TelegramNotificationService:
    def __init__(self):
        self.bot_token = settings.TELEGRAM_BOT_TOKEN
        self.admin_chat_id = settings.TELEGRAM_ADMIN_CHAT_ID
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}"

    async def _send_message(
        self, chat_id: str | int, text: str, reply_markup: dict | None = None
    ) -> bool:
        if not self.bot_token:
            return False
        payload = {"chat_id": str(chat_id), "text": text, "parse_mode": "HTML"}
        if reply_markup:
            payload["reply_markup"] = reply_markup
        async with httpx.AsyncClient() as client:
            resp = await client.post(f"{self.api_url}/sendMessage", json=payload)
            return resp.status_code == 200

    async def _send_photo(
        self, chat_id: str | int, photo_url: str, caption: str = ""
    ) -> bool:
        if not self.bot_token:
            return False
        payload = {
            "chat_id": str(chat_id),
            "photo": photo_url,
            "caption": caption,
            "parse_mode": "HTML",
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(f"{self.api_url}/sendPhoto", json=payload)
            return resp.status_code == 200

    async def send_new_order(
        self, client_name: str, event_title: str, plan: str, amount: float
    ):
        text = (
            f"\U0001f514 <b>Новый заказ</b>\n\n"
            f"<b>Клиент:</b> {client_name}\n"
            f"<b>Мероприятие:</b> {event_title}\n"
            f"<b>Тариф:</b> {plan}\n"
            f"<b>Сумма:</b> {amount:,.0f} сом\n"
            f"<b>Статус:</b> Ожидает оплаты"
        )
        return await self._send_message(self.admin_chat_id, text)

    async def send_payment_success(self, client_name: str, event_title: str):
        text = (
            f"\u2705 <b>Оплата получена</b>\n\n"
            f"<b>Клиент:</b> {client_name}\n"
            f"<b>Мероприятие:</b> {event_title}"
        )
        return await self._send_message(self.admin_chat_id, text)

    async def send_invitation_published(
        self, user_chat_id: int, title: str, slug: str
    ):
        url = f"{settings.INVITE_BASE_URL}/{slug}"
        text = (
            f"\U0001f389 <b>Готово!</b>\n\n"
            f"Ваше приглашение опубликовано.\n\n"
            f"<b>{title}</b>\n"
            f"\U0001f517 {url}"
        )
        buttons = {
            "inline_keyboard": [
                [{"text": "\U0001f449 Открыть приглашение", "url": url}],
                [{"text": "\U0001f4f1 QR-код", "callback_data": f"qr:{slug}"}],
                [{"text": "\U0001f4c2 Мои приглашения", "callback_data": "my_invitations"}],
            ]
        }
        return await self._send_message(user_chat_id, text, buttons)

    async def send_new_rsvp(
        self,
        user_chat_id: int,
        invitation_title: str,
        guest_name: str,
        status: str,
        guest_count: int,
    ):
        if status == "CONFIRMED":
            icon = "\u2705 Будет"
        elif status == "DECLINED":
            icon = "\u274c Не сможет присутствовать"
        else:
            icon = "\u23f3 Ожидает"
        text = (
            f"\U0001f48c <b>Новый ответ на приглашение</b>\n\n"
            f"<b>{invitation_title}</b>\n\n"
            f"\U0001f464 {guest_name}\n"
            f"{icon}\n"
            f"\U0001f465 Гостей: {guest_count}"
        )
        return await self._send_message(user_chat_id, text)

    async def send_invitation_expired(self, user_chat_id: int, title: str):
        text = (
            f"\u23f0 <b>Приглашение истекло</b>\n\n"
            f"<b>{title}</b>\n\n"
            f"Срок действия приглашения истёк."
        )
        return await self._send_message(user_chat_id, text)


notification_service = TelegramNotificationService()
