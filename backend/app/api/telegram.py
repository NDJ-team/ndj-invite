from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import json
import hashlib
import hmac
import time
from urllib.parse import unquote

from app.database import get_db
from app.config import get_settings
from app.auth.utils import get_or_create_telegram_profile, create_telegram_token
from app.schemas.telegram import TelegramAuthRequest, TelegramAuthResponse

settings = get_settings()
router = APIRouter(prefix="/api/telegram", tags=["telegram"])


def verify_telegram_init_data(init_data: str) -> dict | None:
    try:
        parsed = dict(item.split("=", 1) for item in unquote(init_data).split("&"))
    except (ValueError, AttributeError):
        return None

    hash_val = parsed.pop("hash", None)
    if not hash_val:
        return None

    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(parsed.items())
    )
    secret_key = hmac.new(
        b"WebAppData", settings.TELEGRAM_BOT_TOKEN.encode(), hashlib.sha256
    ).digest()
    computed_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    if computed_hash != hash_val:
        return None

    auth_date = int(parsed.get("auth_date", 0))
    if time.time() - auth_date > 86400:
        return None

    return parsed


@router.post("/auth", response_model=TelegramAuthResponse)
def telegram_auth(data: TelegramAuthRequest, db: Session = Depends(get_db)):
    user_data = verify_telegram_init_data(data.init_data)
    if not user_data:
        raise HTTPException(401, "Invalid Telegram init data")

    try:
        tg_user = json.loads(user_data.get("user", "{}"))
    except (json.JSONDecodeError, TypeError):
        tg_user = {}

    telegram_user_id = tg_user.get("id", 0)
    if not telegram_user_id:
        raise HTTPException(401, "Invalid Telegram user ID")

    profile = get_or_create_telegram_profile(
        db,
        telegram_user_id=telegram_user_id,
        username=tg_user.get("username"),
        first_name=tg_user.get("first_name"),
        last_name=tg_user.get("last_name"),
        language_code=tg_user.get("language_code"),
    )

    token = create_telegram_token(str(profile.id))
    return TelegramAuthResponse(
        access_token=token,
        profile_id=str(profile.id),
        is_new=False,
    )


@router.post("/webhook")
async def telegram_webhook(request: Request, db: Session = Depends(get_db)):
    secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
    if secret and secret != settings.TELEGRAM_WEBHOOK_SECRET:
        raise HTTPException(403, "Invalid webhook secret")

    from app.telegram.bot import dp
    from aiogram.types import Update

    body = await request.json()
    update = Update.model_validate(body)
    await dp.feed_update(update)
    return {"ok": True}
