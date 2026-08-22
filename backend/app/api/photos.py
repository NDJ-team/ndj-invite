from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.invitation import Invitation
from app.models.photo import Photo
from app.models.admin import Admin
from app.schemas.photo import PhotoResponse, PhotoReorderRequest
from app.auth.dependencies import get_current_admin
from app.services.s3 import generate_object_key, upload_file, delete_file
from app.config import get_settings

router = APIRouter(prefix="/api", tags=["photos"])
settings = get_settings()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/invitations/{invitation_id}/photos", response_model=PhotoResponse, status_code=201)
async def upload_photo(
    invitation_id: str,
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    invitation = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_TYPES)}")
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    object_key = generate_object_key(str(invitation_id), file.filename or "photo.jpg")
    url = upload_file(content, object_key, file.content_type or "image/jpeg")
    max_order = db.query(Photo).filter(Photo.invitation_id == invitation_id).count()
    photo = Photo(
        invitation_id=invitation_id,
        url=url,
        object_key=object_key,
        sort_order=max_order,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.delete("/photos/{photo_id}")
def delete_photo(photo_id: str, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    delete_file(photo.object_key)
    db.delete(photo)
    db.commit()
    return {"message": "Deleted"}


@router.put("/photos/{photo_id}/order", response_model=PhotoResponse)
def reorder_photo(photo_id: str, body: PhotoReorderRequest, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    for item in body.photos:
        p = db.query(Photo).filter(Photo.id == item.id).first()
        if p:
            p.sort_order = item.sort_order
    db.commit()
    db.refresh(photo)
    return photo
