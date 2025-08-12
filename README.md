Вот вариант README для твоего OpenAPI, оформленный так, чтобы было удобно читать и использовать разработчикам:

---

# 📌 Konban API

API для Kanban-доски, построенной на **Next.js v15 + Prisma**.
Позволяет работать с колонками, задачами и пользователями, включая авторизацию по JWT.

## 🌍 Базовый URL

```
http://b-tasks/api
```

## 🔐 Авторизация

Некоторые эндпоинты требуют **Bearer Token** (JWT).
Передавайте его в заголовке:

```
Authorization: Bearer <your_token>
```

---

## 📚 Содержание

* [Колонки](#колонки-columns)
* [Задачи](#задачи-tasks)
* [Пользователи](#пользователи-users)
* [Текущий пользователь](#текущий-пользователь-me)

---

## 📂 Колонки (`/columns`)

### Получить все колонки с задачами

`GET /columns` → `200 OK` — массив [`Column`](#схемы)

### Создать колонку

`POST /columns`
Тело: [`ColumnCreate`](#схемы)
Ответ: `200 OK` — [`Column`](#схемы)
Ошибки: `400` — нарушение уникальности

### Получить колонку по ID

`GET /columns/{id}` → `200 OK` — [`Column`](#схемы), `404` — не найдена

### Обновить колонку

`PUT /columns/{id}`
Тело: [`ColumnUpdate`](#схемы)
Ответ: `200 OK` — [`Column`](#схемы)

### Удалить колонку

`DELETE /columns/{id}` → `200 OK`, `404` — не найдена

---

## ✅ Задачи (`/tasks`)

### Получить все задачи

`GET /tasks` → `200 OK` — массив [`Task`](#схемы)

### Создать задачу

`POST /tasks`
Тело: [`TaskCreate`](#схемы)
Ответ: `200 OK` — [`Task`](#схемы)

### Получить задачу по ID

`GET /tasks/{id}` → `200 OK` — [`Task`](#схемы), `404` — не найдена

### Обновить задачу

`PUT /tasks/{id}`
Тело: [`TaskUpdate`](#схемы)
Ответ: `200 OK` — [`Task`](#схемы)

### Удалить задачу

`DELETE /tasks/{id}` → `200 OK`, `404` — не найдена

---

## 👤 Пользователи (`/users`)

### Получить всех пользователей

`GET /users` → `200 OK` — массив [`User`](#схемы)

### Создать пользователя

`POST /users`
Тело: [`UserCreate`](#схемы)
Ответ: `200 OK` — [`User`](#схемы)

### Получить пользователя по ID

`GET /users/{id}` → `200 OK` — [`User`](#схемы), `404` — не найден

### Обновить пользователя

`PUT /users/{id}`
Тело: [`UserUpdate`](#схемы)
Ответ: `200 OK` — [`User`](#схемы)

### Удалить пользователя

`DELETE /users/{id}` → `200 OK`, `404` — не найден

### Получить задачи пользователя

`GET /users/{id}/tasks` → `200 OK` — массив [`Task`](#схемы)

---

## 🧑‍💻 Текущий пользователь (`/users/me`)

> Требуется авторизация (**bearerAuth**)

* `GET /users/me` — Данные текущего пользователя (`200 OK`) или `401` — не авторизован
* `DELETE /users/me` — Удалить аккаунт (`200 OK`) или `401`

### Задачи текущего пользователя

`GET /users/me/tasks` → `200 OK` — массив [`Task`](#схемы)

---

## 📦 Схемы

<details>
<summary><b>Column</b></summary>

```json
{
  "id": "string",
  "title": "New Column",
  "color": "#CCCCCC",
  "createdAt": "2025-01-01T12:00:00Z",
  "tasks": [ /* Task */ ]
}
```

</details>

<details>
<summary><b>ColumnCreate</b></summary>

```json
{
  "title": "string",
  "color": "string"
}
```

</details>

<details>
<summary><b>Task</b></summary>

```json
{
  "id": "string",
  "content": "New Task",
  "color": "#CCCCCC",
  "createdAt": "2025-01-01T12:00:00Z",
  "tags": ["tag1", "tag2"],
  "position": 1,
  "columnId": "string",
  "userId": "string"
}
```

</details>

<details>
<summary><b>User</b></summary>

```json
{
  "id": "string",
  "login": "string",
  "email": "string",
  "color": "#CCCCCC",
  "createdAt": "2025-01-01T12:00:00Z",
  "tags": ["tag1"],
  "metadata": {},
  "nickname": "Anonymous",
  "password": "string",
  "avatarUrl": "avatars/unset_avatar.jpg"
}
```

</details>

---

## 🚀 Быстрый старт

1. Запустить сервер с API
2. Подключиться к `http://b-tasks/api`
3. Использовать Postman / curl / frontend для работы с эндпоинтами
4. Для защищённых запросов — получить JWT токен и передавать в заголовке

---

Хочешь, я сделаю ещё **curl-примеры для всех эндпоинтов**, чтобы можно было тестировать API прямо из терминала?
Так README будет как мини-документация с тестами.
