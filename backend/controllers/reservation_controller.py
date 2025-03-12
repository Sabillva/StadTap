from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
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

# @router.post("/create")
# def create_reservation(
#         user_id: int,
#         stadium_id: int,
#         time_slot: str,
#         date: str,
#         payment_intent_id: str,
#         db: Session = Depends(get_db)
# ):
#     try:
#         payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
#         if payment_intent.status != "succeeded":
#             raise HTTPException(status_code=400, detail="Payment not completed.")
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
#
#     response, status_code = ReservationService.create_reservation(
#         user_id, stadium_id, time_slot, date, payment_intent_id, db
#     )
#
#     if status_code != 201:
#         raise HTTPException(status_code=status_code, detail=response["message"])
#
#     return response
