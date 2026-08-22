from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./ndj_invite.db"
    SECRET_KEY: str = "change-me-to-a-random-secret-key"

    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET: str = "ndj-invite"
    S3_REGION: str = "us-east-1"

    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"
    NEXT_PUBLIC_APP_URL: str = "http://localhost:3000"
    NEXT_PUBLIC_BASE_URL: str = "http://localhost:3000"

    ADMIN_EMAIL: str = "admin@ndj.group"
    ADMIN_PASSWORD: str = "admin123"
    ADMIN_NAME: str = "NDJ Admin"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"

    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024

    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_ADMIN_CHAT_ID: str = ""
    TELEGRAM_WEBHOOK_SECRET: str = ""
    TELEGRAM_MODE: str = "polling"
    TELEGRAM_WEBHOOK_URL: str = "https://your-domain.com/api/telegram/webhook"

    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: str = ""
    NEXT_PUBLIC_TELEGRAM_MINI_APP_URL: str = ""

    INVITE_BASE_URL: str = "https://invite.ndj.group"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
