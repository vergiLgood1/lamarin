import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

// ============================================
// Better-Auth Tables
// ============================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// Application Enums
// ============================================

export const applicationStatusEnum = pgEnum("application_status", [
  "applied",
  "reviewed",
  "interview",
  "test",
  "offered",
  "accepted",
  "rejected",
  "withdrawn",
]);

export const emailStatusEnum = pgEnum("email_status", [
  "draft",
  "scheduled",
  "sent",
  "failed",
]);

export const emailModeEnum = pgEnum("email_mode", ["manual", "automatic"]);

export const jobTypeEnum = pgEnum("job_type", [
  "fulltime",
  "parttime",
  "internship",
  "freelance",
  "contract",
  "temporary",
  "other",
]);

export const workModeEnum = pgEnum("work_mode", [
  "onsite",
  "hybrid",
  "remote",
]);

export const calendarProviderEnum = pgEnum("calendar_provider", ["google"]);

export const calendarEventTypeEnum = pgEnum("calendar_event_type", [
  "follow_up",
  "interview",
  "deadline",
]);

// ============================================
// Application Tables
// ============================================

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  applicationDate: date("application_date").notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyLocation: varchar("company_location", { length: 255 }),
  workMode: workModeEnum("work_mode").notNull().default("onsite"),
  position: varchar("position", { length: 255 }).notNull(),
  jobSource: varchar("job_source", { length: 255 }),
  jobType: jobTypeEnum("job_type").notNull().default("other"),
  followUpDate: date("follow_up_date"),
  status: applicationStatusEnum("status").notNull().default("applied"),
  hrContact: varchar("hr_contact", { length: 255 }),
  salary: varchar("salary", { length: 255 }),
  notes: text("notes"),
  meetingLink: varchar("meeting_link", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const applicationDocuments = pgTable("application_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileKey: text("file_key").notNull(),
  fileSize: text("file_size").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  documentType: varchar("document_type", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const followUpEmails = pgTable("follow_up_emails", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 500 }).notNull(),
  body: text("body").notNull(),
  recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
  templateKey: varchar("template_key", { length: 100 })
    .notNull()
    .default("follow_up"),
  sentAt: timestamp("sent_at"),
  status: emailStatusEnum("status").notNull().default("draft"),
  mode: emailModeEnum("mode").notNull().default("manual"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const followUpSchedules = pgTable("follow_up_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  emailId: uuid("email_id").references(() => followUpEmails.id, {
    onDelete: "set null",
  }),
  scheduledDate: timestamp("scheduled_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const calendarConnections = pgTable("calendar_connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  provider: calendarProviderEnum("provider").notNull().default("google"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  calendarId: varchar("calendar_id", { length: 255 }).notNull().default("primary"),
  timezone: varchar("timezone", { length: 100 }).notNull().default("Asia/Jakarta"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  provider: calendarProviderEnum("provider").notNull().default("google"),
  eventType: calendarEventTypeEnum("event_type").notNull().default("follow_up"),
  externalEventId: text("external_event_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  externalUpdatedAt: timestamp("external_updated_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const telegramConnections = pgTable("telegram_connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  chatId: varchar("chat_id", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const telegramReminderLogs = pgTable("telegram_reminder_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  scheduleId: uuid("schedule_id")
    .notNull()
    .references(() => followUpSchedules.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  reminderType: varchar("reminder_type", { length: 20 }).notNull(),
  reminderDate: date("reminder_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
