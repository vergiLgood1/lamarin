import { hashPassword } from "better-auth/crypto";
import { eq, type InferInsertModel } from "drizzle-orm";

import { db } from "./index";
import {
  account,
  applicationDocuments,
  calendarConnections,
  calendarEvents,
  followUpEmails,
  followUpSchedules,
  jobApplications,
  telegramConnections,
  telegramReminderLogs,
  user,
} from "./schema";

type NewJobApplication = InferInsertModel<typeof jobApplications>;
type NewFollowUpEmail = InferInsertModel<typeof followUpEmails>;
type NewApplicationDocument = InferInsertModel<typeof applicationDocuments>;
type NewCalendarEvent = InferInsertModel<typeof calendarEvents>;
type NewFollowUpSchedule = InferInsertModel<typeof followUpSchedules>;
type SeedJobApplication = NewJobApplication & { id: string };

const SEED_USER_ID = "seed-user-applyorbit";
const SEED_USER_EMAIL = "diyo.seed@example.com";
const SEED_USER_PASSWORD = "password123";
const APPLICATION_COUNT = 100;
const priorityFollowUpOffsets = [0, 1, 2, 3, 4, 5, 6, 7] as const;

const monthPlan = [
  { month: 11, year: 2025, total: 4, fulltime: 2, internship: 1, freelance: 1 },
  { month: 0, year: 2026, total: 6, fulltime: 3, internship: 1, freelance: 2 },
  { month: 1, year: 2026, total: 8, fulltime: 4, internship: 2, freelance: 2 },
  { month: 2, year: 2026, total: 7, fulltime: 2, internship: 3, freelance: 2 },
  { month: 3, year: 2026, total: 11, fulltime: 5, internship: 3, freelance: 3 },
  { month: 4, year: 2026, total: 14, fulltime: 7, internship: 4, freelance: 3 },
] as const;

const statusPlan = [
  "applied",
  "applied",
  "applied",
  "applied",
  "applied",
  "applied",
  "applied",
  "applied",
  "applied",
  "applied",
  "applied",
  "applied",
  "reviewed",
  "reviewed",
  "reviewed",
  "reviewed",
  "reviewed",
  "reviewed",
  "reviewed",
  "reviewed",
  "interview",
  "interview",
  "interview",
  "interview",
  "interview",
  "interview",
  "interview",
  "test",
  "test",
  "test",
  "test",
  "test",
  "offered",
  "offered",
  "offered",
  "accepted",
  "accepted",
  "rejected",
  "rejected",
  "rejected",
  "rejected",
  "rejected",
  "rejected",
  "rejected",
  "rejected",
  "rejected",
  "withdrawn",
  "withdrawn",
  "withdrawn",
  "withdrawn",
] as const;

const appliedPositions = [
  "Frontend Engineer",
  "Frontend Engineer",
  "Frontend Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Backend Engineer",
  "Backend Engineer",
  "Product Designer",
  "Product Designer",
  "Data Analyst",
  "Full Stack Developer",
  "QA Engineer",
] as const;

const fallbackPositions = [
  "Backend Engineer",
  "Full Stack Developer",
  "Product Designer",
  "Data Analyst",
  "QA Engineer",
  "DevOps Engineer",
  "Mobile Developer",
  "Product Manager",
  "Technical Writer",
  "Growth Engineer",
] as const;

const companyProfiles = [
  ["Orbit Labs", "Jakarta, Indonesia", "LinkedIn"],
  ["Nusa Creative", "Bandung, Indonesia", "Company Website"],
  ["CloudScale Asia", "Singapore", "Referral"],
  ["Karya Digital", "Yogyakarta, Indonesia", "Glints"],
  ["Bumi Tech", "Surabaya, Indonesia", "Kalibrr"],
  ["Sagara Systems", "Jakarta, Indonesia", "LinkedIn"],
  ["Lintas Data", "Kuala Lumpur, Malaysia", "Referral"],
  ["Merah Putih AI", "Bandung, Indonesia", "Company Website"],
  ["Aruna Commerce", "Jakarta, Indonesia", "Glints"],
  ["Tekno Nusantara", "Singapore", "LinkedIn"],
] as const;

function seedUuid(index: number): string {
  return `00000000-0000-4000-8000-${index.toString().padStart(12, "0")}`;
}

function dateString(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}

function relativeDateString(daysFromToday: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);

  return date.toISOString().slice(0, 10);
}

function followUpDateForIndex(index: number): string | null {
  if (index < priorityFollowUpOffsets.length) {
    return relativeDateString(priorityFollowUpOffsets[index]);
  }

  if (index % 5 === 0) {
    return null;
  }

  return relativeDateString(8 + (index % 7));
}

function buildJobTypes(): NewJobApplication["jobType"][] {
  return monthPlan.flatMap((plan) => [
    ...Array.from({ length: plan.fulltime }, () => "fulltime" as const),
    ...Array.from({ length: plan.internship }, () => "internship" as const),
    ...Array.from({ length: plan.freelance }, () => "freelance" as const),
    ...Array.from(
      { length: plan.total - plan.fulltime - plan.internship - plan.freelance },
      (_, index) =>
        (["contract", "parttime", "temporary", "other"] as const)[index % 4],
    ),
  ]);
}

function buildApplicationDates(): string[] {
  return monthPlan.flatMap((plan, planIndex) =>
    Array.from({ length: plan.total }, (_, index) =>
      dateString(plan.year, plan.month, 3 + index * 2 + (planIndex % 2)),
    ),
  );
}

function emailCreatedAt(index: number): Date {
  const plan = monthPlan[Math.min(Math.floor(index / 5), monthPlan.length - 1)];

  return new Date(
    Date.UTC(plan.year, plan.month, 6 + (index % 5) * 4, 2, 0, 0),
  );
}

function buildApplications(): SeedJobApplication[] {
  const applicationDates = buildApplicationDates();
  const jobTypeSequence = buildJobTypes();

  return Array.from({ length: APPLICATION_COUNT }, (_, index) => {
    const number = index + 1;
    const [companyName, companyLocation, jobSource] =
      companyProfiles[index % companyProfiles.length];
    const status = statusPlan[index % statusPlan.length];
    const position =
      status === "applied"
        ? appliedPositions[index % appliedPositions.length]
        : fallbackPositions[index % fallbackPositions.length];
    const followUpDate = followUpDateForIndex(index);

    return {
      id: seedUuid(number),
      userId: SEED_USER_ID,
      applicationDate: applicationDates[index % applicationDates.length],
      companyName,
      companyLocation,
      workMode: (["remote", "hybrid", "onsite", "remote"] as const)[index % 4],
      position,
      jobSource,
      jobType: jobTypeSequence[index % jobTypeSequence.length],
      followUpDate,
      status,
      hrContact: `talent${number}@${companyName.toLowerCase().replaceAll(" ", "")}.example`,
      salary: `IDR ${10 + (index % 10)}.000.000 - ${16 + (index % 12)}.000.000`,
      notes: `${status === "interview" ? "Interview loop active" : "Pipeline tracked"} for ${position} at ${companyName}.`,
      meetingLink:
        index % 3 === 0 ? `https://meet.google.com/seed-${number}` : null,
    };
  });
}

async function clearSeedData(): Promise<void> {
  await db.delete(user).where(eq(user.id, SEED_USER_ID));
}

async function seedUser(): Promise<void> {
  await db.insert(user).values({
    id: SEED_USER_ID,
    name: "Diyo Anggara",
    email: SEED_USER_EMAIL,
    emailVerified: true,
    image: "https://api.dicebear.com/9.x/initials/svg?seed=Diyo%20Anggara",
  });
}

async function seedAccount(): Promise<void> {
  await db.insert(account).values({
    id: "seed-account-applyorbit",
    accountId: SEED_USER_ID,
    providerId: "credential",
    userId: SEED_USER_ID,
    password: await hashPassword(SEED_USER_PASSWORD),
  });
}

async function seedApplications(
  applications: readonly SeedJobApplication[],
): Promise<void> {
  await db.insert(jobApplications).values([...applications]);
}

async function seedDocuments(
  applications: readonly SeedJobApplication[],
): Promise<void> {
  const documents = applications.slice(0, 20).map((application, index) => ({
      applicationId: application.id,
      userId: SEED_USER_ID,
      fileName: `diyo-anggara-${index % 2 === 0 ? "resume" : "portfolio"}-${index + 1}.pdf`,
      fileUrl: `https://example.com/seed/documents/${index + 1}.pdf`,
      fileKey: `seed/documents/${index + 1}.pdf`,
      fileSize: `${240 + index * 16} KB`,
      fileType: "application/pdf",
      documentType: index % 2 === 0 ? "resume" : "portfolio",
    })) satisfies NewApplicationDocument[];

  await db.insert(applicationDocuments).values(documents);
}

async function seedFollowUps(
  applications: readonly SeedJobApplication[],
): Promise<void> {
  const emails = applications.slice(0, 30).map((application, index) => ({
    id: seedUuid(101 + index),
    applicationId: application.id,
    userId: SEED_USER_ID,
    subject: `Follow up for ${application.position} application`,
    body: `Hello, I wanted to follow up on my ${application.position} application at ${application.companyName}.`,
    recipientEmail: application.hrContact ?? `talent${index + 1}@example.com`,
    sentAt: index % 4 === 0 ? emailCreatedAt(index) : null,
    status: (
      ["sent", "scheduled", "draft", "scheduled", "sent", "failed"] as const
    )[index % 6],
    mode: index % 2 === 0 ? "automatic" : "manual",
    createdAt: emailCreatedAt(index),
  })) satisfies NewFollowUpEmail[];

  await db.insert(followUpEmails).values(emails);
  const schedules = emails.slice(0, 15).map((email, index) => ({
      id: seedUuid(151 + index),
      applicationId: email.applicationId,
      userId: SEED_USER_ID,
      emailId: email.id,
      scheduledDate: new Date(
        `2026-06-${String(index + 5).padStart(2, "0")}T03:00:00.000Z`,
      ),
      isActive: index % 4 !== 0,
    })) satisfies NewFollowUpSchedule[];

  await db.insert(followUpSchedules).values(schedules);
}

async function seedIntegrations(
  applications: readonly SeedJobApplication[],
): Promise<void> {
  await db.insert(calendarConnections).values({
    userId: SEED_USER_ID,
    provider: "google",
    accessToken: "seed-google-access-token",
    refreshToken: "seed-google-refresh-token",
    tokenExpiresAt: new Date("2026-06-01T00:00:00.000Z"),
  });

  const events = applications.slice(0, 12).map((application, index) => ({
      userId: SEED_USER_ID,
      applicationId: application.id,
      provider: "google",
      eventType: index % 2 === 0 ? "interview" : "follow_up",
      externalEventId: `seed-google-event-${index + 1}`,
      title: `${index % 2 === 0 ? "Interview" : "Follow up"}: ${application.position} at ${application.companyName}`,
      scheduledAt: new Date(
        `2026-06-${String(index + 10).padStart(2, "0")}T04:00:00.000Z`,
      ),
      externalUpdatedAt: new Date("2026-05-18T07:00:00.000Z"),
    })) satisfies NewCalendarEvent[];

  await db.insert(calendarEvents).values(events);

  await db.insert(telegramConnections).values({
    userId: SEED_USER_ID,
    chatId: "1234567890",
    username: "diyo_seed",
  });

  await db.insert(telegramReminderLogs).values(
    Array.from({ length: 10 }, (_, index) => ({
      scheduleId: seedUuid(151 + index),
      userId: SEED_USER_ID,
      reminderType: index % 2 === 0 ? "one_day_before" : "same_day",
      reminderDate: dateString(2026, 5, 4 + index),
    })),
  );
}

async function main(): Promise<void> {
  const applications = buildApplications();

  await clearSeedData();
  await seedUser();
  await seedAccount();
  await seedApplications(applications);
  await seedDocuments(applications);
  await seedFollowUps(applications);
  await seedIntegrations(applications);
}

main()
  .then(() => {
    console.info(
      `Database seeded successfully with ${APPLICATION_COUNT} applications.`,
    );
    console.info(`Login with ${SEED_USER_EMAIL} / ${SEED_USER_PASSWORD}`);
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("Database seed failed.", error);
    process.exit(1);
  });
