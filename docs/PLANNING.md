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
