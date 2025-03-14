import os

import stripe
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends
from fastapi import Request, Header
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.models import Reservation
from backend.services.email_service import send_email
from backend.services.reservation_code_service import create_reservation_code

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
        reservation = db.query(Reservation).filter(Reservation.payment_intent_id == payment_intent.id).first()
        if reservation:
            reservation.payment_status = "successful"
            db.commit()

        # Create a reservation code
        reservation_code = create_reservation_code(db, reservation.id)

        # Send the code to the user's email
        send_email(reservation.user.email, reservation_code.code)


    elif event.type == "payment_intent.payment_failed":
        payment_intent = event.data.object
        # Update reservation status in the database
        db.query(Reservation).filter(Reservation.payment_intent_id == payment_intent.id).update(
            {"payment_status": "rejected"}
        )
        db.commit()

    return {"status": "success"}
