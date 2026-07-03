from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import require_permission
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.schemas.user import AdminUserUpdate, UserRead

router = APIRouter(dependencies=[Depends(require_permission("admin", "manage"))])


@router.get("/users", response_model=list[UserRead])
def list_users(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(User).order_by(User.created_at.desc())).all()


@router.get("/users/{user_id}", response_model=UserRead)
def get_user(user_id: UUID, db: Annotated[Session, Depends(get_db)]):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.patch("/users/{user_id}", response_model=UserRead)
def update_user(
    user_id: UUID, payload: AdminUserUpdate, db: Annotated[Session, Depends(get_db)]
):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    update_data = payload.model_dump(exclude_unset=True)
    if "role" in update_data and update_data["role"]:
        update_data["role"] = update_data["role"].lower()
    for key, value in update_data.items():
        setattr(user, key, value)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", response_model=MessageResponse)
def delete_user(user_id: UUID, db: Annotated[Session, Depends(get_db)]):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    user.is_active = False
    db.add(user)
    db.commit()
    return MessageResponse(message="User deactivated")
