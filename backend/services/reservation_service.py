from datetime import datetime, timedelta
from typing import List, Optional

from sqlalchemy.orm import Session

from backend.models.models import Reservation, Stadium, AppUser


class ReservationService:
    @staticmethod
    def get_available_time_slots(city: str, stadium_id: Optional[int] = None, date_option: str = "today",
                                 time_slots: Optional[List[str]] = None, db: Session = None):
        if db is None:
            raise ValueError("Database session is required")

        query = db.query(Stadium).filter(Stadium.location == city)

        if stadium_id:
            query = query.filter(Stadium.id == stadium_id)

        stadiums = query.all()
        if not stadiums:
            return {"message": "No stadiums found in this city."}, 404

        today = datetime.now().date()
        if date_option == "today":
            selected_date = today
        elif date_option == "tomorrow":
            selected_date = today + timedelta(days=1)
        else:
            selected_date = datetime.strptime(date_option, "%Y-%m-%d").date()

        # Fetch existing reservations for selected stadiums and date
        reservations = db.query(Reservation).filter(
            Reservation.stadium_id.in_([s.id for s in stadiums]),
            Reservation.date == selected_date
        ).all()

        # Define all possible time slots
        all_time_slots = [f"{hour}:00-{hour + 1}:00" for hour in range(7, 24)] + ["00:00-01:00"]

        # If user provided time slots, filter only those
        if time_slots:
            all_time_slots = [slot for slot in time_slots if slot in all_time_slots]

        # Exclude already reserved slots
        booked_slots = {r.time_slot for r in reservations}
        available_slots = [slot for slot in all_time_slots if slot not in booked_slots]

        # Find unavailable slots from the user’s selection
        unavailable_slots = list(set(time_slots) - set(available_slots)) if time_slots else []

        return {
            "available_time_slots": available_slots,
            "unavailable_time_slots": unavailable_slots
        }

    @staticmethod
    def create_reservation(user_id: int, stadium_id: int, time_slot: str, date: str, payment_intent_id: str,
                           db: Session = None):
        if db is None:
            raise ValueError("Database session is required")

        # Check if the stadium exists
        stadium = db.query(Stadium).filter(Stadium.id == stadium_id).first()
        if not stadium:
            return {"message": "Stadium not found."}, 404

        # Check if the user exists
        user = db.query(AppUser).filter(AppUser.id == user_id).first()
        if not user:
            return {"message": "User not found."}, 404

        # Check if the reservation time slot is available
        existing_reservation = db.query(Reservation).filter(
            Reservation.stadium_id == stadium_id,
            Reservation.date == date,
            Reservation.time_slot == time_slot
        ).first()

        if existing_reservation:
            return {"message": "Time slot is already reserved."}, 400

        # Create the new reservation
        new_reservation = Reservation(
            user_id=user_id,
            stadium_id=stadium_id,
            time_slot=time_slot,
            date=datetime.strptime(date, "%Y-%m-%d").date(),
            payment_intent_id=payment_intent_id,
            payment_status="pending"  # Payment status is also pending
        )

        # Add reservation to the database
        db.add(new_reservation)
        db.commit()
        db.refresh(new_reservation)

        return {"message": "Reservation created successfully.", "reservation": new_reservation}, 201
