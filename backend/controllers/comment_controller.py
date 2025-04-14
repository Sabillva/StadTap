from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.models import AppUser
from backend.models.schemas import CommentResponse, CommentUpdate, CommentCreate
from backend.services.comment_service import create_comment, get_comment_by_id, get_comments_by_post_id, update_comment, \
    delete_comment

router = APIRouter(prefix="/comments", tags=["Comment"])


@router.post("/create", response_model=CommentResponse)
def create_new_comment(
        comment: CommentCreate,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    return create_comment(db=db, comment=comment, current_user=current_user)


@router.get("/get/{comment_id}", response_model=CommentResponse)
def get_single_comment(
        comment_id: int,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    db_comment = get_comment_by_id(db=db, comment_id=comment_id)
    if not db_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    return db_comment


@router.get("/post/{post_id}", response_model=List[CommentResponse])
def get_post_comments(
        post_id: int,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    return get_comments_by_post_id(db=db, post_id=post_id)


@router.put("/update/{comment_id}", response_model=CommentResponse)
def update_existing_comment(
        comment_id: int,
        comment: CommentUpdate,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    db_comment = get_comment_by_id(db=db, comment_id=comment_id)
    if not db_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    if db_comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this comment"
        )
    return update_comment(db=db, comment_id=comment_id, comment=comment)


@router.delete("/delete/{comment_id}", response_model=dict)
def delete_existing_comment(
        comment_id: int,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    db_comment = get_comment_by_id(db=db, comment_id=comment_id)
    if not db_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    if db_comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this comment"
        )
    delete_comment(db=db, comment_id=comment_id)
    return {"message": "Comment deleted successfully"}
