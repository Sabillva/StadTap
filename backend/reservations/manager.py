import json
from typing import Dict, List, Any
from pathlib import Path
from backend.database import JSONStorage, RESERVATIONS_FILE, DATE_FILE


class ReservationManager:
    @staticmethod
    def get_reservations() -> List[Dict[str, Any]]:
        return JSONStorage._read_data(RESERVATIONS_FILE).get("reservations", [])

    @staticmethod
    def save_reservation(reservation: Dict[str, Any]):
        data = JSONStorage._read_data(RESERVATIONS_FILE)
        if "reservations" not in data:
            data["reservations"] = []
        data["reservations"].append(reservation)
        JSONStorage._write_data(RESERVATIONS_FILE, data)

    @staticmethod
    def update_reservation(reservation_id: str, updates: Dict[str, Any]):
        data = JSONStorage._read_data(RESERVATIONS_FILE)
        for res in data.get("reservations", []):
            if res["reservation_id"] == reservation_id:
                res.update(updates)
                break
        JSONStorage._write_data(RESERVATIONS_FILE, data)

    @staticmethod
    def get_reservations_by_stadium_and_date(stadium_id: str, date: str) -> List[Dict[str, Any]]:
        reservations = JSONStorage._read_data(RESERVATIONS_FILE).get("reservations", [])
        return [res for res in reservations if res["stadium_id"] == stadium_id and res["date"] == date]

    @staticmethod
    def check_availability(stadium_id: str, date: str, hour: str) -> bool:
        reservations = ReservationManager.get_reservations_by_stadium_and_date(stadium_id, date)
        stadiums = JSONStorage.get_stadiums()
        stadium = next((s for s in stadiums if s["id"] == stadium_id), None)

        if not stadium:
            return False  # Stadium not found

        max_slots = stadium["number_of_fields"]
        booked_slots = sum(1 for res in reservations if res["hour"] == hour and res["status"] == "successful")

        return booked_slots < max_slots

    @staticmethod
    def make_reservation(user_id: str, stadium_id: str, date: str, hour: str) -> Dict[str, Any]:
        if not ReservationManager.check_availability(stadium_id, date, hour):
            return {"error": "Time slot not available."}

        reservation = {
            "reservation_id": str(hash(f"{user_id}-{stadium_id}-{date}-{hour}")),
            "user_id": user_id,
            "stadium_id": stadium_id,
            "date": date,
            "hour": hour,
            "status": "pending"
        }
        ReservationManager.save_reservation(reservation)
        return reservation

    @staticmethod
    def approve_reservation(reservation_id: str) -> bool:
        """Approve a pending reservation and update availability"""
        # 1. Get the reservation
        reservations = JSONStorage.get_reservations()
        reservation = next(
            (res for res in reservations if res["reservation_id"] == reservation_id),
            None
        )

        # 3. Update status to approved
        JSONStorage.update_reservation_status(reservation_id, "successful")

        # 4. Update date.json availability
        ReservationManager.update_date_json(
            reservation["stadium_id"],
            reservation["date"]
        )

        return True

    @staticmethod
    def update_date_json(stadium_id: str, date: str):
        """Update date.json with field-based availability"""
        # 1. Read existing data
        data = JSONStorage._read_data(DATE_FILE)

        # 2. Get stadium info
        stadium = next((s for s in JSONStorage.get_stadiums() if s["id"] == stadium_id), None)
        if not stadium:
            return

        num_fields = stadium.get("number_of_fields", 1)

        # 3. Get all successful reservations for this stadium+date
        reservations = ReservationManager.get_reservations_by_stadium_and_date(stadium_id, date)

        # 4. Count bookings per hour
        hour_bookings = {}
        for res in reservations:
            if res["status"] == "successful":
                hour = res["hour"]
                hour_bookings[hour] = hour_bookings.get(hour, 0) + 1

        # 5. Initialize or get existing availability
        if date not in data:
            data[date] = []

        stadium_entry = next(
            (entry for entry in data[date] if entry["stadium_id"] == stadium_id),
            None
        )

        if not stadium_entry:
            # New entry starts with all hours duplicated by num_fields
            stadium_entry = {
                "stadium_id": stadium_id,
                "available_hours": stadium["available_hours"] * num_fields,
                "unavailable_hours": []
            }
            data[date].append(stadium_entry)

        # 6. Update availability
        new_available = []
        new_unavailable = stadium_entry["unavailable_hours"].copy()

        for hour in stadium["available_hours"]:
            booked_count = hour_bookings.get(hour, 0)
            available_count = stadium_entry["available_hours"].count(hour)

            # Calculate how many instances should remain available
            remaining_available = max(0, (num_fields - booked_count))

            # Add to appropriate lists
            if remaining_available > 0:
                new_available.extend([hour] * remaining_available)
            else:
                if hour not in new_unavailable:
                    new_unavailable.append(hour)

        # 7. Update and save
        stadium_entry["available_hours"] = new_available
        stadium_entry["unavailable_hours"] = new_unavailable
        JSONStorage._write_data(DATE_FILE, data)

@staticmethod
def delete_reservation(reservation_id: str) -> bool:
    """Delete a reservation and update availability if it was approved."""
    # Get all reservations
    data = JSONStorage._read_data(RESERVATIONS_FILE)
    reservations = data.get("reservations", [])

    # Find the reservation
    reservation = next(
        (res for res in reservations if res["reservation_id"] == reservation_id),
        None
    )

    if not reservation:
        return False  # Reservation not found

    # Remove from reservations.json
    updated_reservations = [
        res for res in reservations if res["reservation_id"] != reservation_id
    ]
    data["reservations"] = updated_reservations
    JSONStorage._write_data(RESERVATIONS_FILE, data)

    # If reservation was approved, free up the time slot
    if reservation["status"] == "successful":
        ReservationManager._free_time_slot(
            reservation["stadium_id"],
            reservation["date"],
            reservation["hour"]
        )

    return True


@staticmethod
def _free_time_slot(stadium_id: str, date: str, hour: str):
    """Mark a time slot as available in date.json"""
    date_data = JSONStorage._read_data(DATE_FILE)

    if date not in date_data:
        return  # No entry for this date

    # Find the stadium entry for this date
    stadium_entry = next(
        (entry for entry in date_data[date] if entry["stadium_id"] == stadium_id),
        None
    )

    if stadium_entry and hour in stadium_entry["unavailable_hours"]:
        # Move hour from unavailable to available
        stadium_entry["unavailable_hours"].remove(hour)
        stadium_entry["available_hours"].append(hour)

        # Save changes
        JSONStorage._write_data(DATE_FILE, date_data)