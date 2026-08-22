from datetime import datetime
from pydantic import BaseModel


class PhotoResponse(BaseModel):
    id: str
    invitation_id: str
    url: str
    object_key: str
    sort_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PhotoReorderItem(BaseModel):
    id: str
    sort_order: int


class PhotoReorderRequest(BaseModel):
    photos: list[PhotoReorderItem]
