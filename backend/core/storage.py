import json
import os
from typing import Dict, List, Any
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
USERS_FILE = DATA_DIR / "users.json"
STADIUMS_FILE = DATA_DIR / "stadiums.json"

# Initialize data files if they don't exist
os.makedirs(DATA_DIR, exist_ok=True)
if not USERS_FILE.exists():
    USERS_FILE.write_text('{"users": []}')
if not STADIUMS_FILE.exists():
    STADIUMS_FILE.write_text('{"stadiums": []}')

class JSONStorage:
    @staticmethod
    def _read_data(file_path: Path) -> Dict[str, List[Dict[str, Any]]]:
        return json.loads(file_path.read_text())

    @staticmethod
    def _write_data(file_path: Path, data: Dict[str, List[Dict[str, Any]]]):
        file_path.write_text(json.dumps(data, indent=2))

    @classmethod
    def get_users(cls) -> List[Dict[str, Any]]:
        return cls._read_data(USERS_FILE)["users"]

    @classmethod
    def save_user(cls, user: Dict[str, Any]):
        data = cls._read_data(USERS_FILE)
        data["users"].append(user)
        cls._write_data(USERS_FILE, data)

    @classmethod
    def update_user(cls, email: str, updates: Dict[str, Any]):
        data = cls._read_data(USERS_FILE)
        for user in data["users"]:
            if user["email"] == email:
                user.update(updates)
                break
        cls._write_data(USERS_FILE, data)

    @classmethod
    def get_stadiums(cls) -> List[Dict[str, Any]]:
        return cls._read_data(STADIUMS_FILE)["stadiums"]

    @classmethod
    def save_stadium(cls, stadium: Dict[str, Any]):
        data = cls._read_data(STADIUMS_FILE)
        data["stadiums"].append(stadium)
        cls._write_data(STADIUMS_FILE, data)

    @classmethod
    def delete_stadium(cls, stadium_id: str):
        data = cls._read_data(STADIUMS_FILE)
        data["stadiums"] = [s for s in data["stadiums"] if s["id"] != stadium_id]
        cls._write_data(STADIUMS_FILE, data)

    @classmethod
    def update_stadium(cls, stadium_id: str, updates: Dict[str, Any]):
        data = cls._read_data(STADIUMS_FILE)
        for stadium in data["stadiums"]:
            if stadium["id"] == stadium_id:
                stadium.update(updates)
                break
        cls._write_data(STADIUMS_FILE, data)