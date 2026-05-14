"use server";

import { db } from "@/db";
import { calendarConnections } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function disconnectGoogleCalendar() {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  await db
    .update(calendarConnections)
    .set({ isActive: false, updatedAt: new Date() })
    .where(
      and(
        eq(calendarConnections.userId, session.user.id),
        eq(calendarConnections.provider, "google")
      )
    );

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Google Calendar disconnected" };
}

export async function updateCalendarPreferences(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const calendarId = String(formData.get("calendarId") || "primary");
  const timezone = String(formData.get("timezone") || "Asia/Jakarta");

  await db
    .update(calendarConnections)
    .set({ calendarId, timezone, updatedAt: new Date() })
    .where(
      and(
        eq(calendarConnections.userId, session.user.id),
        eq(calendarConnections.provider, "google")
      )
    );

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Preferensi calendar tersimpan" };
}
