from app.schemas.user import UserRead
from pydantic import BaseModel, EmailStr, Field, model_validator


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8)
    confirm_password: str = Field(min_length=8)

    @model_validator(mode="after")
    def validate_passwords(self) -> "RegisterRequest":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        if not any(char.isalpha() for char in self.password) or not any(
            char.isdigit() for char in self.password
        ):
            raise ValueError("Password must contain at least one letter and one digit")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterResponse(UserRead):
    pass


class MessageResponse(BaseModel):
    message: str
