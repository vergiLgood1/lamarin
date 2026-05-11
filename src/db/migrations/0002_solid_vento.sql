CREATE TYPE "public"."job_type" AS ENUM('fulltime', 'parttime', 'internship', 'freelance', 'contract', 'temporary', 'other');
--> statement-breakpoint
ALTER TABLE "job_applications" ADD COLUMN "job_type" "job_type" DEFAULT 'other' NOT NULL;
