from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import uuid
from datetime import datetime


class SignupInitRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class VerifyOTPRequest(BaseModel):
    otp: str

class SignupCompleteRequest(BaseModel):
    username: str
    password: str

class PasswordChange(BaseModel):
    old_password: str
    new_password: str
    confirm_new_password: str

class UserOut(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    id: int
    username: str
    role: str
    created_at: datetime
    updated_at: datetime
    owned_stadiums: List = []

    class Config:
        orm_mode = True    


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
    opening_hour: str
    closing_hour: str
    phone_number: str
    price: int
    latitude: float
    longitude: float
    city: str



class StadiumInDB(StadiumBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_id: str
    status: str = "pending"
    available_hours: List[str] = []

    def generate_available_hours(self):
        """Generate available hours based on opening and closing time and number of fields."""
        available_hours = []
        start_hour = int(self.opening_hour.split(":")[0])
        end_hour = int(self.closing_hour.split(":")[0])

        for hour in range(start_hour, end_hour):
            time_slot = f"{hour}:00-{hour + 1}:00"
            for _ in range(self.number_of_fields):
                available_hours.append(time_slot)

        self.available_hours = available_hours

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

class ReservationCreate(BaseModel):
    stadium_id: str
    date: str  # YYYY-MM-DD
    hour: str  # HH:00-HH:00

class ReservationResponse(BaseModel):
    reservation_id: str
    user_id: str
    stadium_id: str
    date: str
    hour: str
    status: str

class Token(BaseModel):
    access_token: str
    token_type: str