from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.guest import Guest
from app.models.invitation import Invitation
from app.models.admin import Admin
from app.schemas.guest import GuestCreate, GuestUpdate, GuestResponse, GuestStats
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/api", tags=["guests"])


@router.get("/invitations/{invitation_id}/guests", response_model=list[GuestResponse])
def list_guests(invitation_id: str, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    guests = db.query(Guest).filter(Guest.invitation_id == invitation_id).order_by(Guest.created_at.desc()).all()
    return guests


@router.get("/invitations/{invitation_id}/guests/stats", response_model=GuestStats)
def guest_stats(invitation_id: str, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    guests = db.query(Guest).filter(Guest.invitation_id == invitation_id).all()
    confirmed = sum(1 for g in guests if g.status == "CONFIRMED")
    declined = sum(1 for g in guests if g.status == "DECLINED")
    pending = sum(1 for g in guests if g.status == "PENDING")
    total_guests = sum(g.guests_count for g in guests if g.status == "CONFIRMED")
    return GuestStats(total=len(guests), confirmed=confirmed, declined=declined, pending=pending, total_guests=total_guests)


@router.put("/guests/{guest_id}", response_model=GuestResponse)
def update_guest(guest_id: str, body: GuestUpdate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(guest, key, value)
    db.commit()
    db.refresh(guest)
    return guest


@router.delete("/guests/{guest_id}")
def delete_guest(guest_id: str, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    db.delete(guest)
    db.commit()
    return {"message": "Deleted"}
