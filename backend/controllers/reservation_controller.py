from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from starlette import status

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.models import AppUser
from backend.services.reservation_code_service import approve_reservation_code
from backend.services.reservation_service import ReservationService

router = APIRouter(prefix="/reservations", tags=["Reservations"])


@router.get("/available-time-slots")
def get_available_time_slots(
        city: str,
        stadium_id: Optional[int] = None,
        date_option: str = "today",
        time_slots: Optional[List[str]] = Query(None),  # User can specify time slots
        db: Session = Depends(get_db)
):
    response = ReservationService.get_available_time_slots(city, stadium_id, date_option, time_slots, db)

    if "message" in response:
        raise HTTPException(status_code=404, detail=response["message"])

    return response


@router.post("/owner/approve-code")
def approve_code(
        code: str,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    # Ensure the current user is an owner
    if current_user.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can approve codes"
        )

    # Call the service to approve the code
    return approve_reservation_code(db, code, current_user.id)
