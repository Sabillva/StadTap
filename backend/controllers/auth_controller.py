from fastapi import APIRouter, Depends, HTTPException, status, Security, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.models import Applicant, AppUser, Stadium
from backend.models.schemas import UserCreate, UserResponse, Token, OwnerApplicationCreate, OwnerApplicationResponse
from backend.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    return AuthService.create_user(db, user)


@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = AuthService.create_token(user)

    response.set_cookie(
        key="access_token",
        value=f"Bearer {token.access_token}",
        httponly=True,  # Prevent client-side script access to the cookie
        max_age=1800,  # Cookie expiration time in seconds (30 minutes)
        samesite="lax",  # Helps prevent CSRF attacks
        secure=False,  # after implementing https make it true
    )

    return {"message": "Login successful"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}


@router.post("/apply-owner")
def apply_for_owner(
        applicant: OwnerApplicationCreate,
        db: Session = Depends(get_db),
):
    existing_application = db.query(Applicant).filter(Applicant.email == applicant.email).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="Application already submitted")

    new_applicant = Applicant(
        email=str(applicant.email),
        stadium_name=applicant.stadium_name,
        location=applicant.location,
        latitude=applicant.latitude,
        longitude=applicant.longitude,
        contact_number=applicant.contact_number,
        website=applicant.website,
        pitch_type=applicant.pitch_type,
        pitch_dimensions=applicant.pitch_dimensions,
        number_of_pitches=applicant.number_of_pitches,
        lighting=applicant.lighting,
        indoor_outdoor=applicant.indoor_outdoor,
        fencing=applicant.fencing,
        changing_rooms=applicant.changing_rooms,
        showers=applicant.showers,
        parking=applicant.parking,
        seating_area=applicant.seating_area,
        equipment_rental=applicant.equipment_rental,
        opening_hours=applicant.opening_hours,
        pricing=applicant.pricing,
        cafe=applicant.cafe,
        pitch_photos=applicant.pitch_photos,
        other_details=applicant.other_details,
        status="pending"
    )
    db.add(new_applicant)
    db.commit()
    return {"message": "Your application is under review"}


@router.get("/pending-owners", dependencies=[Depends(get_current_user)])
def get_pending_owners(
        current_user: AppUser = Security(get_current_user, scopes=["admin"]),
        db: Session = Depends(get_db)
):
    pending_applicants = db.query(Applicant).filter(Applicant.status == "pending").all()
    return pending_applicants


@router.post("/approve-owner/{email}")
def approve_owner(
        email: str,
        current_user: AppUser = Security(get_current_user, scopes=["admin"]),
        db: Session = Depends(get_db),
):
    applicant = db.query(Applicant).filter(Applicant.email == email, Applicant.status == "pending").first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Application not found or already processed")

    user = db.query(AppUser).filter(AppUser.email == email).first()
    if user:
        user.role = "owner"

        stadium = Stadium(
            owner_id=user.id,
            email=applicant.email,
            stadium_name=applicant.stadium_name,
            location=applicant.location,
            latitude=applicant.latitude,
            longitude=applicant.longitude,
            contact_number=applicant.contact_number,
            website=applicant.website,
            pitch_type=applicant.pitch_type,
            pitch_dimensions=applicant.pitch_dimensions,
            number_of_pitches=applicant.number_of_pitches,
            lighting=applicant.lighting,
            indoor_outdoor=applicant.indoor_outdoor,
            fencing=applicant.fencing,
            changing_rooms=applicant.changing_rooms,
            showers=applicant.showers,
            parking=applicant.parking,
            seating_area=applicant.seating_area,
            equipment_rental=applicant.equipment_rental,
            opening_hours=applicant.opening_hours,
            pricing=applicant.pricing,
            cafe=applicant.cafe,
            pitch_photos=applicant.pitch_photos,
            other_details=applicant.other_details
        )
        db.add(stadium)
        db.delete(applicant)

    else:
        applicant.status = "approved"

    db.commit()

    return {"message": "User approved as stadium owner"}


@router.post("/reject-owner/{email}")
def reject_owner(
        email: str,
        current_user: AppUser = Security(get_current_user, scopes=["admin"]),
        db: Session = Depends(get_db),
):
    applicant = db.query(Applicant).filter(Applicant.email == email).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(applicant)
    db.commit()
    return {"message": "Application rejected"}
