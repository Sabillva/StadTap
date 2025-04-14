from typing import Optional

from fastapi import Depends, HTTPException, status, Cookie
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from .utils import SECRET_KEY, ALGORITHM
from ..database import get_db
from ..models.models import AppUser
from ..models.schemas import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


async def get_current_user(access_token: Optional[str] = Cookie(None, alias="access_token"),
                           db: Session = Depends(get_db)) -> AppUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not access_token:
        raise credentials_exception

    try:
        # Remove the "Bearer " prefix from the token
        token = access_token.split("Bearer ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except (JWTError, IndexError):
        raise credentials_exception

    user = db.query(AppUser).filter(AppUser.username == token_data.username).first()
    if user is None:
        raise credentials_exception

    return user
