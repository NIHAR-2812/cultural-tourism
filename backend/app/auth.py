import os
import jwt
import hashlib
import secrets
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app import database, models

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY", "vanantara_eco_tourism_secret_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt, key_hex = hashed_password.split('$')
        key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return key.hex() == key_hex
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication credentials required")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(
    db: Session = Depends(database.get_db),
    payload: dict = Depends(verify_token)
) -> models.User:
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

optional_security = HTTPBearer(auto_error=False)

def get_optional_current_user(
    db: Session = Depends(database.get_db),
    credentials: HTTPAuthorizationCredentials = Depends(optional_security)
) -> models.User:
    if credentials and credentials.credentials:
        try:
            payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("user_id")
            if user_id:
                u = db.query(models.User).filter(models.User.id == user_id).first()
                if u:
                    return u
        except Exception:
            pass
    
    tourist = db.query(models.User).filter(models.User.role == "tourist").first()
    if not tourist:
        tourist = models.User(
            name="Mindful Tourist",
            email="tourist@vanantara.org",
            role="tourist",
            password_hash=hash_password("password123"),
            approval_status="approved",
            is_verified=True
        )
        db.add(tourist)
        db.commit()
        db.refresh(tourist)
    return tourist

def require_role(allowed_roles: list):
    def role_checker(current_user: models.User = Depends(get_current_user)):
        user_role = current_user.role.lower() if current_user.role else ""
        allowed = [r.lower() for r in allowed_roles]
        if user_role not in allowed:
            raise HTTPException(status_code=403, detail=f"Role '{current_user.role}' is not authorized to access this resource.")
        return current_user
    return role_checker

require_host = require_role(["host"])
require_government = require_role(["government", "admin"])
require_tourist = require_role(["tourist"])