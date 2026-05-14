"use server";

import { db } from "@/db";
import { telegramConnections } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export async function getTelegramConnection() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const [connection] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.userId, session.user.id));

  return connection || null;
}
