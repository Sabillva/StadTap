import json
import os
from typing import Dict, List, Any
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
USERS_FILE = DATA_DIR / "users.json"
STADIUMS_FILE = DATA_DIR / "stadiums.json"
RESERVATIONS_FILE = DATA_DIR / "reservations.json"
DATE_FILE = DATA_DIR / "date.json"

# Initialize data files if they don't exist
os.makedirs(DATA_DIR, exist_ok=True)
for file in [USERS_FILE, STADIUMS_FILE, RESERVATIONS_FILE, DATE_FILE]:
    if not file.exists():
        file.write_text(json.dumps({"users": [], "stadiums": [], "reservations": [], "dates": {}}, indent=2))


class JSONStorage:
    @staticmethod
    def _read_data(file_path: Path) -> Dict[str, Any]:
        """Read JSON data safely."""
        try:
            return json.loads(file_path.read_text())
        except (json.JSONDecodeError, FileNotFoundError):
            return {"reservations": []} if file_path == RESERVATIONS_FILE else {}

    @staticmethod
    def _write_data(file_path: Path, data: Dict[str, Any]):
        file_path.write_text(json.dumps(data, indent=2))

    @classmethod
    def get_users(cls) -> List[Dict[str, Any]]:
        return cls._read_data(USERS_FILE).get("users", [])

    @classmethod
    def save_user(cls, user: Dict[str, Any]):
        data = cls._read_data(USERS_FILE)
        data.setdefault("users", []).append(user)
        cls._write_data(USERS_FILE, data)

    @classmethod
    def update_user(cls, user_id: str, updates: Dict[str, Any]):
        data = cls._read_data(USERS_FILE)
        for user in data.get("users", []):
            if user["id"] == user_id:
                user.update(updates)
                break
        cls._write_data(USERS_FILE, data)

    @classmethod
    def get_stadiums(cls) -> List[Dict[str, Any]]:
        return cls._read_data(STADIUMS_FILE).get("stadiums", [])

    @classmethod
    def save_stadium(cls, stadium: Dict[str, Any]):
        data = cls._read_data(STADIUMS_FILE)
        data.setdefault("stadiums", []).append(stadium)
        cls._write_data(STADIUMS_FILE, data)

    @classmethod
    def delete_stadium(cls, stadium_id: str):
        data = cls._read_data(STADIUMS_FILE)
        data["stadiums"] = [s for s in data.get("stadiums", []) if s["id"] != stadium_id]
        cls._write_data(STADIUMS_FILE, data)

    @classmethod
    def update_stadium(cls, stadium_id: str, updates: Dict[str, Any]):
        data = cls._read_data(STADIUMS_FILE)
        for stadium in data.get("stadiums", []):
            if stadium["id"] == stadium_id:
                stadium.update(updates)
                break
        cls._write_data(STADIUMS_FILE, data)

    @classmethod
    def get_reservations(cls) -> List[Dict[str, Any]]:
        return cls._read_data(RESERVATIONS_FILE).get("reservations", [])

    @classmethod
    def save_reservation(cls, reservation: Dict[str, Any]):
        data = cls._read_data(RESERVATIONS_FILE)
        data.setdefault("reservations", []).append(reservation)
        cls._write_data(RESERVATIONS_FILE, data)

    @classmethod
    def update_reservation_status(cls, reservation_id: str, status: str):
        data = cls._read_data(RESERVATIONS_FILE)
        for reservation in data.get("reservations", []):
            if reservation["reservation_id"] == reservation_id:
                reservation["status"] = status
                break
        cls._write_data(RESERVATIONS_FILE, data)

    @classmethod
    def get_dates(cls) -> Dict[str, Any]:
        return cls._read_data(DATE_FILE).get("dates", {})

    @classmethod
    def update_date_availability(cls, date: str, stadium_id: str, available_hours: List[str], unavailable_hours: List[str]):
        data = cls._read_data(DATE_FILE)
        if "dates" not in data:
            data["dates"] = {}
        data["dates"].setdefault(date, []).append({
            "stadium_id": stadium_id,
            "available_hours": available_hours,
            "unavailable_hours": unavailable_hours
        })
        cls._write_data(DATE_FILE, data)
