from sqlalchemy import Column, Integer, String, Boolean, Text, Float, JSON, Enum, ForeignKey, Date
from sqlalchemy.orm import relationship

from backend.database import Base_Model


class AppUser(Base_Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), default="user")

    stadiums = relationship("Stadium", back_populates="owner")
    reservations = relationship("Reservation", back_populates="user")


class Applicant(Base_Model):
    __tablename__ = "applicants"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)  # Owner's email

    stadium_name = Column(String(150), nullable=False)
    location = Column(Text, nullable=False)  # Increased for better address support
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    contact_number = Column(String(20), nullable=False)
    website = Column(String(255), nullable=True)

    pitch_type = Column(String(50), nullable=False)
    pitch_dimensions = Column(String(50), nullable=True)
    number_of_pitches = Column(Integer, nullable=True)
    lighting = Column(Boolean, nullable=False)
    indoor_outdoor = Column(String(20), nullable=False)
    fencing = Column(Boolean, nullable=False)
    changing_rooms = Column(Boolean, nullable=False)
    showers = Column(Boolean, nullable=False)
    parking = Column(Boolean, nullable=False)
    seating_area = Column(Boolean, nullable=False)
    equipment_rental = Column(String(255), nullable=True)
    opening_hours = Column(Text, nullable=False)
    pricing = Column(Text, nullable=False)
    cafe = Column(Boolean, nullable=False)
    pitch_photos = Column(JSON, nullable=True)  # List of image URLs
    other_details = Column(Text, nullable=True)
    status = Column(Enum("pending", "approved", name="application_status"), default="pending")


class Stadium(Base_Model):
    __tablename__ = "stadiums"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    stadium_name = Column(String(150), nullable=False)
    location = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    contact_number = Column(String(20), nullable=False)
    website = Column(String(255), nullable=True)

    pitch_type = Column(String(50), nullable=False)
    pitch_dimensions = Column(String(50), nullable=True)
    number_of_pitches = Column(Integer, nullable=True)
    lighting = Column(Boolean, nullable=False)
    indoor_outdoor = Column(String(20), nullable=False)
    fencing = Column(Boolean, nullable=False)
    changing_rooms = Column(Boolean, nullable=False)
    showers = Column(Boolean, nullable=False)
    parking = Column(Boolean, nullable=False)
    seating_area = Column(Boolean, nullable=False)
    equipment_rental = Column(String(255), nullable=True)
    opening_hours = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    cafe = Column(Boolean, nullable=False)
    pitch_photos = Column(JSON, nullable=True)
    other_details = Column(Text, nullable=True)

    owner = relationship("AppUser", back_populates="stadiums")
    reservations = relationship("Reservation", back_populates="stadium")


class Reservation(Base_Model):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stadium_id = Column(Integer, ForeignKey("stadiums.id"), nullable=False)
    date = Column(Date, nullable=False)
    time_slot = Column(String(20), nullable=False)
    payment_status = Column(Enum("pending", "successful", "rejected"), default="pending")
    payment_intent_id = Column(String(50), nullable=True)  # Add this field

    # Relationships
    user = relationship("AppUser", back_populates="reservations")
    stadium = relationship("Stadium", back_populates="reservations")
