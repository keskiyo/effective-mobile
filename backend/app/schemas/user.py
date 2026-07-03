from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    name: str
    role: str
    permissions: dict[str, list[str]]
    is_active: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None


class UserUpdateMe(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    new_password: str | None = Field(default=None, min_length=8)
    confirm_password: str | None = Field(default=None, min_length=8)

    @model_validator(mode="after")
    def validate_password_change(self) -> "UserUpdateMe":
        if not self.new_password and not self.confirm_password:
            return self
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        if self.new_password and (
            not any(char.isalpha() for char in self.new_password)
            or not any(char.isdigit() for char in self.new_password)
        ):
            raise ValueError("Password must contain at least one letter and one digit")
        return self


class AdminUserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    role: str | None = Field(default=None, pattern="^(admin|user)$")
    permissions: dict[str, list[str]] | None = None
    is_active: bool | None = None
