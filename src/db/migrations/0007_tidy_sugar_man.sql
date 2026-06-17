CREATE TYPE "public"."calendar_event_type" AS ENUM('follow_up', 'interview', 'deadline');--> statement-breakpoint
CREATE TYPE "public"."calendar_provider" AS ENUM('google');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('fulltime', 'parttime', 'internship', 'freelance', 'contract', 'temporary', 'other');--> statement-breakpoint
CREATE TYPE "public"."work_mode" AS ENUM('onsite', 'hybrid', 'remote');--> statement-breakpoint
CREATE TABLE "calendar_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"provider" "calendar_provider" DEFAULT 'google' NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"calendar_id" varchar(255) DEFAULT 'primary' NOT NULL,
	"timezone" varchar(100) DEFAULT 'Asia/Jakarta' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"application_id" uuid NOT NULL,
	"provider" "calendar_provider" DEFAULT 'google' NOT NULL,
	"event_type" "calendar_event_type" DEFAULT 'follow_up' NOT NULL,
	"external_event_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"external_updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"chat_id" varchar(255) NOT NULL,
	"username" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_reminder_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"reminder_type" varchar(20) NOT NULL,
	"reminder_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_applications" RENAME COLUMN "location" TO "company_location";--> statement-breakpoint
ALTER TABLE "follow_up_emails" ADD COLUMN "template_key" varchar(100) DEFAULT 'follow_up' NOT NULL;--> statement-breakpoint
ALTER TABLE "follow_up_schedules" ADD COLUMN "email_id" uuid;--> statement-breakpoint
ALTER TABLE "job_applications" ADD COLUMN "work_mode" "work_mode" DEFAULT 'onsite' NOT NULL;--> statement-breakpoint
ALTER TABLE "job_applications" ADD COLUMN "job_type" "job_type" DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "calendar_connections" ADD CONSTRAINT "calendar_connections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_connections" ADD CONSTRAINT "telegram_connections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_reminder_logs" ADD CONSTRAINT "telegram_reminder_logs_schedule_id_follow_up_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."follow_up_schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_reminder_logs" ADD CONSTRAINT "telegram_reminder_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_up_schedules" ADD CONSTRAINT "follow_up_schedules_email_id_follow_up_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."follow_up_emails"("id") ON DELETE set null ON UPDATE no action;