from fastapi import APIRouter, Depends, HTTPException, status
from models import ReservationCreate, ReservationResponse
from auth.routes import get_current_user
from reservations.manager import ReservationManager

router = APIRouter(prefix="/reservations", tags=["User Reservations"])


@router.post("/", response_model=ReservationResponse)
async def create_reservation(
        reservation: ReservationCreate,
        user: dict = Depends(get_current_user)
):
    result = ReservationManager.make_reservation(
        user_id=user["id"],
        stadium_id=reservation.stadium_id,
        date=reservation.date,
        hour=reservation.hour
    )

    # Handle error case
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )

    return result


@router.delete("/{reservation_id}")
async def delete_reservation(
        reservation_id: str,
        user: dict = Depends(get_current_user)
):
    reservation = next(
        (res for res in ReservationManager.get_reservations()
         if res["reservation_id"] == reservation_id),
        None
    )
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    if reservation["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your reservation")

    if ReservationManager.delete_reservation(reservation_id):
        return {"message": "Reservation deleted"}
    raise HTTPException(status_code=400, detail="Deletion failed")