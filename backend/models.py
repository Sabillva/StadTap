from pydantic import BaseModel, EmailStr, validator, Field
import re
from typing import Optional
import uuid
from enum import Enum

# User-related models
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

    @validator('first_name', 'last_name')
    def validate_azerbaijani_names(cls, v):
        if not re.match(r'^[a-zA-ZəöüğçşıƏÖÜĞÇŞI\s-]+$', v):
            raise ValueError('Name must contain only Azerbaijani Latin characters')
        return v.title()

class UserCreate(UserBase):
    username: str
    password: str
    confirm_password: str

    @validator('username')
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers and underscores')
        return v

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

    @validator('confirm_password')
    def validate_confirm_password(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    hashed_password: str
    role: str = "user"
    disabled: bool = False

class PasswordChange(BaseModel):
    old_password: str
    new_password: str
    confirm_new_password: str

    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

    @validator('confirm_new_password')
    def validate_confirm_new_password(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

# Stadium-related models
class StadiumBase(BaseModel):
    stadium_name: str
    tea: bool
    shower: bool
    parking: bool
    video_camera: bool
    location: str
    number_of_fields: int
    stadium_length: float
    stadium_width: float
    stadium_type: str
    working_hours: str
    phone_number: str
    price: int
    latitude: float
    longitude: float
    city: str

    @validator('stadium_type')
    def validate_stadium_type(cls, v):
        if v.lower() not in ["indoor", "outdoor"]:
            raise ValueError('Stadium type must be either "indoor" or "outdoor"')
        return v.lower()

    @validator('phone_number')
    def validate_phone_number(cls, v):
        if not v.startswith("+994"):
            raise ValueError("Phone must start with +994")
        if len(v[4:]) != 9:
            raise ValueError("Phone must be 9 digits after +994")
        if not v[4:].isdigit():
            raise ValueError("Phone must contain only digits after +994")
        return v


class StadiumInDB(StadiumBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_id: str
    status: str = "pending"

class StadiumUpdate(BaseModel):
    stadium_name: Optional[str] = None
    tea: Optional[bool] = None
    shower: Optional[bool] = None
    parking: Optional[bool] = None
    video_camera: Optional[bool] = None
    location: Optional[str] = None
    number_of_fields: Optional[int] = None
    stadium_length: Optional[float] = None
    stadium_width: Optional[float] = None
    stadium_type: Optional[str] = None
    working_hours: Optional[str] = None
    phone_number: Optional[str] = None
    price: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str