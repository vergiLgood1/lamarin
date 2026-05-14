import { db } from "@/db";
import {
  followUpSchedules,
  jobApplications,
  telegramConnections,
  telegramReminderLogs,
} from "@/db/schema";
import { logger } from "@/lib/logger";
import { sendTelegramMessage } from "@/lib/telegram";
import { and, eq, gte, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

async function runTelegramReminders(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const dueSchedules = await db
    .select({
      scheduleId: followUpSchedules.id,
      userId: followUpSchedules.userId,
      scheduledDate: followUpSchedules.scheduledDate,
      companyName: jobApplications.companyName,
      position: jobApplications.position,
      chatId: telegramConnections.chatId,
    })
    .from(followUpSchedules)
    .innerJoin(jobApplications, eq(followUpSchedules.applicationId, jobApplications.id))
    .innerJoin(telegramConnections, eq(followUpSchedules.userId, telegramConnections.userId))
    .where(
      and(
        eq(followUpSchedules.isActive, true),
        eq(telegramConnections.isActive, true),
        gte(followUpSchedules.scheduledDate, now),
        lte(followUpSchedules.scheduledDate, in24h)
      )
    );

  let sent = 0;
  for (const schedule of dueSchedules) {
    const reminderDate = new Date().toISOString().split("T")[0] || "";
    const diffHours =
      (new Date(schedule.scheduledDate).getTime() - now.getTime()) / (1000 * 60 * 60);
    const reminderType = diffHours <= 2 ? "h0" : "h1";

    const [existingLog] = await db
      .select()
      .from(telegramReminderLogs)
      .where(
        and(
          eq(telegramReminderLogs.scheduleId, schedule.scheduleId),
          eq(telegramReminderLogs.userId, schedule.userId),
          eq(telegramReminderLogs.reminderType, reminderType),
          eq(telegramReminderLogs.reminderDate, reminderDate)
        )
      );

    if (existingLog) continue;

    try {
      await sendTelegramMessage(
        schedule.chatId,
        `Reminder Applyorbit: follow-up ${schedule.companyName} - ${schedule.position} pada ${new Date(schedule.scheduledDate).toLocaleString("id-ID")}`
      );

      await db.insert(telegramReminderLogs).values({
        scheduleId: schedule.scheduleId,
        userId: schedule.userId,
        reminderType,
        reminderDate,
      });

      sent++;
    } catch (error) {
      logger.error("Failed to send Telegram reminder", {
        userId: schedule.userId,
        chatId: schedule.chatId,
        scheduleId: schedule.scheduleId,
        reminderType,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({ success: true, sent });
}

export async function POST(req: NextRequest) {
  return runTelegramReminders(req);
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
