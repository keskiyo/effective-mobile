# Auth

Кастомная система аутентификации и авторизации без auth-фреймворков.

## Можно запустить из корня проекта

```bash
docker compose up -d --build; cd web; yarn dev
```

## Запуск backend

```bash
docker compose up --build
```

Команда поднимает PostgreSQL и FastAPI backend. Backend автоматически запускает:

```bash
alembic upgrade head && python -m app.db.seed && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Все переменные для Docker и backend берутся из корневого файла `.env`, файл .env.example переименуйте.

## Запуск frontend

```bash
cd web
yarn
yarn dev
```

Frontend ожидает API по адресу:

```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Vite настроен читать переменные из корневого `.env`, отдельный `web/.env` не нужен.

## Тестовые пользователи

```text
Admin:
email: admin@example.com
password: Admin123!

User:
email: user@example.com
password: User123!
```

## Упрощенная авторизация

В проекте используется одна основная таблица `users`. В ней хранятся данные пользователя, bcrypt hash пароля, роль, permissions и статус активности.

Роль хранится прямо в поле `role` в lowercase: `admin` или `user`.

Права хранятся прямо в поле `permissions` типа JSONB:

```json
{
	"projects": ["read"],
	"admin": ["manage"]
}
```

Отдельные таблицы `roles`, `permissions`, `user_roles`, `role_permissions` не используются.

Dependency `require_permission(resource_name, action)` работает так:

1. Читает JWT из `Authorization: Bearer <token>`.
2. Декодирует токен через PyJWT.
3. Находит пользователя по `sub`.
4. Проверяет `is_active`.
5. Проверяет наличие `action` внутри `user.permissions[resource_name]`.

Если токен отсутствует, истек, невалиден, пользователь не найден или inactive, backend возвращает `401`. Это проблемы аутентификации.

Если пользователь валиден, но нужного permission нет, backend возвращает `403`. Это отказ авторизации.

`projects` является mock-ресурсом. Таблица `projects` не создается, данные проектов лежат hardcoded массивом в Python-коде. При этом endpoints `/api/v1/projects` защищены реальной проверкой permissions из таблицы `users`, поэтому mock projects демонстрируют настоящую backend-авторизацию без лишней бизнес-таблицы.

## Основные endpoints

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout

GET    /api/v1/users/me
PUT    /api/v1/users/me
DELETE /api/v1/users/me

GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/{user_id}
DELETE /api/v1/admin/users/{user_id}

GET    /api/v1/projects
POST   /api/v1/projects
DELETE /api/v1/projects/{project_id}
```

## Проверка таблиц

Initial Alembic migration создает только таблицу `users` и индекс email.
