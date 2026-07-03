from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    TokenResponse,
)
from app.schemas.user import UserRead
from app.services.auth_service import authenticate_user, create_login_token
from app.services.user_service import create_user, get_user_by_email

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Annotated[Session, Depends(get_db)]):
    if get_user_by_email(db, payload.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists"
        )
    return create_user(db, payload.name, payload.email, payload.password)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Annotated[Session, Depends(get_db)]):
    user = authenticate_user(db, payload.email, payload.password)
    return TokenResponse(access_token=create_login_token(user))


@router.post("/logout", response_model=MessageResponse)
def logout():
    return MessageResponse(message="Logged out")
