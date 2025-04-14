from fastapi import APIRouter, File, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.models import AppUser
from backend.models.schemas import PostCreate, PostResponse, PostUpdate
from backend.services import post_service

router = APIRouter(prefix="/posts", tags=["Post"])


@router.get("/get", dependencies=[Depends(get_current_user)])
def get_all_posts(
        db: Session = Depends(get_db),
):
    return post_service.get_all_posts(db=db)


@router.get("/get/{post_id}", response_model=PostResponse)
def get_post(
        post_id: int,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    post = post_service.get_post_by_id(db=db, post_id=post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post


@router.post("/create", response_model=PostResponse)
def create_post(
        post: PostCreate,
        image: bytes = File(...),  # Accept bytes directly
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    return post_service.create_post(db=db, post=post, image_data=image, current_user=current_user)


@router.put("/update/{post_id}", response_model=PostResponse)
async def update_post(
        post_id: int,
        post: PostUpdate,
        image: bytes = File(None),  # Optional byte array instead of UploadFile
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    # Check if the post exists
    db_post = post_service.get_post_by_id(db=db, post_id=post_id)
    if not db_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Ensure the current user is the owner of the post
    if db_post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this post"
        )

    # Update the post
    updated_post = post_service.update_post(
        db=db,
        post_id=post_id,
        post=post,
        image_data=image,  # Pass byte array instead of UploadFile
    )
    return updated_post


@router.delete("/delete/{post_id}", response_model=dict)
def delete_post(
        post_id: int,
        db: Session = Depends(get_db),
        current_user: AppUser = Depends(get_current_user)
):
    # Check if the post exists
    db_post = post_service.get_post_by_id(db=db, post_id=post_id)
    if not db_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Ensure the current user is the owner of the post
    if db_post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this post"
        )

    # Delete the post
    post_service.delete_post(db=db, post_id=post_id)
    return {"message": "Post deleted successfully"}
