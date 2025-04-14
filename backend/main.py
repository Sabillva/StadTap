import os

import stripe
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from flask.cli import load_dotenv

from backend.auth.dependencies import get_current_user
from backend.models.models import AppUser
from controllers.auth_controller import router as auth_router
from controllers.reservation_controller import router as reservation_router
from controllers.payment_controller import router as payment_router
from controllers.like_controller import router as like_router
from controllers.post_controller import router as post_router
from controllers.comment_controller import router as comment_router
from backend.database import Base_Model, engine

Base_Model.metadata.create_all(bind=engine)

load_dotenv()

stripe.api_key = os.getenv("stripe.api_key")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(reservation_router)
app.include_router(payment_router)
app.include_router(post_router)
app.include_router(comment_router)
app.include_router(like_router)


@app.get("/")
async def root(current_user: AppUser = Depends(get_current_user)):
    return {"message": "Hello, world!"}


uvicorn.run(app)
