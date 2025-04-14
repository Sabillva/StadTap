from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.models.models import Post, Like, AppUser


def create_like(db: Session, post_id: int, current_user: AppUser):
    try:
        # Check if post exists
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Check if like already exists
        existing_like = db.query(Like).filter(
            Like.post_id == post_id,
            Like.user_id == current_user.id
        ).first()

        if existing_like:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Post already liked by user"
            )

        # Create new like
        new_like = Like(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        db.commit()
        db.refresh(new_like)
        return new_like
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating like: {str(e)}"
        )


def delete_like(db: Session, post_id: int, current_user: AppUser):
    try:
        like = db.query(Like).filter(
            Like.post_id == post_id,
            Like.user_id == current_user.id
        ).first()

        if not like:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Like not found"
            )

        db.delete(like)
        db.commit()
        return True
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting like: {str(e)}"
        )


def get_like_count(db: Session, post_id: int):
    try:
        return db.query(Like).filter(Like.post_id == post_id).count()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting like count: {str(e)}"
        )


def check_user_like_status(db: Session, post_id: int, current_user: AppUser):
    try:
        like = db.query(Like).filter(
            Like.post_id == post_id,
            Like.user_id == current_user.id
        ).first()
        return {"liked": like is not None}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking like status: {str(e)}"
        )
