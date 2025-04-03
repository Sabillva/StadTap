import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

database_url = os.getenv("DATABASE_URL")
engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

Base.metadata.create_all(bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()