from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import secrets
import redis
import json
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import SignupInitRequest, VerifyOTPRequest, SignupCompleteRequest, PasswordChange, Token
from .services import get_current_user, authenticate_user, create_access_token, verify_password, get_password_hash, send_email, otp_generator
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
redis_client = redis.Redis(host="localhost", port=6379, db=0)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

@router.post("/signup")
async def signup_initiate(data: SignupInitRequest, response: Response):
    # Generate session ID
    session_id = secrets.token_urlsafe(32)
    
    # Store data in Redis (expires in 15 mins)
    user_data = {
        "email": data.email,
        "first_name": data.first_name,
        "last_name": data.last_name,
        "otp": otp_generator()
    }
    redis_client.setex(
        f"signup_session:{session_id}",
        900,  # 15-minute TTL
        json.dumps(user_data)
    )
    
    # Set secure cookie
    response.set_cookie(
        key="signup_session_id",
        value=session_id,
        httponly=True,
        secure=True,  # HTTPS only
        samesite="lax",
        max_age=900,
    )


    send_email(user_data["email"], user_data["otp"])
    
    return {"message": "OTP sent to email"}

@router.post("/signup/verify-otp")
async def verify_otp(data: VerifyOTPRequest, request: Request):
    # Get session ID from cookie
    session_id = request.cookies.get("signup_session_id")
    if not session_id:
        raise HTTPException(400, "Session expired")
    
    # Fetch data from Redis
    user_data = redis_client.get(f"signup_session:{session_id}")
    if not user_data:
        raise HTTPException(400, "Session expired")
    
    user_data = json.loads(user_data)
    
    # Validate OTP (simplified)
    if data.otp != user_data["otp"]:
        raise HTTPException(400, "Invalid OTP")
    
    # Mark OTP as verified (for step 2)
    user_data["otp_verified"] = True
    redis_client.setex(
        f"signup_session:{session_id}",
        900,  # Reset TTL
        json.dumps(user_data)
    )
    
    return {"message": "OTP verified. Proceed to /signup/step2"}



@router.post("/signup/step2")
async def signup_complete(
    data: SignupCompleteRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    # Get session ID from cookie
    session_id = request.cookies.get("signup_session_id")
    if not session_id:
        raise HTTPException(400, "Session expired")
    
    # Fetch data from Redis
    user_data = redis_client.get(f"signup_session:{session_id}")
    if not user_data:
        raise HTTPException(400, "Session expired")
    
    user_data = json.loads(user_data)
    
    # Check if OTP was verified
    if not user_data.get("otp_verified"):
        raise HTTPException(400, "OTP not verified")
    
    # Check if username or email already exists
    existing_user = db.query(User).filter(
        (User.username == data.username) | 
        (User.email == user_data["email"])
    ).first()
    
    if existing_user:
        raise HTTPException(400, "Username or email already registered")
    
    # Create new user
    db_user = User(
        username=data.username,
        email=user_data["email"],
        first_name=user_data["first_name"],
        last_name=user_data["last_name"],
        hashed_password=get_password_hash(data.password),
        role="user",
        owned_stadiums=[]
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Clear session cookie
    response.delete_cookie("signup_session_id")
    redis_client.delete(f"signup_session:{session_id}")
    
    return {"message": "Registration complete!"}


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/change-password")
async def change_password(
        password_change: PasswordChange,
        db: Session = Depends(get_db),
        current_user: dict = Depends(get_current_user)
):
    if not verify_password(password_change.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    
    try:
        current_user.hashed_password = get_password_hash(password_change.new_password)
        db.commit()
        return {"message": "Password updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))    