from collections.abc import Callable
from typing import Annotated
from uuid import UUID

import jwt
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.services.permission_service import has_permission
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise auth_error
    try:
        payload = decode_access_token(credentials.credentials)
        if payload.get("type") != "access" or not payload.get("sub"):
            raise auth_error
        user_id = UUID(str(payload["sub"]))
    except (ValueError, jwt.PyJWTError):
        raise auth_error from None

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise auth_error
    return user


def require_permission(resource_name: str, action: str) -> Callable:
    def dependency(current_user: Annotated[User, Depends(get_current_user)]) -> User:
        if not has_permission(current_user, resource_name, action):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
        return current_user

    return dependency
