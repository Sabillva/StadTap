import os

import stripe
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends
from fastapi import Request, Header
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.models import Reservation

load_dotenv()


router = APIRouter(prefix="/stripe", tags=["Stripe"])

@router.post("/stripe-webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None), db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = stripe_signature

    try:
        # Verify the webhook signature
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("stripe.webhook_key")
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event.type == "payment_intent.succeeded":
        payment_intent = event.data.object
        # Update reservation status in the database
        db.query(Reservation).filter(Reservation.payment_intent_id == payment_intent.id).update(
            {"payment_status": "successful"}
        )
        db.commit()
    elif event.type == "payment_intent.payment_failed":
        payment_intent = event.data.object
        # Update reservation status in the database
        db.query(Reservation).filter(Reservation.payment_intent_id == payment_intent.id).update(
            {"payment_status": "rejected"}
        )
        db.commit()

    return {"status": "success"}
