-- Add emailId column to follow_up_schedules table
ALTER TABLE "follow_up_schedules" ADD COLUMN "email_id" uuid;

-- Add foreign key constraint
ALTER TABLE "follow_up_schedules" ADD CONSTRAINT "follow_up_schedules_email_id_follow_up_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "follow_up_emails"("id") ON DELETE set null ON UPDATE no action;
