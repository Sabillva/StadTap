from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.models.models import AppUser, Post, Comment
from backend.models.schemas import CommentCreate, CommentUpdate


def create_comment(db: Session, comment: CommentCreate, current_user: AppUser):
    try:
        # Check if post exists
        db_post = db.query(Post).filter(Post.id == comment.post_id).first()
        if not db_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

        new_comment = Comment(
            message=comment.message,
            user_id=current_user.id,
            post_id=comment.post_id
        )
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return new_comment
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating comment: {str(e)}"
        )


def get_comment_by_id(db: Session, comment_id: int):
    try:
        return db.query(Comment).filter(Comment.id == comment_id).first()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving comment: {str(e)}"
        )


def get_comments_by_post_id(db: Session, post_id: int):
    try:
        return db.query(Comment).filter(Comment.post_id == post_id).all()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving comments: {str(e)}"
        )


def update_comment(db: Session, comment_id: int, comment: CommentUpdate):
    try:
        db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not db_comment:
            return None

        db_comment.message = comment.message
        db.commit()
        db.refresh(db_comment)
        return db_comment
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating comment: {str(e)}"
        )


def delete_comment(db: Session, comment_id: int):
    try:
        db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not db_comment:
            return None

        db.delete(db_comment)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting comment: {str(e)}"
        )
