from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "supersupersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()