from sqlalchemy.orm import Session
from app.models.admin import Admin
from app.models.invitation import Invitation
from app.auth.dependencies import get_password_hash
from app.config import get_settings
from datetime import date


def seed_data(db: Session):
    settings = get_settings()

    admin = db.query(Admin).filter(Admin.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = Admin(
            name=settings.ADMIN_NAME,
            email=settings.ADMIN_EMAIL,
            password_hash=get_password_hash(settings.ADMIN_PASSWORD),
        )
        db.add(admin)
        db.commit()

    demo = db.query(Invitation).filter(Invitation.slug == "aliya-bekzat").first()
    if not demo:
        import json
        invitation = Invitation(
            slug="aliya-bekzat",
            template_id="minimal",
            event_type="wedding",
            title="Алия & Бекзат",
            description="Будем рады разделить с вами наш особенный день. Приглашаем вас на торжество по случаю нашей свадьбы!",
            event_date=date(2026, 9, 15),
            event_time="18:00",
            location="Ресторан Ала-Тоо",
            address="г. Бишкек, ул. Манаса 45",
            map_url="https://maps.google.com/?q=42.8746,74.5908",
            status="ACTIVE",
            program=json.dumps([
                {"time": "18:00", "title": "Сбор гостей"},
                {"time": "19:00", "title": "Торжественная часть"},
                {"time": "20:00", "title": "Банкет"},
                {"time": "22:00", "title": "Танцевальная программа"},
            ]),
        )
        db.add(invitation)
        db.commit()
