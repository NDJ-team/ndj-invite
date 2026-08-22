import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base, SessionLocal
from app.api.auth import router as auth_router
from app.api.invitations import router as invitations_router
from app.api.photos import router as photos_router
from app.api.guests import router as guests_router
from app.api.public import router as public_router
from app.api.telegram import router as telegram_router
from app.seed import seed_data
from app.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

    try:
        from app.services.s3 import ensure_bucket
        ensure_bucket()
    except Exception:
        pass

    if settings.TELEGRAM_MODE == "webhook":
        from app.telegram.bot import set_webhook
        await set_webhook()

    yield

    from app.telegram.bot import bot
    await bot.session.close()


app = FastAPI(title="NDJ Invite API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(invitations_router)
app.include_router(photos_router)
app.include_router(guests_router)
app.include_router(public_router)
app.include_router(telegram_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def root():
    return {"status": "ok", "service": "NDJ Invite API"}


@app.get("/health")
def health():
    return {"status": "ok"}
