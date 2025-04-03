from fastapi import APIRouter, Depends, HTTPException
from backend.database import JSONStorage
from auth.routes import get_current_user
from typing import List
import uuid

router = APIRouter()


@router.get("/pending-requests", response_model=List[dict])
async def get_pending_requests(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access this endpoint")

    stadiums = JSONStorage.get_stadiums()
    return [s for s in stadiums if s["status"] == "pending"]


@router.post("/approve-or-reject-request/{stadium_id}")
async def approve_or_reject_request(
        stadium_id: str,
        action: dict,
        current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access this endpoint")

    stadiums = JSONStorage.get_stadiums()
    stadium = next((s for s in stadiums if s["id"] == stadium_id), None)

    if not stadium:
        raise HTTPException(status_code=404, detail="Stadium not found")

    if action["action"] == "approve":
        updates = {
            "status": "approved",  # Only place where status can be changed to "approved"
            # Include other updates if provided
            **(action.get("updates", {}) or {})
        }

        current_user["owned_stadiums"].append(stadium_id)
        JSONStorage.update_stadium(stadium_id, updates)
        JSONStorage.update_user(stadium["owner_id"], {"owned_stadiums": current_user["owned_stadiums"]})
        # Update user role to owner
        JSONStorage.update_user(stadium["owner_id"], {"role": "owner"})


        return {"message": "Stadium approved successfully"}
    elif action["action"] == "reject":
        JSONStorage.delete_stadium(stadium_id)
        return {"message": "Stadium request rejected and deleted"}
    else:
        raise HTTPException(status_code=400, detail="Invalid action")