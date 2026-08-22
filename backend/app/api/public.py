from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.invitation import Invitation
from app.models.guest import Guest
from app.models.photo import Photo
from app.models.telegram_user import TelegramProfile
from app.schemas.invitation import InvitationPublic
from app.schemas.guest import GuestCreate, RSVPResponse
from app.services.qr import generate_qr_code
from app.services.notification import notification_service
from app.config import get_settings

router = APIRouter(prefix="/api/public", tags=["public"])
settings = get_settings()


@router.get("/invitations/{slug}", response_model=InvitationPublic)
def get_public_invitation(slug: str, db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    if invitation.status != "ACTIVE":
        raise HTTPException(status_code=404, detail="Invitation not available")
    return invitation


@router.get("/invitations/{slug}/photos")
def get_invitation_photos(slug: str, db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    photos = db.query(Photo).filter(Photo.invitation_id == invitation.id).order_by(Photo.sort_order).all()
    return [{"id": str(p.id), "url": p.url, "sort_order": p.sort_order} for p in photos]


@router.post("/invitations/{slug}/rsvp", response_model=RSVPResponse)
async def rsvp(slug: str, body: GuestCreate, db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    if invitation.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="Invitation is not active")
    guest = Guest(
        invitation_id=invitation.id,
        name=body.name,
        phone=body.phone,
        guests_count=body.guests_count if body.status == "CONFIRMED" else 0,
        status=body.status,
    )
    db.add(guest)
    db.commit()

    profile = db.query(TelegramProfile).filter(
        TelegramProfile.invitation_id == invitation.id
    ).first()
    if profile:
        try:
            await notification_service.send_new_rsvp(
                user_chat_id=profile.telegram_user_id,
                invitation_title=invitation.title,
                guest_name=body.name,
                status=body.status,
                guest_count=body.guests_count,
            )
        except Exception:
            pass

    msg = "Спасибо! Ждём вас!" if body.status == "CONFIRMED" else "Спасибо за ответ!"
    return RSVPResponse(success=True, message=msg)


@router.get("/invitations/{slug}/qr")
def get_qr(slug: str, db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    url = f"{settings.NEXT_PUBLIC_BASE_URL}/invite/{slug}"
    qr_buffer = generate_qr_code(url)
    return StreamingResponse(qr_buffer, media_type="image/png", headers={"Content-Disposition": f"inline; filename=qr-{slug}.png"})
