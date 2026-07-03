from pydantic import BaseModel, Field


class ProjectRead(BaseModel):
    id: str
    name: str
    description: str


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=500)
