# Applyorbit - Job Application Tracker Dashboard

## Overview

Applyorbit adalah dashboard untuk tracking lamaran kerja. Multi-user platform yang memungkinkan setiap user melacak progress lamaran kerja mereka, dengan fitur AI-powered email follow-up otomatis.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js (latest, `src/` directory) |
| Runtime | Bun |
| UI | shadcn/ui + Tailwind CSS v4 |
| Auth | better-auth (Email/Password + Google OAuth) |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Logging | Winston |
| AI | Vercel AI SDK (multi-provider) |
| Email | Resend |
| Charts | Recharts (via shadcn/ui charts) |
| Validation | Zod |
| Export | xlsx |

---

## Database Schema

### Tabel `user` (managed by better-auth)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | TEXT (PK) | Primary key |
| name | TEXT | Nama user |
| email | TEXT (UNIQUE) | Email user |
| emailVerified | BOOLEAN | Status verifikasi email |
| image | TEXT | URL avatar |
| createdAt | TIMESTAMP | Waktu dibuat |
| updatedAt | TIMESTAMP | Waktu diupdate |

### Tabel `session` (managed by better-auth)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | TEXT (PK) | Primary key |
| userId | TEXT (FK) | FK ke user |
| token | TEXT (UNIQUE) | Session token |
| expiresAt | TIMESTAMP | Waktu expired |
| ipAddress | TEXT | IP address |
| userAgent | TEXT | User agent |

### Tabel `account` (managed by better-auth)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | TEXT (PK) | Primary key |
| userId | TEXT (FK) | FK ke user |
| accountId | TEXT | Account ID dari provider |
| providerId | TEXT | Provider (credential/google) |
| accessToken | TEXT | Access token |
| refreshToken | TEXT | Refresh token |
| accessTokenExpiresAt | TIMESTAMP | Token expiry |
| refreshTokenExpiresAt | TIMESTAMP | Refresh token expiry |
| scope | TEXT | OAuth scope |
| idToken | TEXT | ID token |
| password | TEXT | Hashed password (credential) |

### Tabel `verification` (managed by better-auth)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | TEXT (PK) | Primary key |
| identifier | TEXT | Identifier |
| value | TEXT | Verification value |
| expiresAt | TIMESTAMP | Waktu expired |
| createdAt | TIMESTAMP | Waktu dibuat |
| updatedAt | TIMESTAMP | Waktu diupdate |

### Tabel `job_applications` (data utama)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Primary key |
| userId | TEXT (FK) | FK ke user |
| applicationDate | DATE | Tanggal lamar |
| companyName | VARCHAR(255) | Nama perusahaan |
| location | VARCHAR(255) | Lokasi |
| position | VARCHAR(255) | Posisi yang dilamar |
| jobSource | VARCHAR(255) | Sumber lowongan |
| followUpDate | DATE | Tanggal follow up |
| status | ENUM | Status lamaran |
| hrContact | VARCHAR(255) | Kontak/Email HR |
| salary | VARCHAR(255) | Info gaji |
| notes | TEXT | Catatan tambahan |
| documentsSent | TEXT | Dokumen yang terkirim |
| meetingLink | VARCHAR(500) | Link Zoom/Meet |
| createdAt | TIMESTAMP | Waktu dibuat |
| updatedAt | TIMESTAMP | Waktu diupdate |

### Tabel `follow_up_emails` (log email follow-up)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Primary key |
| applicationId | UUID (FK) | FK ke job_applications |
| userId | TEXT (FK) | FK ke user |
| subject | VARCHAR(500) | Subject email |
| body | TEXT | Isi email (AI generated) |
| recipientEmail | VARCHAR(255) | Email tujuan |
| sentAt | TIMESTAMP | Waktu kirim |
| status | ENUM | draft/scheduled/sent/failed |
| mode | ENUM | manual/automatic |
| createdAt | TIMESTAMP | Waktu dibuat |

### Tabel `follow_up_schedules` (untuk auto follow-up)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Primary key |
| applicationId | UUID (FK) | FK ke job_applications |
| userId | TEXT (FK) | FK ke user |
| scheduledDate | TIMESTAMP | Jadwal kirim |
| isActive | BOOLEAN | Aktif/tidak |
| createdAt | TIMESTAMP | Waktu dibuat |
| updatedAt | TIMESTAMP | Waktu diupdate |

### Enum Values

**application_status:**
- `applied` - Sudah melamar
- `reviewed` - Sedang direview
- `interview` - Tahap interview
- `test` - Tahap tes
- `offered` - Dapat offering
- `accepted` - Diterima
- `rejected` - Ditolak
- `withdrawn` - Dibatalkan

**email_status:**
- `draft` - Draft email
- `scheduled` - Dijadwalkan
- `sent` - Terkirim
- `failed` - Gagal kirim

**email_mode:**
- `manual` - User generate & review sebelum kirim
- `automatic` - Sistem auto generate & kirim

---

## Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard overview (stats/charts)
│   │   ├── applications/
│   │   │   ├── page.tsx                # List semua lamaran + filter/search
│   │   │   ├── new/page.tsx            # Form tambah lamaran
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Detail lamaran
│   │   │       └── edit/page.tsx       # Edit lamaran
│   │   ├── follow-ups/
│   │   │   └── page.tsx                # Manage follow-up & email drafts
│   │   └── settings/
│   │       └── page.tsx                # User settings
│   ├── api/
│   │   ├── auth/[...all]/route.ts      # better-auth handler
│   │   ├── ai/generate/route.ts        # AI streaming response
│   │   └── cron/follow-up/route.ts     # Cron job auto follow-up
│   └── layout.tsx
├── actions/
│   ├── applications/
│   │   ├── mutations.ts                # create, update, delete
│   │   └── queries.ts                  # getAll, getById, getFiltered
│   ├── follow-up/
│   │   ├── mutations.ts                # sendEmail, scheduleFollowUp, cancelSchedule
│   │   └── queries.ts                  # getFollowUps, getSchedules
│   ├── export/
│   │   ├── mutations.ts                # exportToCSV, exportToExcel
│   │   └── queries.ts                  # getExportData
│   └── dashboard/
│       ├── mutations.ts                # (reserved for future use)
│       └── queries.ts                  # getStats, getChartData
├── components/
│   ├── ui/                             # shadcn components
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── nav-user.tsx
│   ├── dashboard/
│   │   ├── stats-cards.tsx
│   │   ├── status-chart.tsx
│   │   ├── trend-chart.tsx
│   │   └── recent-applications.tsx
│   ├── applications/
│   │   ├── application-form.tsx
│   │   ├── application-table.tsx
│   │   ├── filter-bar.tsx
│   │   └── status-badge.tsx
│   └── follow-up/
│       ├── email-preview.tsx
│       ├── email-composer.tsx
│       └── schedule-form.tsx
├── db/
│   ├── index.ts                        # Drizzle client connection
│   ├── schema.ts                       # All schema definitions
│   └── migrations/                     # Migration files
├── lib/
│   ├── auth.ts                         # better-auth server config
│   ├── auth-client.ts                  # better-auth client config
│   ├── logger.ts                       # Winston logger config
│   ├── ai.ts                           # Vercel AI SDK config
│   ├── email.ts                        # Resend config
│   ├── validations.ts                  # Zod schemas
│   └── utils.ts                        # Utility functions
├── hooks/
│   ├── use-applications.ts
│   └── use-session.ts
├── types/
│   └── index.ts                        # TypeScript type definitions
└── middleware.ts                        # Auth middleware (route protection)
```

---

## Server Actions Pattern

Setiap fitur memiliki 2 file:
- `mutations.ts` - Create, Update, Delete operations
- `queries.ts` - Read/fetch operations

### Pattern Example:

```typescript
// src/actions/applications/mutations.ts
"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/db"
import { jobApplications } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { logger } from "@/lib/logger"
import { applicationSchema } from "@/lib/validations"

export async function createApplication(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")

  const validated = applicationSchema.parse(Object.fromEntries(formData))
  await db.insert(jobApplications).values({
    ...validated,
    userId: session.user.id,
  })

  logger.info("Application created", { userId: session.user.id })
  revalidatePath("/dashboard/applications")
}
```

---

## API Routes (tetap digunakan untuk)

| Route | Alasan |
|-------|--------|
| `/api/auth/[...all]` | better-auth membutuhkan route handler |
| `/api/ai/generate` | Streaming response untuk AI email generation |
| `/api/cron/follow-up` | Dipanggil oleh external cron/scheduler |

---

## Fitur

### 1. Authentication
- Register dengan email/password
- Login dengan email/password
- Login dengan Google OAuth
- Session management
- Protected routes via middleware

### 2. CRUD Lamaran Kerja
- Tambah data lamaran baru (form)
- Lihat daftar semua lamaran (table dengan pagination)
- Edit data lamaran
- Hapus data lamaran
- Detail view per lamaran

### 3. Dashboard Statistik
- Total lamaran bulan ini vs bulan lalu
- Breakdown status (pie/donut chart)
- Trend lamaran per bulan (line/bar chart)
- Top sumber lowongan
- Upcoming follow-ups

### 4. Filter & Search
- Search by nama perusahaan, posisi
- Filter by status, tanggal, lokasi, sumber lowongan
- Sort by tanggal, nama perusahaan, status
- Pagination

### 5. Export Data
- Export ke CSV
- Export ke Excel (.xlsx)
- Filter data sebelum export

### 6. AI Email Follow-up
- **Semi-otomatis**: Klik tombol → AI generate draft → user review/edit → kirim
- **Full otomatis**: Set jadwal → sistem auto generate & kirim pada waktu yang ditentukan
- Template context-aware (berdasarkan posisi, perusahaan, status)
- Log semua email yang terkirim

### 7. Logging (Winston)
- Log API requests
- Log auth events
- Log email sending events
- Log errors
- Output ke file + console

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/applyorbit

# Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI
GEMINI_API_KEY=your-openai-api-key

# Email
RESEND_API_KEY=your-resend-api-key

# Cron (optional)
CRON_SECRET=your-cron-secret
```

---

## Tahapan Implementasi

| Phase | Task | Prioritas |
|-------|------|-----------|
| 1 | Setup project (Next.js, Bun, Tailwind, shadcn) | High |
| 2 | Setup database (PostgreSQL, Drizzle, schema, migrations) | High |
| 3 | Setup auth (better-auth, login/register pages) | High |
| 4 | Setup Winston logger | Medium |
| 5 | CRUD lamaran kerja (Server Actions + UI) | High |
| 6 | Filter & Search | Medium |
| 7 | Dashboard statistik & charts | Medium |
| 8 | Export CSV/Excel | Medium |
| 9 | AI email follow-up (Vercel AI SDK + Resend) | Medium |
| 10 | Auto-schedule follow-up (cron) | Low |

---

## Audit Terbaru Berdasarkan Marketing Page

Tanggal audit: 2026-05-29

Marketing page saat ini memposisikan Lamarin sebagai workspace untuk:

- Pencatatan lamaran kerja.
- AI generated follow-up email draft.
- Manual email send.
- Scheduled email send.
- Reminder melalui Google Calendar.
- Reminder melalui messaging channel seperti Telegram, WhatsApp, Discord, dan channel lain.
- Dokumen/files/notes yang terhubung ke lamaran.
- Subscription untuk membatasi dan memonetisasi fitur premium.

### Ringkasan Status Implementasi

| Marketing Feature | Status | Bukti Implementasi | Gap Utama |
|---|---:|---|---|
| Authentication | Implemented | `src/app/(auth)`, `src/lib/auth-server.ts`, better-auth tables di `src/db/schema.ts` | Perlu audit UX email verification dan reset password jika akan dipakai production. |
| Application tracking | Implemented | `src/features/applications/actions`, `application-form`, `application-table`, `application-detail-view`, `job_applications` table | Perlu polish UX pipeline/quick status jika ingin lebih dekat dengan visual marketing. |
| Filter/search/sort/pagination | Implemented | `getApplications(filters)` mendukung search, status, date, location, work mode, source, sort, pagination | Perlu cek UI filter lengkap sudah expose semua filter. |
| Documents/files/notes | Implemented/Partial | `application_documents`, UploadThing libs, `file-upload.tsx`, documents saved in create/update application | Perlu document preview, delete individual file, quota/storage limit, dan stronger file type policy. |
| AI follow-up draft | Implemented/Partial | `/api/ai/generate`, `src/lib/ai.ts`, `followUpEmails`, follow-up/email compose UI | Perlu usage quota, prompt hardening, template quality review, dan explicit review gate sebelum scheduled send. |
| Manual email send | Implemented | Resend in `src/lib/email.ts`, `sendFollowUpEmail`, `sendApplicationEmail` | Perlu sender/domain settings, reply-to per user, rate limit, send confirmation UX. |
| Scheduled email send | Implemented/Partial | `follow_up_schedules`, `/api/cron/follow-up`, `scheduleApplicationEmail`, `createScheduledFollowUp` | Perlu cancel/reschedule UI audit, retry strategy, idempotency guard, timezone handling, and review-before-send enforcement. |
| Google Calendar reminders | Implemented/Partial | `calendar_connections`, `calendar_events`, Google OAuth connect/callback, `upsertGoogleCalendarEvent` | Token encryption/refresh handling needs hardening. Need event update/delete consistency and timezone preference use everywhere. |
| Telegram reminders | Implemented/Partial | `telegram_connections`, `telegram_reminder_logs`, `/api/cron/telegram-reminders`, settings Telegram page | Currently Telegram only. Need generalized reminder engine for multi-channel. |
| WhatsApp reminders | Missing | No WhatsApp provider/actions/schema found | Need provider decision: WhatsApp Business Cloud API, Twilio, or local provider. |
| Discord reminders | Missing | No Discord webhook/actions/schema found | Add webhook storage, validation, test send, delivery adapter. |
| Dashboard statistics | Implemented | `src/features/dashboard` actions/components, overview routes | Need ensure stats align with latest features: scheduled sends, draft status, reminders. |
| Export data | Implemented/Partial | `src/features/export/actions`, settings export card | Need confirm export includes documents metadata, email logs, schedules, calendar/reminder logs. |
| Logging | Implemented | `src/lib/logger.ts`, logs in actions and cron | Need audit log table for user-visible automation history. |
| Subscription/billing | Missing | No Stripe/Polar/Lemon billing implementation found | Needs schema, provider, webhooks, plan guards, usage tracking, upgrade UI. |

### Catatan Audit Terhadap Planning Lama

Planning lama masih relevan, tetapi sebagian besar fitur core sudah berjalan dan struktur repo sudah berubah dari rencana awal:

- Server actions tidak lagi berada di `src/actions/*`, tetapi sudah dipindah lebih modular ke `src/features/*/actions`.
- Application tracking sudah memiliki dokumen upload melalui `application_documents`.
- Follow-up email sudah memiliki jalur manual, draft, scheduled, cron send, dan Google Calendar event creation.
- Telegram sudah ada sebagai channel reminder pertama.
- Subscription belum ada sama sekali dan perlu menjadi phase baru.
- Nama produk di dokumen masih `Applyorbit`, sedangkan marketing/app sekarang menggunakan `Lamarin`. Perlu rename bertahap di copy internal, Telegram messages, env docs, dan README agar konsisten.

---

## Feature Gap Detail

### 1. Application Tracking

Status: Implemented.

Sudah ada:

- CRUD lamaran kerja.
- Status enum.
- Company, position, source, date, location, work mode, job type, salary, HR contact, meeting link, notes.
- Documents attached during create/update.
- List, detail, edit, and new application pages.
- Filtering, sorting, search, pagination at query layer.

Next improvements:

- Add quick status update from table/detail.
- Add pipeline/kanban view to match marketing language.
- Add application timeline: created, status changed, email drafted, email sent, reminder scheduled.
- Add `jobUrl` field if `jobSource` is currently overloaded.
- Add explicit `recruiterName` and `recruiterEmail` if HR contact becomes too generic.

### 2. Documents, Files, And Notes

Status: Implemented/Partial.

Sudah ada:

- `application_documents` table.
- UploadThing client/server libs.
- Documents saved to application.
- Document type inference from filename.
- Notes field on application.

Next improvements:

- Individual file delete without replacing all documents.
- File preview/download UI on detail page.
- Document type selector instead of filename-only inference.
- Storage quota per subscription plan.
- Virus/type/size validation policy.
- Include file metadata in AI draft context where useful.

### 3. AI Follow-Up Draft

Status: Implemented/Partial.

Sudah ada:

- Gemini via Vercel AI SDK.
- `/api/ai/generate` streaming endpoint.
- Email templates via `src/features/email/lib/templates.ts`.
- `follow_up_emails` table with template key, status, mode.
- Compose and editor components.

Next improvements:

- AI usage quota by plan.
- Prompt safety and quality tests.
- Draft language selector.
- Tone selector: professional, warm, concise, assertive.
- Regenerate/improve selected draft section.
- Store generation metadata: model, prompt version, token estimate, template key.
- Clear review gate before any scheduled send.

### 4. Manual Email Send

Status: Implemented.

Sudah ada:

- Resend integration.
- Send immediately through follow-up and email actions.
- Sent/failed status update.
- Email log in `follow_up_emails`.

Next improvements:

- Sender identity settings.
- User reply-to configuration.
- Domain verification strategy.
- Rate limits to avoid abuse.
- Confirmation modal before sending.
- Better failure messages from provider.

### 5. Scheduled Email Send

Status: Implemented/Partial.

Sudah ada:

- `follow_up_schedules` table.
- Scheduled email status.
- Cron route `/api/cron/follow-up`.
- Scheduled email creates Google Calendar event when connected.
- Schedule cancel action exists.

Next improvements:

- Idempotency guard to prevent duplicate sends if cron retries.
- Retry policy with attempt count and last error.
- Timezone should use user/calendar preference, not hardcoded `Asia/Jakarta` everywhere.
- Cancel/reschedule UX audit.
- Scheduled send queue monitoring/admin visibility.
- Require `reviewedAt` or explicit confirmation before schedule can be active.

### 6. Google Calendar

Status: Implemented/Partial.

Sudah ada:

- Google OAuth connect/callback routes.
- `calendar_connections` and `calendar_events` tables.
- Calendar preferences update.
- Event create/update/delete helper.
- Calendar sync cron route exists.

Next improvements:

- Encrypt access/refresh tokens at rest.
- Robust token refresh handling.
- Support calendar selection in every scheduling flow.
- Event update/delete consistency when schedule changes.
- Display linked calendar event on application/follow-up detail.
- Add reconnect flow when token invalid.

### 7. Messaging Reminders

Status: Telegram implemented/partial, Discord and WhatsApp missing.

Sudah ada:

- Telegram connection settings.
- Chat ID validation.
- Test notification.
- Telegram reminder cron for active follow-up schedules.
- Reminder logs to prevent duplicate Telegram notifications.

Next improvements:

- Generalized `reminders` table independent from `follow_up_schedules`.
- Generalized `reminder_deliveries` table for all channels.
- Channel adapters: Telegram, Discord, WhatsApp, email, app notification.
- User notification preferences: enabled channels, quiet hours, timezone.
- Discord webhook integration.
- WhatsApp provider integration.
- Retry and failed delivery logging.

### 8. Dashboard And Analytics

Status: Implemented/Partial.

Sudah ada:

- Dashboard overview routes and components.
- Stats, charts, upcoming schedule, activity, sources, status metrics.

Next improvements:

- Add email/draft metrics: draft count, scheduled count, sent count, failed count.
- Add reminder metrics: upcoming reminders, sent reminders, failed deliveries.
- Add conversion/funnel metrics from Applied to Interview/Offer.
- Ensure chart queries handle multi-user data isolation.

### 9. Export Data

Status: Implemented/Partial.

Sudah ada:

- Export actions and settings export card.

Next improvements:

- Export should include applications, documents metadata, follow-up emails, schedules, calendar events, and reminder logs.
- Add plan gating if export becomes premium.
- Add JSON export for account portability.

---

## Subscription Planning

Subscription belum diimplementasikan. Ini perlu menjadi planning utama berikutnya karena banyak fitur marketing berpotensi berbiaya: AI, email sending, scheduled jobs, file storage, Google Calendar, dan WhatsApp.

### Billing Provider Recommendation

Rekomendasi: Stripe.

Alasan:

- Mature subscription support.
- Customer portal.
- Webhook ecosystem kuat.
- Usage/quantity billing bisa ditambahkan nanti.

Alternatif:

- Polar: lebih developer-friendly dan sederhana.
- Lemon Squeezy: lebih mudah untuk merchant of record, tapi fleksibilitas usage billing perlu dicek.

### Proposed Plans

| Feature | Free | Pro | Premium |
|---|---:|---:|---:|
| Applications | 20 | Unlimited | Unlimited |
| AI drafts | 5/month | 200/month | Higher/fair use |
| Manual email send | 5/month | 200/month | Higher/fair use |
| Scheduled email send | Not included or 3/month | Included | Higher quota |
| Google Calendar | Not included | Included | Included |
| Telegram reminders | Limited | Included | Included |
| Discord reminders | Not included | Included | Included |
| WhatsApp reminders | Not included | Not included or limited | Included |
| File uploads | Limited storage | Higher storage | Highest storage |
| Export | CSV basic | CSV/Excel/JSON | CSV/Excel/JSON |

### Required Schema

Add tables:

- `subscriptions`
  - `id`
  - `userId`
  - `provider`
  - `providerCustomerId`
  - `providerSubscriptionId`
  - `plan`
  - `status`
  - `currentPeriodStart`
  - `currentPeriodEnd`
  - `cancelAtPeriodEnd`
  - `createdAt`
  - `updatedAt`

- `usage_events`
  - `id`
  - `userId`
  - `eventType`
  - `quantity`
  - `metadata`
  - `createdAt`

- Optional `usage_counters`
  - `id`
  - `userId`
  - `period`
  - `applicationsCount`
  - `aiDraftsCount`
  - `manualEmailsCount`
  - `scheduledEmailsCount`
  - `remindersSentCount`
  - `storageBytesUsed`
  - `updatedAt`

### Plan Guards

Create centralized helpers:

- `getUserPlan(userId)`
- `assertFeatureAccess(userId, featureKey)`
- `assertUsageLimit(userId, usageKey)`
- `recordUsage(userId, usageKey, quantity, metadata)`

Guard these actions:

- Create application.
- Generate AI draft.
- Send email.
- Schedule email.
- Upload files.
- Connect Google Calendar.
- Connect Telegram/Discord/WhatsApp.
- Export data.

### Billing Routes And UI

Add routes/pages:

- `/dashboard/billing`
- `/api/billing/checkout`
- `/api/billing/portal`
- `/api/billing/webhook`

Add UI:

- Current plan card.
- Usage meters.
- Upgrade CTA.
- Manage billing button.
- Feature gate prompts.

### Subscription Acceptance Criteria

- User can start checkout.
- Webhook updates subscription status.
- User can open customer portal.
- Free users hit clear limits with upgrade prompts.
- Pro users unlock scheduled send, Google Calendar, and messaging reminders.
- Usage is recorded for AI drafts, email sends, schedules, reminders, and storage.

---

## Revised Implementation Phases

| Phase | Task | Priority | Status |
|---|---|---:|---:|
| 1 | Core auth, DB, dashboard shell | High | Done/Partial |
| 2 | Application CRUD, filters, detail, documents | High | Done/Partial |
| 3 | AI draft generation and templates | High | Done/Partial |
| 4 | Manual email send | High | Done/Partial |
| 5 | Scheduled email send cron | High | Done/Partial |
| 6 | Google Calendar integration | High | Done/Partial |
| 7 | Telegram reminders | Medium | Done/Partial |
| 8 | General reminder engine | High | Missing |
| 9 | Discord reminder channel | Medium | Missing |
| 10 | WhatsApp reminder channel | Medium | Missing |
| 11 | Subscription/billing | High | Missing |
| 12 | Usage limits and feature gates | High | Missing |
| 13 | Security hardening: token encryption, rate limits, idempotency | High | Missing/Partial |
| 14 | QA/E2E for full marketing promise | High | Missing |

---

## Recommended Next Tasks

Urutan paling pragmatis setelah audit:

1. Rename remaining product copy from `Applyorbit` to `Lamarin` where user-facing.
2. Add idempotency and retry fields for scheduled email cron.
3. Add explicit review gate for scheduled emails.
4. Generalize reminder system beyond Telegram/follow-up schedules.
5. Add Discord webhook reminder integration.
6. Add subscription schema and billing provider integration.
7. Add plan guards and usage counters.
8. Harden Google token storage and timezone usage.
9. Add QA/E2E for application -> draft -> schedule -> calendar -> reminder flow.

### Immediate Engineering Checklist

- [ ] Audit all user-facing `Applyorbit` strings and rename to `Lamarin`.
- [ ] Add `reviewedAt` or `reviewConfirmedAt` to `follow_up_emails` before scheduled send.
- [ ] Add `attemptCount`, `lastAttemptAt`, `lastError`, and `lockedAt` to scheduled email processing.
- [ ] Create universal `reminders` and `reminder_deliveries` tables.
- [ ] Move Telegram reminder cron to universal reminder engine.
- [ ] Add Discord webhook connection and test notification.
- [ ] Select billing provider and add subscription schema.
- [ ] Add feature gates for AI draft, scheduled email, calendar, messaging reminders, and file uploads.
- [ ] Add usage tracking for AI, email, scheduled sends, reminders, and storage.
- [ ] Add E2E smoke test for the marketing-critical flow.
