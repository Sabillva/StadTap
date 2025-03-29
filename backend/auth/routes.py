from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import timedelta
from core.security import create_access_token, verify_password, get_password_hash
from core.storage import JSONStorage
from core.config import settings
from models import UserCreate, UserLogin, Token, UserInDB, PasswordChange, StadiumBase, StadiumInDB
from auth.validators import validate_unique_username, validate_unique_email
import uuid

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def authenticate_user(username: str, password: str):
    users = JSONStorage.get_users()
    user = next((u for u in users if u["username"] == username), None)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    users = JSONStorage.get_users()
    user = next((u for u in users if u["username"] == username), None)
    if user is None:
        raise credentials_exception
    return user


@router.post("/signup/user", response_model=UserInDB)
async def signup_user(user: UserCreate):
    try:
        validate_unique_username(user.username)
        validate_unique_email(user.email)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    hashed_password = get_password_hash(user.password)
    db_user = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "hashed_password": hashed_password,
        "role": "user",
        "disabled": False,
        "owned_stadiums" : []
    }

    JSONStorage.save_user(db_user)
    return db_user


@router.post("/owner-request", response_model=dict)
async def create_owner_request(
        stadium_data: StadiumBase,
        current_user: dict = Depends(get_current_user)
):
    """
    Create an owner request (authenticated users only)
    """
    db_stadium = StadiumInDB(
        **stadium_data.dict(),
        owner_id=current_user["id"]
    )

    StadiumInDB.generate_available_hours(db_stadium)

    JSONStorage.save_stadium(db_stadium.dict())

    return {
        "message": "Owner request submitted successfully",
        "stadium_id": db_stadium.id,
        "status": "pending"
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/change-password")
async def change_password(
        password_change: PasswordChange,
        current_user: dict = Depends(get_current_user)
):
    if not verify_password(password_change.old_password, current_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    new_hashed_password = get_password_hash(password_change.new_password)
    JSONStorage.update_user(current_user["id"], {"hashed_password": new_hashed_password})
    return {"message": "Password updated successfully"}