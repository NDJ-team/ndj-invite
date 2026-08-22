from datetime import date, datetime
from pydantic import BaseModel, Field, field_validator
from typing import Optional
import json


class ProgramItem(BaseModel):
    time: str
    title: str


class InvitationCreate(BaseModel):
    title: str = Field(..., max_length=500)
    slug: Optional[str] = None
    template_id: str = Field(default="minimal", max_length=50)
    event_type: str = Field(default="wedding", max_length=50)
    description: Optional[str] = None
    event_date: date
    event_time: str = Field(..., max_length=10)
    location: str = Field(..., max_length=500)
    address: str = Field(..., max_length=500)
    map_url: Optional[str] = None
    cover_photo_url: Optional[str] = None
    program: Optional[list[ProgramItem]] = None
    timezone: str = Field(default="Asia/Bishkek", max_length=50)


class InvitationUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    slug: Optional[str] = Field(None, max_length=255)
    template_id: Optional[str] = Field(None, max_length=50)
    event_type: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    event_date: Optional[date] = None
    event_time: Optional[str] = Field(None, max_length=10)
    location: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, max_length=500)
    map_url: Optional[str] = None
    cover_photo_url: Optional[str] = None
    program: Optional[list[ProgramItem]] = None
    timezone: Optional[str] = Field(None, max_length=50)


class InvitationResponse(BaseModel):
    id: str
    slug: str
    template_id: str
    event_type: str
    title: str
    description: Optional[str]
    event_date: date
    event_time: str
    location: str
    address: str
    map_url: Optional[str]
    status: str
    cover_photo_url: Optional[str]
    program: Optional[list[ProgramItem]]
    timezone: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("program", mode="before")
    @classmethod
    def parse_program(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return None
        return v


class InvitationPublic(BaseModel):
    id: str
    slug: str
    template_id: str
    event_type: str
    title: str
    description: Optional[str]
    event_date: date
    event_time: str
    location: str
    address: str
    map_url: Optional[str]
    status: str
    cover_photo_url: Optional[str]
    program: Optional[list[ProgramItem]]
    timezone: str

    model_config = {"from_attributes": True}

    @field_validator("program", mode="before")
    @classmethod
    def parse_program(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return None
        return v


class InvitationListResponse(BaseModel):
    id: str
    slug: str
    template_id: str
    title: str
    event_date: date
    event_time: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
