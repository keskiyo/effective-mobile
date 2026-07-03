from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.security import hash_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.schemas.user import UserRead, UserUpdateMe

router = APIRouter()


@router.get("/me", response_model=UserRead)
def read_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@router.put("/me", response_model=UserRead)
def update_me(
    payload: UserUpdateMe,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    email = payload.email.lower()
    existing_user = db.scalar(
        select(User).where(User.email == email, User.id != current_user.id)
    )
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists"
        )

    current_user.name = payload.name
    current_user.email = email
    if payload.new_password:
        current_user.hashed_password = hash_password(payload.new_password)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", response_model=MessageResponse)
def delete_me(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    current_user.is_active = False
    db.add(current_user)
    db.commit()
    return MessageResponse(message="Account deactivated")
