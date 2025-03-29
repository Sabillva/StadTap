# core/stadium.py
from core.storage import JSONStorage


class StadiumManager:
    @staticmethod
    def get_all_stadiums():
        return JSONStorage.get_stadiums()

    @staticmethod
    def get_stadium_by_id(stadium_id: str):
        stadiums = JSONStorage.get_stadiums()
        return next((s for s in stadiums if s["id"] == stadium_id), None)

    @staticmethod
    def get_available_hours(stadium_id: str, date: str):
        stadium = StadiumManager.get_stadium_by_id(stadium_id)
        if not stadium:
            return None

        reservations = JSONStorage.get_reservations()
        booked_hours = [r["hour"] for r in reservations if
                        r["stadium_id"] == stadium_id and r["date"] == date and r["status"] == "successful"]

        available_hours = stadium["available_hours"]
        unavailable_hours = []
        for hour in booked_hours:
            available_hours.remove(hour)
            if available_hours.count(hour) == 0:
                unavailable_hours.append(hour)

        return {"stadium_id": stadium_id, "available_hours": available_hours, "unavailable_hours": unavailable_hours}
