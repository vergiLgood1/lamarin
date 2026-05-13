CREATE TYPE "public"."work_mode" AS ENUM('onsite', 'hybrid', 'remote');
--> statement-breakpoint
ALTER TABLE "job_applications" RENAME COLUMN "location" TO "company_location";
--> statement-breakpoint
ALTER TABLE "job_applications" ADD COLUMN "work_mode" "work_mode" DEFAULT 'onsite' NOT NULL;
