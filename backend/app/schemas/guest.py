from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class GuestCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=500)
    phone: Optional[str] = Field(None, max_length=50)
    guests_count: int = Field(default=1, ge=0, le=20)
    status: str = Field(default="CONFIRMED", pattern="^(CONFIRMED|DECLINED)$")


class GuestUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=50)
    guests_count: Optional[int] = Field(None, ge=0, le=20)
    status: Optional[str] = Field(None, pattern="^(PENDING|CONFIRMED|DECLINED)$")


class GuestResponse(BaseModel):
    id: str
    invitation_id: str
    name: str
    phone: Optional[str]
    guests_count: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GuestStats(BaseModel):
    total: int
    confirmed: int
    declined: int
    pending: int
    total_guests: int


class RSVPResponse(BaseModel):
    success: bool
    message: str
