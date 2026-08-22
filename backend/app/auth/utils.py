from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.admin import Admin
from app.models.telegram_user import TelegramProfile

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_telegram_token(admin_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": admin_id, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_telegram_token(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload.get("sub")
    except (JWTError, KeyError):
        return None


def get_or_create_telegram_profile(
    db: Session, telegram_user_id: int, **kwargs
) -> TelegramProfile:
    profile = (
        db.query(TelegramProfile)
        .filter(TelegramProfile.telegram_user_id == telegram_user_id)
        .first()
    )

    if profile:
        profile.username = kwargs.get("username") or profile.username
        profile.first_name = kwargs.get("first_name") or profile.first_name
        profile.last_name = kwargs.get("last_name") or profile.last_name
        profile.language_code = kwargs.get("language_code") or profile.language_code
        db.commit()
        db.refresh(profile)
        return profile

    profile = TelegramProfile(
        telegram_user_id=telegram_user_id,
        username=kwargs.get("username"),
        first_name=kwargs.get("first_name"),
        last_name=kwargs.get("last_name"),
        language_code=kwargs.get("language_code"),
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def is_admin_user(db: Session, telegram_user_id: int) -> bool:
    profile = (
        db.query(TelegramProfile)
        .filter(TelegramProfile.telegram_user_id == telegram_user_id)
        .first()
    )
    if profile and profile.admin_id:
        admin = db.query(Admin).filter(Admin.id == profile.admin_id).first()
        return admin is not None
    return False
