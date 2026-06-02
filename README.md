# Lamarin

Lamarin is an Indonesian-first job application workspace for tracking applications, preparing follow-up emails, and keeping important recruitment schedules visible in one place.

The product is built for job seekers who apply to many roles and need a clearer alternative to scattered spreadsheets, notes, inbox threads, and chat reminders. Lamarin does not promise hiring outcomes. It focuses on making the application process easier to organize, review, follow up, and export.

## Summary

Lamarin helps users manage the practical work around job applications: recording application details, tracking status changes, attaching documents, drafting follow-up emails with AI assistance, scheduling reminders, syncing calendar events, and exporting their own data.

The app is implemented as a full-stack Next.js application using the App Router, React 19, Bun, Better Auth, Drizzle ORM, PostgreSQL/Neon, Tailwind CSS, Resend, UploadThing, Google Calendar API, Telegram Bot API, and the Vercel AI SDK with Gemini.

## Problem

Job seekers often apply to multiple companies at the same time. As the number of applications grows, the process becomes hard to manage because details are split across different tools.

Common problems this project addresses:

- Application records are scattered across spreadsheets, notes, emails, browser tabs, and chat messages.
- Users forget when to follow up after applying, interviewing, or submitting additional documents.
- HR contacts, meeting links, salary notes, and document history are easy to lose.
- Writing similar follow-up emails repeatedly takes time and mental effort.
- Users need visibility into their application progress without relying on memory.
- Users need ownership of their data through export support.

## Goals

The project was designed around practical workflow goals:

- Provide one workspace for tracking applications, statuses, contacts, notes, documents, schedules, and email history.
- Keep every user's data isolated through authentication and user-scoped database queries.
- Support a calm dashboard that shows useful metrics without making exaggerated claims.
- Help users write professional follow-up drafts while keeping the user in control of review and sending.
- Connect reminders to tools users already use, such as Google Calendar and Telegram.
- Keep the technical foundation maintainable with typed schemas, server actions, validation, and clear feature boundaries.

## Process

The project follows a product-first implementation process:

1. Define the core workflow around real job-search tasks: create application, update status, attach documents, prepare follow-up, schedule reminder, and review progress.
2. Model the database around user ownership, application records, uploaded documents, follow-up emails, schedules, calendar events, and Telegram reminder logs.
3. Implement authentication with Better Auth using email/password and Google OAuth.
4. Build protected dashboard routes for overview, applications, follow-ups, settings, calendar, and Telegram configuration.
5. Use server actions for application, email, calendar, Telegram, dashboard, and export operations.
6. Add Zod validation at form/action boundaries to keep invalid input out of the database layer.
7. Integrate external services incrementally: UploadThing for files, Resend for email delivery, Gemini through the AI SDK for email drafting, Google Calendar for event sync, and Telegram for reminders.
8. Use logging and cron-protected API routes for operational tasks such as follow-up processing, calendar sync, and Telegram reminder delivery.

## Features

- **Authentication:** Better Auth email/password login and Google OAuth.
- **Dashboard overview:** Application totals, monthly activity, status breakdown, top sources, top positions, and upcoming follow-ups.
- **Application tracking:** Company, location, position, source, application date, follow-up date, job type, work mode, status, HR contact, salary, meeting link, and notes.
- **Document uploads:** Attach application documents such as CV, resume, cover letter, portfolio, certificates, and other files.
- **Follow-up email workspace:** Create drafts, send emails, schedule emails, and track draft/scheduled/sent/failed states.
- **AI email drafting:** Generate concise professional follow-up email drafts from selected application context.
- **Google Calendar integration:** Connect Google Calendar, store preferences, and sync scheduled follow-up events.
- **Telegram reminders:** Connect a Telegram chat, validate the chat ID, send test messages, and deliver reminder notifications for upcoming schedules.
- **Data export:** Export application-related data for user ownership outside the app.
- **Protected cron routes:** Secure background routes using `CRON_SECRET` for scheduled operational workflows.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js App Router |
| Runtime | Bun |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Base UI |
| Styling and motion | GSAP, Framer Motion, Motion, Lenis |
| Authentication | Better Auth |
| Database | PostgreSQL / Neon |
| ORM | Drizzle ORM and Drizzle Kit |
| Validation | Zod |
| AI | Vercel AI SDK with Google Gemini |
| Email | Resend |
| File upload | UploadThing |
| Calendar | Google Calendar API |
| Reminder channel | Telegram Bot API |
| Charts | Recharts |
| Logging | Winston |
| Export | xlsx |

## Architecture

```txt
src/
├── app/                      # Next.js routes, layouts, API routes, cron routes
├── components/               # Shared UI, layout, navigation, theme, and command palette
├── config/                   # Navigation configuration
├── db/                       # Drizzle client, schema, and seed script
├── features/                 # Feature-scoped actions, UI, and libraries
├── hooks/                    # Shared client hooks
├── lib/                      # Auth, AI, email, calendar, telegram, logger, validations, utils
├── styles/                   # Global and theme styles
├── types/                    # Shared TypeScript types
└── proxy.ts                  # Route protection / request proxy logic
```

The codebase uses feature-oriented folders for product areas such as applications, dashboard, email, calendar, export, marketing, and Telegram. Data mutations and queries are implemented with server actions and scoped to the authenticated user.

## Data Model

Core database tables include:

- `user`, `session`, `account`, `verification` for Better Auth.
- `job_applications` for application records.
- `application_documents` for uploaded document metadata.
- `follow_up_emails` for draft, scheduled, sent, and failed email records.
- `follow_up_schedules` for follow-up scheduling.
- `calendar_connections` and `calendar_events` for Google Calendar integration.
- `telegram_connections` and `telegram_reminder_logs` for Telegram reminder delivery and duplicate-send prevention.

Primary application statuses:

- `applied`
- `reviewed`
- `interview`
- `test`
- `offered`
- `accepted`
- `rejected`
- `withdrawn`

## Challenges

Key implementation challenges in this project:

- **User data isolation:** Every application, email, document, schedule, calendar event, and reminder must be scoped to the authenticated user.
- **External service coordination:** Email, AI, file uploads, calendar sync, and Telegram reminders each have different credentials, failure modes, and response shapes.
- **Reminder reliability:** Telegram reminders need duplicate-send protection and cron authentication so users do not receive repeated or unauthorized notifications.
- **AI positioning:** AI is useful for drafting, but the product must avoid implying that AI can guarantee hiring outcomes or make recruitment decisions.
- **Operational safety:** Cron routes and integrations require environment-driven configuration and secure secrets.
- **Dashboard clarity:** Metrics should help users understand progress without introducing noisy or misleading analytics.

## Results

The current implementation provides a functional full-stack job application tracker with:

- Authenticated dashboard access.
- CRUD-style application management with validation and logging.
- Application document upload support.
- Dashboard analytics for application activity and progress.
- Follow-up email draft, send, and schedule flows.
- AI-assisted email generation based on application context.
- Google Calendar connection and scheduled event creation.
- Telegram connection, test notification, and scheduled reminder support.
- Export capability for user-owned application data.
- A branded marketing landing page with an honest product message.

## Lessons Learned

- A job-search tool is most valuable when it reduces context switching rather than adding another complex workflow.
- AI works best here as a drafting assistant, not as an automation layer that removes user judgment.
- User-scoped server actions provide a straightforward pattern for protecting multi-user data in a dashboard app.
- Integrations should be optional and degrade gracefully because not every user will configure email, calendar, upload, AI, or Telegram services.
- Reminder systems need idempotency and audit records to avoid duplicate notifications.
- Product copy matters: honest positioning is important when building tools for sensitive, high-pressure workflows like job searching.

## Getting Started

### Requirements

- Bun
- PostgreSQL database, Neon recommended
- Optional service credentials for Google OAuth, Gemini, Resend, UploadThing, Google Calendar, and Telegram

### Installation

```bash
bun install
```

### Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Required and optional variables are documented in `.env.example`:

```txt
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GEMINI_API_KEY=
RESEND_API_KEY=
UPLOADTHING_TOKEN=
CRON_SECRET=
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=
GOOGLE_CALENDAR_REDIRECT_URI=
TELEGRAM_BOT_TOKEN=
```

### Database

Generate and run migrations:

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

### Lint

```bash
bun run lint
```

## Useful Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Next.js development server with Turbopack |
| `bun run dev:monitor` | Start development server through the monitor script |
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

- `/` - Marketing landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard/overview` - Dashboard analytics and summary
- `/dashboard/applications` - Application tracking workspace
- `/dashboard/follow-ups/overview` - Follow-up overview
- `/dashboard/follow-ups/compose` - Email compose workspace
- `/dashboard/settings` - User settings
- `/dashboard/settings/calendar` - Google Calendar settings
- `/dashboard/settings/telegram` - Telegram reminder settings

## Project Status

Lamarin is a portfolio-ready full-stack product implementation. The core workflow is implemented, while production readiness depends on environment configuration, database migration state, external service credentials, cron scheduling, and deployment-specific security review.
