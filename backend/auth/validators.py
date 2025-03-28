from core.storage import JSONStorage

def validate_unique_username(username: str):
    users = JSONStorage.get_users()
    if any(user["username"] == username for user in users):
        raise ValueError("Username already exists")
    return username

def validate_unique_email(email: str):
    users = JSONStorage.get_users()
    if any(user["email"] == email for user in users):
        raise ValueError("Email already exists")
    return email

def validate_phone_number(phone: str):
    if not phone.startswith("+994"):
        raise ValueError("Phone must start with +994")
    if len(phone[4:]) != 9:
        raise ValueError("Phone must be 9 digits after +994")
    if not phone[4:].isdigit():
        raise ValueError("Phone must contain only digits after +994")
    return phone