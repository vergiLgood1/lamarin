"use server";

import { db } from "@/db";
import { calendarConnections } from "@/db/schema";
import { auth } from "@/lib/auth";
import { listGoogleCalendars } from "@/lib/calendar/google";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getCalendarConnection() {
  const session = await auth.api.getSession({ headers: await headers() });
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return listGoogleCalendars(session.user.id);
}
