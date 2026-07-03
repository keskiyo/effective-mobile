from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.user import User
from app.services.user_service import ADMIN_PERMISSIONS, USER_PERMISSIONS
from sqlalchemy import select

SEED_USERS = [
    {
        "email": "admin@example.com",
        "password": "Admin123!",
        "name": "Admin User",
        "role": "admin",
        "permissions": ADMIN_PERMISSIONS,
    },
    {
        "email": "user@example.com",
        "password": "User123!",
        "name": "Regular User",
        "role": "user",
        "permissions": USER_PERMISSIONS,
    },
]


def seed() -> None:
    db = SessionLocal()
    try:
        for item in SEED_USERS:
            user = db.scalar(select(User).where(User.email == item["email"]))
            if user:
                user.name = item["name"]
                user.role = item["role"]
                user.permissions = item["permissions"]
                db.add(user)
                continue
            db.add(
                User(
                    email=item["email"],
                    name=item["name"],
                    role=item["role"],
                    permissions=item["permissions"],
                    hashed_password=hash_password(item["password"]),
                )
            )
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
