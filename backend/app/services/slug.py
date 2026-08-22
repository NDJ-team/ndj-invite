from slugify import slugify
from sqlalchemy.orm import Session
from app.models.invitation import Invitation


def generate_slug(title: str) -> str:
    return slugify(title, separator="-", lowercase=True)


def ensure_unique_slug(slug: str, db: Session, exclude_id=None) -> str:
    base_slug = slug
    counter = 2
    query = db.query(Invitation).filter(Invitation.slug == slug)
    if exclude_id:
        query = query.filter(Invitation.id != exclude_id)
    while query.first():
        slug = f"{base_slug}-{counter}"
        query = db.query(Invitation).filter(Invitation.slug == slug)
        if exclude_id:
            query = query.filter(Invitation.id != exclude_id)
        counter += 1
    return slug
