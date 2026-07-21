---
name: lamarin
description: Manage job applications on Lamarin — track, update status, check stats, and manage follow-ups via API
version: 1.0.0
author: lamarin
license: MIT
metadata:
  hermes:
    tags: [ Productivity, Jobs, Career, lamarin ]
    related_skills: []
    requires_tools: [ web_search, web_extract, execute_command ]
required_environment_variables:
  - name: LAMARIN_API_URL
    prompt: "Enter your Lamarin instance base URL (e.g. https://lamarin.vercel.app)"
    help: "Your Lamarin deployment URL — localhost:3000 for development"
    required_for: "API requests to Lamarin"
  - name: LAMARIN_API_KEY
    prompt: "Enter your Lamarin API key or personal Hermes token"
    help: "Use the global API key (from admin) or your personal token (from Lamarin Settings > Telegram & Hermes Agent)"
    required_for: "Authenticate API requests"
---

# Lamarin Job Tracker

Manage your job applications on Lamarin through natural conversation. This skill connects Hermes to your Lamarin instance, letting you track, create, update, and review applications hands-free from Telegram.

## Quick Reference

### Authentication

The API supports two authentication modes:

**1. Personal Token (recommended for individual users)**
Set `LAMARIN_API_KEY` to your personal Hermes token (visible in Lamarin Settings > Telegram after connecting). No `x-chat-id` header needed — the token identifies you directly.

**2. Global API Key (for server-to-server / multi-user)**
Set `LAMARIN_API_KEY` to the shared `EXTERNAL_API_KEY` (from your Lamarin admin). Requires `x-chat-id` header to identify the user.

### Headers

All requests use:
- **URL:** `$LAMARIN_API_URL/api/{endpoint}`
- **Headers:** `x-api-key: $LAMARIN_API_KEY`, `Content-Type: application/json`
- **Method:** GET / POST / PATCH / DELETE as specified

When using the global API key, also include `x-chat-id: <Telegram chat ID>`.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me` | Get connected user info |
| GET | `/api/applications?page=1&limit=10&status=...&search=...` | List applications |
| POST | `/api/applications` | Create new application |
| GET | `/api/applications/{id}` | Get application detail |
| PATCH | `/api/applications/{id}` | Update application fields |
| DELETE | `/api/applications/{id}` | Delete application |
| PATCH | `/api/applications/{id}/status` | Update status only |
| GET | `/api/applications/{id}/documents` | Get application documents |
| GET | `/api/stats` | Dashboard statistics |

## Common Tasks

### 1. List recent applications (personal token — no chat-id needed)

```bash
curl -s -H "x-api-key: $LAMARIN_API_KEY" \
  "$LAMARIN_API_URL/api/applications?limit=5"
```

### 2. Check dashboard stats

```bash
curl -s -H "x-api-key: $LAMARIN_API_KEY" \
  "$LAMARIN_API_URL/api/stats"
```

### 3. Add a new application

```bash
curl -s -X POST -H "x-api-key: $LAMARIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Tech Corp","position":"Software Engineer","applicationDate":"2026-07-21","workMode":"remote","jobType":"fulltime","status":"applied"}' \
  "$LAMARIN_API_URL/api/applications"
```

### 4. Update application status

```bash
curl -s -X PATCH -H "x-api-key: $LAMARIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"interview"}' \
  "$LAMARIN_API_URL/api/applications/{id}/status"
```

## Procedure

1. When a user asks about their job applications on Lamarin, call the API directly using the configured `LAMARIN_API_KEY` (personal token).
2. No `CHAT_ID` or `x-chat-id` header needed when using a personal token.
3. Use `web_search` or `execute_command` with `curl` to call the Lamarin API.
4. Parse the JSON response and present the information clearly to the user, using Indonesian language when the user prefers it.
5. For write operations (create, update, delete), always confirm with the user before executing.

## Status Values

Application statuses: `applied`, `reviewed`, `interview`, `test`, `offered`, `accepted`, `rejected`, `withdrawn`

Work modes: `onsite`, `hybrid`, `remote`

Job types: `fulltime`, `parttime`, `internship`, `freelance`, `contract`, `temporary`, `other`

## Pitfalls

- When using the **global API key**, always include the `x-chat-id` header to identify the Lamarin user.
- When using a **personal token**, no `x-chat-id` needed — the token itself identifies you.
- The user must have Telegram connected in their Lamarin settings for the chat ID to be recognized (global key mode only).
- Use the correct API key — mismatched keys return 401.
- Create requests must include at minimum: `companyName`, `position`, `applicationDate`, `workMode`, `jobType`, `status`.
- The API returns paginated results — default is 10 items per page.

## Verification

- A 200 response means success; 401 means bad API key; 404 means user or resource not found.
- After creating an application, share the returned ID with the user for future reference.
- Stats endpoint always returns current data even if zero values.
