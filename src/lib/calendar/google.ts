import { db } from "@/db";
import { calendarConnections } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { google } from "googleapis";

const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI,
  );
}

export function getGoogleAuthUrl(userId: string): string {
  const oauth2Client = getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state: userId,
  });
}

export async function upsertCalendarConnection(params: {
  userId: string;
  code: string;
}) {
  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(params.code);

  const [existing] = await db
    .select()
    .from(calendarConnections)
    .where(
      and(
        eq(calendarConnections.userId, params.userId),
        eq(calendarConnections.provider, "google")
      )
    );

  const payload = {
    accessToken: tokens.access_token || "",
    refreshToken: tokens.refresh_token || null,
    tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    isActive: true,
    updatedAt: new Date(),
  };

  if (existing) {
    await db
      .update(calendarConnections)
      .set(payload)
      .where(eq(calendarConnections.id, existing.id));
  } else {
    await db.insert(calendarConnections).values({
      userId: params.userId,
      provider: "google",
      calendarId: "primary",
      timezone: "Asia/Jakarta",
      ...payload,
    });
  }
}

export async function getGoogleCalendarClient(userId: string) {
  const [connection] = await db
    .select()
    .from(calendarConnections)
    .where(
      and(
        eq(calendarConnections.userId, userId),
        eq(calendarConnections.provider, "google"),
        eq(calendarConnections.isActive, true)
      )
    );

  if (!connection) return null;

  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    access_token: connection.accessToken,
    refresh_token: connection.refreshToken || undefined,
    expiry_date: connection.tokenExpiresAt?.getTime(),
  });

  return {
    calendar: google.calendar({ version: "v3", auth: oauth2Client }),
    connection,
  };
}

export async function upsertGoogleCalendarEvent(params: {
  userId: string;
  externalEventId?: string;
  title: string;
  description: string;
  start: Date;
  timezone: string;
}) {
  const client = await getGoogleCalendarClient(params.userId);
  if (!client) return null;

  const requestBody = {
    summary: params.title,
    description: params.description,
    start: { dateTime: params.start.toISOString(), timeZone: params.timezone },
    end: {
      dateTime: new Date(params.start.getTime() + 60 * 60 * 1000).toISOString(),
      timeZone: params.timezone,
    },
  };

  if (params.externalEventId) {
    const updated = await client.calendar.events.update({
      calendarId: client.connection.calendarId,
      eventId: params.externalEventId,
      requestBody,
    });
    return updated.data;
  }

  const created = await client.calendar.events.insert({
    calendarId: client.connection.calendarId,
    requestBody,
  });
  return created.data;
}

export async function deleteGoogleCalendarEvent(params: {
  userId: string;
  externalEventId: string;
}) {
  const client = await getGoogleCalendarClient(params.userId);
  if (!client) return;

  await client.calendar.events.delete({
    calendarId: client.connection.calendarId,
    eventId: params.externalEventId,
  });
}

export async function getGoogleCalendarEvent(params: {
  userId: string;
  externalEventId: string;
}) {
  const client = await getGoogleCalendarClient(params.userId);
  if (!client) return null;

  const result = await client.calendar.events.get({
    calendarId: client.connection.calendarId,
    eventId: params.externalEventId,
  });

  return result.data;
}

export async function listGoogleCalendars(userId: string) {
  const client = await getGoogleCalendarClient(userId);
  if (!client) return [];

  const result = await client.calendar.calendarList.list();
  return (result.data.items || []).map((item) => ({
    id: item.id || "primary",
    summary: item.summary || item.id || "Primary",
  }));
}
