from fastapi import FastAPI
from auth.routes import router as auth_router
from admin.routes import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
from core.storage import JSONStorage

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
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])

# Stadiums endpoint
@app.get("/stadiums", tags=["stadiums"])
async def get_approved_stadiums():
    stadiums = JSONStorage.get_stadiums()
    return [s for s in stadiums if s["status"] == "approved"]

@app.get("/")
def read_root():
    return {"message": "Stadium Booking API"}