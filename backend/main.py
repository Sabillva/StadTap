from sys import prefix

from fastapi import FastAPI
from auth.routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with your requested endpoints

@app.on_event("startup")
async def startup():
    init_db()


app.include_router(auth_router, tags=["auth"])


@app.get("/")
def read_root():
    return {"message": "Stadium Booking API"}