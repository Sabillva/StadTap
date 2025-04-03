from fastapi import APIRouter, Depends, HTTPException, status
from backend.schemas import ReservationResponse
from auth.routes import get_current_user
from reservations.manager import ReservationManager
from typing import List

router = APIRouter(prefix="/owner/reservations", tags=["Owner Reservations"])


@router.get("/", response_model=List[ReservationResponse])
async def get_reservations(
        status: str,
        date: str,
        stadium_id: str,
        user: dict = Depends(get_current_user),
):
    if user["owned_stadiums"] == []:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized, only for owners"
        )
    if stadium_id not in user["owned_stadiums"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized for this stadium"
        )

    reservations = ReservationManager.get_reservations_by_stadium_and_date(stadium_id, date)


    return [res for res in reservations if res["status"] == status]

@router.patch("/approve")
async def approve_reservation(
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

    if reservation["stadium_id"] not in user.get("owned_stadiums", []):
        raise HTTPException(status_code=403, detail="Not authorized for this stadium")

    if reservation["status"] != "pending":
        raise HTTPException(status_code=409, detail="Reservation status is not pending")

    if ReservationManager.approve_reservation(reservation_id):
        return {"message": "Reservation approved"}


@router.patch("/{reservation_id}/reject")
async def reject_reservation(
        reservation_id: str,
        user: dict = Depends(get_current_user)
):
    if user.owned_stadiums == []:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized, only for owners"
        )

    reservations = ReservationManager.get_reservations()
    reservation = next(
        (res for res in reservations if res["reservation_id"] == reservation_id),
        None
    )

    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )

    # 3. Verify ownership of the stadium
    if reservation["stadium_id"] not in user["owned_stadiums"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to manage reservations for this stadium"
        )

    # 4. Check reservation status
    if reservation["status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending reservations can be rejected"
        )

    # 5. Update reservation status
    if ReservationManager.reject_reservation(reservation_id):
        return {"message": "Reservation rejected successfully"}

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to reject reservation"
    )
