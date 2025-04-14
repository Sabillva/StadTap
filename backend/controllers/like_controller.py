from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.models import AppUser
from backend.models.schemas import LikeResponse, LikeStatus
from backend.services.like_service import create_like, delete_like, get_like_count, check_user_like_status

router = APIRouter(prefix="/likes", tags=["Like"])


@router.post("/create/{post_id}", response_model=LikeResponse)
def like_post(
        post_id: int,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    return create_like(db=db, post_id=post_id, current_user=current_user)


@router.delete("/delete/{post_id}", response_model=dict)
def unlike_post(
        post_id: int,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    delete_like(db=db, post_id=post_id, current_user=current_user)
    return {"message": "Like removed successfully"}


@router.get("/count/{post_id}", response_model=int)
def get_post_like_count(
        post_id: int,
        db: Session = Depends(get_db)
):
    return get_like_count(db=db, post_id=post_id)


@router.get("/status/{post_id}", response_model=LikeStatus)
def check_like_status(
        post_id: int,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    return check_user_like_status(db=db, post_id=post_id, current_user=current_user)
