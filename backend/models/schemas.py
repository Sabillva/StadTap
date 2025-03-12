from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr


# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# --- Stadium Owner Application Schemas ---
class OwnerApplicationCreate(BaseModel):
    email: EmailStr
    stadium_name: str
    location: str
    latitude: float
    longitude: float
    contact_number: str
    website: Optional[str] = None
    pitch_type: str
    pitch_dimensions: str
    number_of_pitches: Optional[int] = None
    fencing: bool
    lighting: bool
    indoor_outdoor: str
    fencing: bool
    changing_rooms: bool
    showers: bool
    parking: bool
    seating_area: bool
    equipment_rental: Optional[str] = None
    opening_hours: str
    pricing: str
    cafe: bool
    pitch_photos: Optional[List[str]] = None  # List of image URLs
    other_details: Optional[str] = None


class OwnerApplicationResponse(BaseModel):
    id: int
    email: EmailStr
    stadium_name: str
    location: str
    latitude: float
    longitude: float
    contact_number: str
    website: Optional[str] = None
    pitch_type: str
    pitch_dimensions: str
    number_of_pitches: Optional[int] = None
    lighting: bool
    indoor_outdoor: str
    fencing: bool
    changing_rooms: bool
    showers: bool
    parking: bool
    seating_area: bool
    equipment_rental: Optional[str] = None
    opening_hours: str
    pricing: float
    cafe: bool
    pitch_photos: List[str] = None  # List of image URLs
    other_details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Payment Schema ---
class PaymentIntentRequest(BaseModel):
    stadium_id: int
    currency: str = "usd"
    time_slot: str  # Add time_slot (required for reservation)
    date: str       # Add date (required for reservation)
