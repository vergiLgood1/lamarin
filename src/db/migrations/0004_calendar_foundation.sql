CREATE TYPE "public"."calendar_provider" AS ENUM('google');
--> statement-breakpoint
CREATE TYPE "public"."calendar_event_type" AS ENUM('follow_up', 'interview', 'deadline');
--> statement-breakpoint
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
ALTER TABLE "calendar_connections" ADD CONSTRAINT "calendar_connections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
