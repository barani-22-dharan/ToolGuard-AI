from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String
from pwdlib import PasswordHash

from app.database.database import Base, get_db


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# =========================================================
# Password Hashing
# =========================================================

password_hash = PasswordHash.recommended()


# =========================================================
# User Database Model
# =========================================================

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )


# =========================================================
# Signup Request
# =========================================================

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


# =========================================================
# Login Request
# =========================================================

class LoginRequest(BaseModel):
    username: str
    password: str


# =========================================================
# Forgot Password Request
# =========================================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# =========================================================
# Reset Password Request
# =========================================================

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str


# =========================================================
# Signup API
# =========================================================

@router.post("/signup")
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):

    existing_username = db.query(User).filter(
        User.username == data.username
    ).first()

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    existing_email = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = password_hash.hash(
        data.password
    )

    new_user = User(
        username=data.username,
        email=data.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Account created successfully",
        "username": new_user.username,
        "email": new_user.email
    }


# =========================================================
# Login API
# =========================================================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not password_hash.verify(
        data.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    return {
        "message": "Login successful",
        "username": user.username,
        "email": user.email
    }


# =========================================================
# Forgot Password API
# =========================================================

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    return {
        "message": "Email verified. You can reset your password.",
        "email": user.email
    }


# =========================================================
# Reset Password API
# =========================================================

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters"
        )

    # Hash the new password
    user.password = password_hash.hash(
        data.new_password
    )

    db.commit()

    return {
        "message": "Password reset successfully",
        "email": user.email
    }