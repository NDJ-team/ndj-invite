from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.models.invitation import Invitation
from app.models.admin import Admin
from app.schemas.invitation import InvitationCreate, InvitationUpdate, InvitationResponse, InvitationListResponse
from app.auth.dependencies import get_current_admin
from app.services.slug import generate_slug, ensure_unique_slug

router = APIRouter(prefix="/api/invitations", tags=["invitations"])


@router.get("/", response_model=list[InvitationListResponse])
def list_invitations(admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    invitations = db.query(Invitation).order_by(Invitation.created_at.desc()).all()
    return invitations


@router.post("/", response_model=InvitationResponse, status_code=201)
def create_invitation(body: InvitationCreate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    slug = body.slug or generate_slug(body.title)
    slug = ensure_unique_slug(slug, db)
    program_data = [item.model_dump() for item in body.program] if body.program else None
    import json
    invitation = Invitation(
        slug=slug,
        template_id=body.template_id,
        event_type=body.event_type,
        title=body.title,
        description=body.description,
        event_date=body.event_date,
        event_time=body.event_time,
        location=body.location,
        address=body.address,
        map_url=body.map_url,
        cover_photo_url=body.cover_photo_url,
        program=json.dumps(program_data) if program_data else None,
        timezone=body.timezone,
        status="DRAFT",
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


@router.get("/{invitation_id}", response_model=InvitationResponse)
def get_invitation(invitation_id: str, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    return invitation


@router.put("/{invitation_id}", response_model=InvitationResponse)
def update_invitation(invitation_id: str, body: InvitationUpdate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    update_data = body.model_dump(exclude_unset=True)
    if "program" in update_data and update_data["program"] is not None:
        import json
        update_data["program"] = json.dumps([item.model_dump() if hasattr(item, "model_dump") else item for item in update_data["program"]])
    if "slug" in update_data and update_data["slug"]:
        update_data["slug"] = ensure_unique_slug(update_data["slug"], db, exclude_id=invitation_id)
    for key, value in update_data.items():
        setattr(invitation, key, value)
    db.commit()
    db.refresh(invitation)
    return invitation


@router.delete("/{invitation_id}")
def delete_invitation(invitation_id: str, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    db.delete(invitation)
    db.commit()
    return {"message": "Deleted"}


@router.post("/{invitation_id}/publish", response_model=InvitationResponse)
def publish_invitation(invitation_id: str, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    invitation.status = "ACTIVE"
    db.commit()
    db.refresh(invitation)
    return invitation


@router.post("/{invitation_id}/archive", response_model=InvitationResponse)
def archive_invitation(invitation_id: str, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    invitation.status = "ARCHIVED"
    db.commit()
    db.refresh(invitation)
    return invitation
