from uuid import UUID

from app.core.security import hash_password
from app.models.user import User
from sqlalchemy import select
from sqlalchemy.orm import Session

USER_PERMISSIONS = {"projects": ["read"]}
ADMIN_PERMISSIONS = {
    "projects": ["read", "write", "delete"],
    "users": ["read", "update"],
    "admin": ["manage"],
}


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email.lower()))


def get_user_by_id(db: Session, user_id: UUID) -> User | None:
    return db.get(User, user_id)


def create_user(db: Session, name: str, email: str, password: str) -> User:
    user = User(
        name=name,
        email=email.lower(),
        hashed_password=hash_password(password),
        role="user",
        permissions=USER_PERMISSIONS,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
