from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.dependencies import require_permission
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.schemas.project import ProjectCreate, ProjectRead

router = APIRouter()

MOCK_PROJECTS = [
    {
        "id": "project-1",
        "name": "Internal CRM",
        "description": "Demo project for permission check",
    },
    {
        "id": "project-2",
        "name": "Analytics Dashboard",
        "description": "Another mock project",
    },
]


@router.get("", response_model=list[ProjectRead])
@router.get("/", response_model=list[ProjectRead], include_in_schema=False)
def list_projects(_: Annotated[User, Depends(require_permission("projects", "read"))]):
    return MOCK_PROJECTS


@router.post("", response_model=ProjectRead, status_code=201)
@router.post("/", response_model=ProjectRead, status_code=201, include_in_schema=False)
def create_project(
    payload: ProjectCreate,
    _: Annotated[User, Depends(require_permission("projects", "write"))],
):
    return {
        "id": "mock-generated-id",
        "name": payload.name,
        "description": payload.description,
    }


@router.delete("/{project_id}", response_model=MessageResponse)
def delete_project(
    project_id: str,
    _: Annotated[User, Depends(require_permission("projects", "delete"))],
):
    return MessageResponse(message="Mock project deleted")
