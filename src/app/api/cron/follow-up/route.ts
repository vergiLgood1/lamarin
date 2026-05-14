import { db } from "@/db";
import { followUpEmails, followUpSchedules, jobApplications } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { and, eq, isNotNull, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Get all active schedules that are due and have an associated email
  const dueSchedules = await db
    .select({
      schedule: followUpSchedules,
      application: jobApplications,
      email: followUpEmails,
    })
    .from(followUpSchedules)
    .innerJoin(
      jobApplications,
      eq(followUpSchedules.applicationId, jobApplications.id)
    )
    .leftJoin(
      followUpEmails,
      eq(followUpSchedules.emailId, followUpEmails.id)
    )
    .where(
      and(
        eq(followUpSchedules.isActive, true),
        lte(followUpSchedules.scheduledDate, now),
        isNotNull(followUpSchedules.emailId)
      )
    );

  let sentCount = 0;
  let failedCount = 0;

  for (const { schedule, application, email } of dueSchedules) {
    try {
      if (!email) {
        logger.warn("No email found for scheduled follow-up", {
          scheduleId: schedule.id,
          applicationId: application.id,
        });
        failedCount++;
        continue;
      }

      // Send the pre-composed email
      await sendEmail({
        to: email.recipientEmail,
        subject: email.subject,
        body: email.body,
      });

      // Update email status to sent
      await db
        .update(followUpEmails)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(followUpEmails.id, email.id));

      // Deactivate the schedule
      await db
        .update(followUpSchedules)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(followUpSchedules.id, schedule.id));

      sentCount++;
      logger.info("Scheduled follow-up email sent", {
        scheduleId: schedule.id,
        emailId: email.id,
        applicationId: application.id,
        to: email.recipientEmail,
      });
    } catch (error) {
      failedCount++;
      
      // Update email status to failed if it exists
      if (email) {
        await db
          .update(followUpEmails)
          .set({ status: "failed" })
          .where(eq(followUpEmails.id, email.id));
      }

      logger.error("Failed to send scheduled follow-up", {
        scheduleId: schedule.id,
        emailId: email?.id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    success: true,
    processed: dueSchedules.length,
    sent: sentCount,
    failed: failedCount,
  });
}
