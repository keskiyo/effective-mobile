from app.models.user import User


def has_permission(user: User, resource_name: str, action: str) -> bool:
    permissions = user.permissions or {}
    actions = permissions.get(resource_name, [])
    return action in actions
