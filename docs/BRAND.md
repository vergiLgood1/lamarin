# Lamarin Brand & Product Definition

## Project Identity

**Product name:** Lamarin

**Repository/package name:** Lamarin

**Category:** Job application tracker and follow-up workspace

**Primary language:** Indonesian-first, with support for English where useful

**Core idea:** Lamarin helps job seekers keep their application process organized: applications, statuses, documents, follow-up emails, calendar schedules, and reminders in one workspace.

## One-Line Description

Lamarin is a practical workspace for tracking job applications, preparing follow-up emails, and keeping important hiring schedules visible.

## Honest Positioning

Lamarin does not promise that users will get hired faster or automatically pass recruitment. It helps users stay organized, write better follow-up drafts, and remember important application-related tasks.

## Brand Promise

Keep every job application in orbit: visible, trackable, and easier to follow up.

## Target Users

- Job seekers applying to multiple companies
- Fresh graduates managing many openings at once
- Career switchers who need a clear application history
- Freelancers or contract workers tracking opportunities
- Anyone who currently tracks applications in spreadsheets, notes, inboxes, or chat reminders

## Main User Problems

- Application details are scattered across spreadsheets, notes, email, and browser tabs.
- Users forget when to follow up after applying or interviewing.
- HR contact information and notes are easy to lose.
- Writing follow-up emails repeatedly takes time.
- Interview and follow-up schedules can be missed.
- Users need a way to export or keep ownership of their application data.

## Product Principles

- **Honest:** Do not use fake metrics, exaggerated claims, or invented testimonials.
- **Organized:** Make the job search process easier to see and manage.
- **Human-first:** AI helps draft communication, but users review and decide.
- **Practical:** Prioritize real workflow features over decorative complexity.
- **Calm:** Reduce mental load without making the product feel noisy.

## Feature Overview

### Authentication

- User registration and login are handled with Better Auth.
- Authenticated users can access the dashboard and manage their own application data.

### Dashboard Overview

- Shows application status summary.
- Displays activity charts and application trends.
- Shows upcoming follow-up schedules.
- Includes dashboard calendar view.
- Displays top applied positions and top application sources.
- Provides recent application timeline and table views.

### Application Tracking

- Store application date.
- Store company name and company location.
- Store job position.
- Store job source.
- Track application status.
- Track job type.
- Track work mode: onsite, hybrid, or remote.
- Store follow-up date.
- Store HR contact.
- Store salary information.
- Store notes.
- Store meeting link.

### Application Documents

- Upload and attach documents to applications.
- Store document name, URL, key, size, file type, and document type.

### Follow-Up Emails

- Create follow-up email drafts connected to job applications.
- Store email subject, body, recipient, template key, status, and mode.
- Track draft, scheduled, sent, and failed email states.
- Send email using Resend when configured.
- Manage follow-up email history.

### AI Email Drafting

- Generate professional follow-up email drafts using Gemini through the AI SDK.
- Uses selected application context such as company, position, status, HR contact, notes, and template.
- Keeps generated email under a professional and concise tone.
- AI is positioned as a drafting helper, not a hiring outcome predictor.

### Google Calendar Integration

- Connect Google Calendar through OAuth.
- Store active Google Calendar connection.
- Create calendar events for follow-up, interview, or deadline schedules.
- Update existing calendar events.
- Delete linked calendar events.
- List available Google calendars.

### Telegram Reminder Integration

- Connect a Telegram chat ID.
- Validate Telegram chat ID through Telegram Bot API.
- Send Telegram reminder messages.
- Support reminder logs for follow-up schedules.
- Product copy may mention H-1 and H-0 reminders because the settings page describes this behavior.

### Export Data

- Export application-related data from settings.
- Helps users keep access to their own records outside the app.

## Application Statuses

- Applied
- Reviewed
- Interview
- Test
- Offered
- Accepted
- Rejected
- Withdrawn

## Email Statuses

- Draft
- Scheduled
- Sent
- Failed

## Job Types

- Full-time
- Part-time
- Internship
- Freelance
- Contract
- Temporary
- Other

## Work Modes

- Onsite
- Hybrid
- Remote

## Calendar Event Types

- Follow-up
- Interview
- Deadline

## Marketing Messaging

### Recommended Headline Directions

- Rapikan orbit lamaran kerja.
- Satu tempat untuk melacak lamaran, follow-up, dan jadwal penting.
- Mencari kerja lebih mudah diikuti saat semua konteksnya terlihat.

### Recommended Supporting Copy

- Lamarin membantu mencatat lamaran, menyiapkan follow-up, dan menjaga jadwal tetap terlihat.
- AI membantu membuat draft email dari konteks lamaran yang kamu pilih. Kamu tetap membaca, mengedit, dan memutuskan kapan dikirim.
- Hubungkan Google Calendar dan Telegram jika kamu ingin reminder di tempat yang sudah kamu pakai.

### Claims To Avoid

- Do not claim guaranteed hiring success.
- Do not claim increased interview rates unless backed by real measured data.
- Do not use fake user counts, company logos, testimonials, or revenue numbers.
- Do not imply the app automatically applies to jobs.
- Do not imply AI makes recruitment decisions.

## Visual Direction

### Current Landing Direction

**Cinematic dark orbit**

- Dark, immersive background.
- Orbit-inspired visual language.
- Glass-like cards using semantic theme variables.
- Calm motion with GSAP scroll storytelling.
- React Bits-inspired background, split text, fade content, and spotlight cards.

### Design Keywords

- Orbit
- Calm
- Focused
- Cinematic
- Organized
- Practical
- Honest

## Tone Of Voice

- Clear and direct.
- Indonesian-first.
- Practical, not hype-driven.
- Supportive without sounding like a motivational poster.
- Honest about what the product does and does not do.

## Example Elevator Pitch

Lamarin is a job application workspace for people who apply to multiple roles and need a clearer way to track progress. It keeps application details, statuses, documents, follow-up emails, calendar schedules, and reminders connected in one place. AI can help draft follow-up emails, but users stay in control of review and sending.

## Technical Summary

- Framework: Next.js App Router
- React: React 19
- Styling: Tailwind CSS with semantic theme variables
- Auth: Better Auth
- Database: Drizzle ORM with PostgreSQL/Neon
- Email: Resend
- AI: Google Gemini through AI SDK
- Calendar: Google Calendar API
- Reminder channel: Telegram Bot API
- Animation: GSAP and React Bits-inspired local components

## Route Summary

- `/` - Public marketing landing page
- `/login` - Public login page
- `/register` - Public registration page
- `/dashboard/overview` - Authenticated dashboard overview
- `/dashboard/applications` - Authenticated application tracking
- `/dashboard/send-email` - Authenticated email management
- `/dashboard/follow-ups/overview` - Authenticated follow-up overview
- `/dashboard/follow-ups/compose` - Authenticated follow-up compose flow
- `/dashboard/settings` - Authenticated settings and integrations
- `/dashboard/settings/calendar` - Google Calendar integration
- `/dashboard/settings/telegram` - Telegram integration
