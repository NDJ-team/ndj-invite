from app.telegram.bot import start_polling
import asyncio

if __name__ == "__main__":
    asyncio.run(start_polling())
