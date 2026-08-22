import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from app.config import get_settings
from app.telegram.middlewares.db import DatabaseMiddleware
from app.telegram.handlers import start, menu, admin

settings = get_settings()
logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

bot = Bot(
    token=settings.TELEGRAM_BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML),
)
dp = Dispatcher()
dp.message.middleware(DatabaseMiddleware())
dp.callback_query.middleware(DatabaseMiddleware())
dp.include_router(start.router)
dp.include_router(menu.router)
dp.include_router(admin.router)


async def on_startup():
    logger.info("Starting Telegram bot...")
    me = await bot.get_me()
    logger.info(f"Bot: @{me.username} (ID: {me.id})")


async def on_shutdown():
    logger.info("Stopping Telegram bot...")
    await bot.session.close()


async def start_polling():
    dp.startup.register(on_startup)
    dp.shutdown.register(on_shutdown)
    await dp.start_polling(bot)


async def set_webhook():
    import httpx
    webhook_url = settings.TELEGRAM_WEBHOOK_URL
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/setWebhook"
    payload = {
        "url": webhook_url,
        "secret_token": settings.TELEGRAM_WEBHOOK_SECRET,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload)
        logger.info(f"Webhook set: {resp.status_code} {resp.text}")


if __name__ == "__main__":
    if settings.TELEGRAM_MODE == "polling":
        asyncio.run(start_polling())
    else:
        asyncio.run(set_webhook())
