import { db } from "@/db";
import { followUpEmails, followUpSchedules, jobApplications } from "@/db/schema";
import { aiModel, FOLLOW_UP_SYSTEM_PROMPT } from "@/lib/ai";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { streamText } from "ai";
import { and, eq, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Get all active schedules that are due
  const dueSchedules = await db
    .select({
      schedule: followUpSchedules,
      application: jobApplications,
    })
    .from(followUpSchedules)
    .innerJoin(
      jobApplications,
      eq(followUpSchedules.applicationId, jobApplications.id)
    )
    .where(
      and(
        eq(followUpSchedules.isActive, true),
        lte(followUpSchedules.scheduledDate, now)
      )
    );

  let sentCount = 0;
  let failedCount = 0;

  for (const { schedule, application } of dueSchedules) {
    try {
      if (!application.hrContact) {
        logger.warn("No HR contact for scheduled follow-up", {
          scheduleId: schedule.id,
          applicationId: application.id,
        });
        continue;
      }

      // Generate email with AI
      const prompt = `Generate a professional follow-up email for a job application:
- Company: ${application.companyName}
- Position: ${application.position}
- Current Status: ${application.status}
- HR Contact: ${application.hrContact}

Write the email subject on the first line prefixed with "Subject: ", then leave a blank line, then write the email body.`;

      const { text } = await streamText({
        model: aiModel,
        system: FOLLOW_UP_SYSTEM_PROMPT,
        prompt,
      });

      const fullText = await text;
      const lines = fullText.split("\n");
      const subject = lines[0]?.replace("Subject: ", "") || "Follow-up on Application";
      const body = lines.slice(2).join("\n");

      // Send email
      await sendEmail({
        to: application.hrContact,
        subject,
        body,
      });

      // Log the sent email
      await db.insert(followUpEmails).values({
        applicationId: application.id,
        userId: schedule.userId,
        subject,
        body,
        recipientEmail: application.hrContact,
        status: "sent",
        mode: "automatic",
        sentAt: new Date(),
      });

      // Deactivate the schedule
      await db
        .update(followUpSchedules)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(followUpSchedules.id, schedule.id));

      sentCount++;
      logger.info("Auto follow-up email sent", {
        scheduleId: schedule.id,
        applicationId: application.id,
        to: application.hrContact,
      });
    } catch (error) {
      failedCount++;
      logger.error("Failed to send auto follow-up", {
        scheduleId: schedule.id,
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
