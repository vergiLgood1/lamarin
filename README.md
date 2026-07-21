# Lamarin

Lamarin is an Indonesian-first job application tracker — a focused dashboard for recording applications, tracking status changes, attaching documents, and exporting data.

The product is built for job seekers who apply to many roles and need a clearer alternative to scattered spreadsheets, notes, inbox threads, and chat reminders. Lamarin does not promise hiring outcomes. It focuses on keeping your application data organized in one place.

Lamarin is designed to work alongside **[Hermes Agent](https://hermes-agent.nousresearch.com)** — an autonomous AI agent that handles the action layer: drafting follow-up emails, managing schedules, sending reminders, and interacting with you via Telegram.

## Summary

Lamarin helps users manage the practical work around job applications: recording application details, tracking status changes, attaching documents, and exporting data. The "action" features (AI email drafting, calendar sync, scheduled reminders) are handled by Hermes Agent, which accesses Lamarin's data through a dedicated external API.

The app is implemented as a full-stack Next.js application using the App Router, React 19, Bun, Better Auth, Drizzle ORM, PostgreSQL/Neon, Tailwind CSS, UploadThing, and Telegram Bot API.

## Architecture

```
Lamarin (Dashboard + Source of Truth)
  ┌──────────────────────────────────┐
  │  Lamarin Web App                │
  │  - Application CRUD            │
  │  - Dashboard & Stats           │
  │  - Document Upload             │
  │  - Data Export                 │
  │  - Telegram Connection         │
  └────────────┬───────────────────┘
               │ External API (x-api-key + x-chat-id)
               ▼
  ┌──────────────────────────────────┐
  │  Hermes Agent                    │
  │  (external service)              │
  │  - AI Email Drafting             │
  │  - Schedule Management           │
  │  - Calendar Integration          │
  │  - Telegram Notifications        │
  │  - Multi-platform Chat           │
  └──────────────────────────────────┘
```

Lamarin is the **source of truth** for your application data. Hermes Agent is the **execution layer** that reads and writes data through the API.
## Problem

Job seekers often apply to multiple companies at the same time. As the number of applications grows, the process becomes hard to manage because details are split across different tools.

Common problems this project addresses:

- Application records are scattered across spreadsheets, notes, emails, browser tabs, and chat messages.
- HR contacts, meeting links, salary notes, and document history are easy to lose.
- Users need visibility into their application progress without relying on memory.
- Users need ownership of their data through export support.
- Writing similar follow-up emails repeatedly takes time and mental effort — handled by Hermes Agent.

## Goals

- Provide one workspace for tracking applications, statuses, contacts, notes, and documents.
- Keep every user's data isolated through authentication and user-scoped database queries.
- Support a calm dashboard that shows useful metrics without making exaggerated claims.
- Expose a clean external API so Hermes Agent (or any AI agent) can access application data.
- Keep the technical foundation maintainable with typed schemas, server actions, validation, and clear feature boundaries.

## Features

- **Authentication:** Better Auth email/password login and Google OAuth.
- **Dashboard:** Overview cards showing total applications, monthly counts, status breakdown, top sources, activity chart, and job type distribution.
- **Application Tracking:** Full CRUD workspace with company name, position, work mode, job type, source, salary, HR contact, meeting links, and notes.
- **Document Upload:** Attach CVs, portfolios, certificates, or any file to each application via UploadThing.
- **Status Management:** Track applications through applied, reviewed, interview, test, offered, accepted, rejected, withdrawn.
- **Data Export:** Export all application data to CSV or Excel format.
- **External API:** REST endpoints for Hermes Agent integration — list, create, update, delete applications, check stats, and get user info.
- **Telegram Connection:** Link your Telegram account as an identity bridge so Hermes Agent can access your data.
## External API (for Hermes Agent)

Lamarin exposes a REST API that Hermes Agent (or any external tool) can use to access application data.

### Authentication

All requests require two headers:

- `x-api-key` — shared secret (set as `EXTERNAL_API_KEY` in your `.env`)
- `x-chat-id` — Telegram chat ID of the user (maps to their Lamarin account via `telegramConnections`)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/me` | Get connected user info |
| `GET` | `/api/applications?status=&search=&page=&limit=` | List user's applications |
| `POST` | `/api/applications` | Create a new application |
| `GET` | `/api/applications/{id}` | Get application with documents |
| `PATCH` | `/api/applications/{id}` | Update application fields |
| `DELETE` | `/api/applications/{id}` | Delete an application |
| `PATCH` | `/api/applications/{id}/status` | Update application status |
| `GET` | `/api/applications/{id}/documents` | List application documents |
| `GET` | `/api/stats` | Dashboard statistics |

### Install Hermes Skill

```bash
npx skills add vergiLgood1/lamarin --skill lamarin
```

This installs the Lamarin skill into Hermes Agent, enabling natural language interactions with your application data via Telegram.

## Hermes Agent Integration Setup

1. **Install Hermes Agent** on your server or VPS.
2. **Get your Telegram Chat ID** by chatting with [@userinfobot](https://t.me/userinfobot).
3. **Connect Telegram** in Lamarin Settings (enter your Chat ID).
4. **Install the Lamarin skill:**
   ```bash
   npx skills add vergiLgood1/lamarin --skill lamarin
   ```
5. **Set environment variables** in your Hermes Agent config:
   ```bash
   export LAMARIN_API_URL="https://your-lamarin-instance.com"
   export LAMARIN_API_KEY="your-external-api-key"
   ```
6. **Chat with Hermes** on Telegram to manage your applications.
## Process

1. Define the core workflow around real job-search tasks: create application, update status, attach documents, and review progress.
2. Model the database around user ownership, application records, uploaded documents, and Telegram connections.
3. Implement authentication with Better Auth using email/password and Google OAuth.
4. Build protected dashboard routes for overview, applications, and settings.
5. Use server actions for application, dashboard, and export operations.
6. Add Zod validation at form/action boundaries to keep invalid input out of the database layer.
7. Expose a key-authenticated REST API for external agent access.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Runtime | Bun |
| Auth | Better Auth (email/password + Google OAuth) |
| Database | PostgreSQL / Neon |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS 4 + shadcn/ui |
| File Upload | UploadThing |
| AI Agent | Hermes Agent (external) |
| Logging | Winston |

## Accessing from Hermes Agent

1. Deploy Lamarin (or run locally).
2. Set `EXTERNAL_API_KEY` in your Lamarin `.env`.
3. Connect your Telegram in Lamarin Settings.
4. Install the skill on your Hermes Agent:
   ```bash
   npx skills add vergiLgood1/lamarin --skill lamarin
   ```
5. Set `LAMARIN_API_URL` and `LAMARIN_API_KEY` on your Hermes Agent.
6. Chat with Hermes via Telegram — try asking:
   - "Cek lamaranku yang masih applied"
   - "Tambah lamaran baru: UI Designer di TechCorp"
   - "Update status Tokopedia jadi interview"
## Environment Variables

```txt
BETTER_AUTH_SECRET=           # Auth secret (min 32 chars)
BETTER_AUTH_URL=              # App URL (e.g. http://localhost:3000)
GOOGLE_CLIENT_ID=             # Google OAuth client ID
GOOGLE_CLIENT_SECRET=         # Google OAuth client secret
DATABASE_URL=                 # PostgreSQL connection string
UPLOADTHING_TOKEN=            # UploadThing API token
TELEGRAM_BOT_TOKEN=           # Telegram bot token
EXTERNAL_API_KEY=             # Shared secret for Hermes Agent
```

## Getting Started

### Requirements

- Bun
- PostgreSQL database, Neon recommended

### Installation

```bash
bun install
```

### Environment Variables

```bash
cp .env.example .env
```

### Database

```bash
bun run db:generate
bun run db:migrate
```

Optional seed:

```bash
bun run db:seed
```

### Development

```bash
bun run dev
```

Open `http://localhost:3000` in your browser.

### Build

```bash
bun run build
bun run start
```
## Useful Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Next.js development server with Turbopack |
| `bun run build` | Build the production app |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run database migrations |
| `bun run db:push` | Push schema changes with Drizzle Kit |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:seed` | Seed database data |
| `bun run db:reset` | Reset Drizzle migration state |

## Route Overview

### Pages

- `/` - Marketing landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard/overview` - Dashboard analytics and summary
- `/dashboard/applications` - Application tracking workspace
- `/dashboard/applications/new` - Add new application
- `/dashboard/applications/[id]` - Application detail
- `/dashboard/applications/[id]/edit` - Edit application
- `/dashboard/settings` - User settings
- `/dashboard/settings/telegram` - Telegram connection for Hermes Agent

### API Routes

- `/api/auth/[...all]` - Better Auth endpoints
- `/api/applications` - List/create applications (external API)
- `/api/applications/[id]` - Get/update/delete application (external API)
- `/api/applications/[id]/status` - Update status (external API)
- `/api/applications/[id]/documents` - Get documents (external API)
- `/api/stats` - Dashboard stats (external API)
- `/api/me` - User info from chat ID (external API)
- `/api/uploadthing` - File upload

## Project Status

Lamarin is a portfolio-ready full-stack product implementation. The core tracking workflow is implemented, with action features delegated to Hermes Agent. Production readiness depends on environment configuration, database migration state, external service credentials, and deployment-specific security review.
