from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, text
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(20), unique=True, index=True)
    email = Column(String(50), unique=True, index=True)
    first_name = Column(String(20))
    last_name = Column(String(20))
    hashed_password = Column(String(255))
    role = Column(String(10), default="user")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    owned_stadiums = Column(JSON, default=[])