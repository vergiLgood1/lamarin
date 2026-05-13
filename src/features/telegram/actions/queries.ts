"use server";

import { db } from "@/db";
import { telegramConnections } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getTelegramConnection() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const [connection] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.userId, session.user.id));

  return connection || null;
}
