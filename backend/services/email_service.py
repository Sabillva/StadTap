import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv

load_dotenv()


def send_email(to_email: str, code: str):
    # Email content
    subject = "Your Reservation Code"
    body = f"Your reservation code is: {code}. This code will expire in 3 days."

    # Create the email
    msg = MIMEMultipart()
    msg['From'] = os.getenv("sendgrid.sender_email")
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach the body to the email
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to SendGrid's SMTP server
        with smtplib.SMTP('smtp.sendgrid.net', 587) as server:
            server.starttls()  # Secure the connection
            server.login('apikey', os.getenv("sendgrid.api_key"))
            server.sendmail(os.getenv("sendgrid.sender_email"), [to_email], msg.as_string())
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
