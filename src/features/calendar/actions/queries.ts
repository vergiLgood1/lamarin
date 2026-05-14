"use server";

import { db } from "@/db";
import { calendarConnections } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { listGoogleCalendars } from "@/lib/calendar/google";
import { and, eq } from "drizzle-orm";

export async function getCalendarConnection() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const [connection] = await db
    .select()
    .from(calendarConnections)
    .where(
      and(
        eq(calendarConnections.userId, session.user.id),
        eq(calendarConnections.provider, "google")
      )
    );

  return connection || null;
}

export async function getGoogleCalendarOptions() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  return listGoogleCalendars(session.user.id);
}
