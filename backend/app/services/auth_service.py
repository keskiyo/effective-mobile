from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.services.user_service import get_user_by_email
from fastapi import HTTPException, status
from sqlalchemy.orm import Session


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = get_user_by_email(db, email)
    if (
        user is None
        or not user.is_active
        or not verify_password(password, user.hashed_password)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def create_login_token(user: User) -> str:
    return create_access_token(str(user.id))
