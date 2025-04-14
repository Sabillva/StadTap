import imghdr
from io import BytesIO

from PIL import Image
from fastapi import HTTPException
from fastapi import status
from sqlalchemy.orm import Session, joinedload

from backend.models import schemas
from backend.models.models import *
from backend.models.models import Post


def get_all_posts(db: Session):
    try:
        return db.query(Post).options(
            joinedload(Post.stadium),
            joinedload(Post.user)
        ).all()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving posts: {str(e)}"
        )


def get_post_by_id(db: Session, post_id: int):
    try:
        return db.query(Post).options(
            joinedload(Post.stadium),
            joinedload(Post.user)
        ).filter(Post.id == post_id).first()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving post: {str(e)}"
        )


async def create_post(
        db: Session,
        post: schemas.PostCreate,
        image_data: bytes,
        current_user: AppUser
):
    try:
        # Validate image using helper function
        try:
            image_meta = validate_image_bytes(image_data)
        except ImageValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )

        db_post = Post(
            caption=post.caption,
            description=post.description,
            image_data=image_data,
            image_format=image_meta['format'],
            stadium_id=post.stadium_id,
            user_id=current_user.id,
        )

        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating post: {str(e)}",
        )


async def update_post(
        db: Session,
        post_id: int,
        post: schemas.PostUpdate,
        image_data: bytes = None,  # Changed to bytes
):
    try:
        # Fetch the post from the database
        db_post = db.query(Post).filter(Post.id == post_id).first()
        if not db_post:
            return None

        # Update the post fields if provided
        if post.caption is not None:
            db_post.caption = post.caption
        if post.description is not None:
            db_post.description = post.description
        if post.stadium_id is not None:
            db_post.stadium_id = post.stadium_id

        # Handle image update if provided
        if image_data is not None:
            try:
                # Use our helper function for validation
                image_meta = validate_image_bytes(image_data)

                # Update the image data and metadata
                db_post.image_data = image_data
                db_post.image_format = image_meta['format']

                # Optional: Update dimensions if you're storing them
                if hasattr(db_post, 'image_width'):
                    db_post.image_width = image_meta['dimensions'][0]
                if hasattr(db_post, 'image_height'):
                    db_post.image_height = image_meta['dimensions'][1]

            except ImageValidationError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(e),
                )

        # Commit changes to the database
        db.commit()
        db.refresh(db_post)

        return db_post

    except HTTPException:
        raise  # Re-raise HTTPException
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating post: {str(e)}",
        )


def delete_post(
        db: Session,
        post_id: int,
):
    try:
        # Fetch the post from the database
        db_post = db.query(Post).filter(Post.id == post_id).first()
        if not db_post:
            return None

        # Delete the post from the database
        db.delete(db_post)
        db.commit()

        # No need to delete from Supabase Storage since we're storing in DB
        return True

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting post: {str(e)}",
        )


# Validation Part
class ImageValidationError(Exception):
    pass


def validate_image_bytes(image_data: bytes, max_size_mb: int = 5) -> dict:
    """
    Validate image bytes and return metadata
    Returns: {
        "format": str,
        "size_valid": bool,
        "dimensions": (width, height),  # Optional
        "size_bytes": int
    }
    """
    max_size = max_size_mb * 1024 * 1024

    if len(image_data) > max_size:
        raise ImageValidationError(f"Image too large. Maximum size is {max_size_mb}MB.")

    # Check if the image is valid and get its format
    image_format = imghdr.what(None, h=image_data)
    if not image_format:
        raise ImageValidationError("Invalid image file or unsupported format.")

    # Optional: Add PIL validation for more thorough checking
    try:
        with Image.open(BytesIO(image_data)) as img:
            img.verify()  # Verify that it's a valid image
            img_format = img.format.lower() if img.format else image_format
            return {
                "format": img_format,
                "size_valid": True,
                "dimensions": img.size,  # (width, height)
                "size_bytes": len(image_data)
            }
    except Exception as e:
        raise ImageValidationError(f"Invalid image: {str(e)}")
