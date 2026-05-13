CREATE TABLE "telegram_reminder_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "schedule_id" uuid NOT NULL,
  "user_id" text NOT NULL,
  "reminder_type" varchar(20) NOT NULL,
  "reminder_date" date NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "telegram_reminder_logs" ADD CONSTRAINT "telegram_reminder_logs_schedule_id_follow_up_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."follow_up_schedules"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "telegram_reminder_logs" ADD CONSTRAINT "telegram_reminder_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
