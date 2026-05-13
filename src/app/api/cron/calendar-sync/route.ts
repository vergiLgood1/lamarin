import { db } from "@/db";
import { calendarConnections, calendarEvents, followUpSchedules } from "@/db/schema";
import { getGoogleCalendarEvent } from "@/lib/calendar/google";
import { logger } from "@/lib/logger";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeConnections = await db
    .select()
    .from(calendarConnections)
    .where(
      and(
        eq(calendarConnections.provider, "google"),
        eq(calendarConnections.isActive, true)
      )
    );

  let processed = 0;
  let synced = 0;

  for (const connection of activeConnections) {
    const events = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.userId, connection.userId));
    processed += events.length;

    for (const event of events) {
      const externalEvent = await getGoogleCalendarEvent({
        userId: connection.userId,
        externalEventId: event.externalEventId,
      }).catch(() => null);

      if (!externalEvent?.start?.dateTime) {
        continue;
      }

      const externalDate = new Date(externalEvent.start.dateTime);
      if (event.scheduledAt.getTime() !== externalDate.getTime()) {
        await db
          .update(calendarEvents)
          .set({
            scheduledAt: externalDate,
            externalUpdatedAt: externalEvent.updated
              ? new Date(externalEvent.updated)
              : null,
            updatedAt: new Date(),
          })
          .where(eq(calendarEvents.id, event.id));

        if (event.eventType === "follow_up") {
          await db
            .update(followUpSchedules)
            .set({ scheduledDate: externalDate, updatedAt: new Date() })
            .where(
              and(
                eq(followUpSchedules.userId, event.userId),
                eq(followUpSchedules.applicationId, event.applicationId),
                eq(followUpSchedules.isActive, true)
              )
            );
        }

        synced++;
      }
    }
  }

  logger.info("Calendar sync cron ran", {
    connectionCount: activeConnections.length,
    eventCount: processed,
    syncedCount: synced,
  });

  return NextResponse.json({
    success: true,
    connections: activeConnections.length,
    processed,
    synced,
  });
}
