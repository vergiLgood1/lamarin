"use server";

import { db } from "@/db";
import { telegramConnections } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { logger } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

function generateHermesToken(): string {
  return `hm_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

export async function connectTelegram(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const chatId = String(formData.get("chatId") || "").trim();
  const username = String(formData.get("username") || "").trim();
  if (!chatId) return { success: false, message: "Chat ID wajib diisi" };

  const hermesToken = generateHermesToken();

  const [existing] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.userId, session.user.id));

  if (existing) {
    await db
      .update(telegramConnections)
      .set({
        chatId,
        username: username || null,
        isActive: true,
        hermesToken: existing.hermesToken || hermesToken,
        updatedAt: new Date(),
      })
      .where(eq(telegramConnections.id, existing.id));
  } else {
    await db
      .insert(telegramConnections)
      .values({
        userId: session.user.id,
        chatId,
        username: username || null,
        isActive: true,
        hermesToken,
      });
  }

  logger.info("Telegram connected", {
    userId: session.user.id,
    chatId,
  });
  revalidatePath("/dashboard/settings");
  return { success: true, message: "Telegram terhubung", hermesToken: existing?.hermesToken || hermesToken };
}

export async function disconnectTelegram() {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  await db
    .update(telegramConnections)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(telegramConnections.userId, session.user.id));

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Telegram disconnected" };
}
