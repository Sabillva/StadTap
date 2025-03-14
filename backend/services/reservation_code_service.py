import secrets
from datetime import datetime, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session
from starlette import status

from backend.models.models import ReservationCode, Reservation, Stadium


def generate_code(length=6):
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def create_reservation_code(db: Session, reservation_id: int):
    # Generate a unique code
    code = generate_code()

    # Set expiration time (e.g., 3 days from now)
    expires_at = datetime.now() + timedelta(days=3)

    # Create and save the reservation code
    reservation_code = ReservationCode(
        code=code,
        reservation_id=reservation_id,
        expires_at=expires_at
    )
    db.add(reservation_code)
    db.commit()
    db.refresh(reservation_code)

    return reservation_code


def approve_reservation_code(db: Session, code: str, owner_id: int):
    # Fetch the reservation code
    reservation_code = db.query(ReservationCode).filter(ReservationCode.code == code).first()
    if not reservation_code:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid code"
        )

    # Check if the code has expired
    if datetime.now() > reservation_code.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code has expired"
        )

    # Fetch the reservation associated with the code
    reservation = db.query(Reservation).filter(Reservation.id == reservation_code.reservation_id).first()
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )

    # Fetch the stadium associated with the reservation
    stadium = db.query(Stadium).filter(Stadium.id == reservation.stadium_id).first()
    if not stadium:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stadium not found"
        )

    # Check if the owner is the owner of the stadium
    if stadium.owner_id != owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not the owner of this stadium"
        )

    db.commit()

    return {"message": "Reservation approved successfully"}
