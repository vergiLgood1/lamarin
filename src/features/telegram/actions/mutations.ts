"use server";

import { db } from "@/db";
import { telegramConnections } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { logger } from "@/lib/logger";
import { sendTelegramMessage, validateTelegramChatId } from "@/lib/telegram";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function connectTelegram(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const chatId = String(formData.get("chatId") || "").trim();
  const username = String(formData.get("username") || "").trim();
  if (!chatId) return { success: false, message: "Chat ID wajib diisi" };

  const isValidChat = await validateTelegramChatId(chatId).catch(() => false);
  if (!isValidChat) {
    return {
      success: false,
      message: "Chat ID tidak valid. Pastikan sudah start chat dengan bot.",
    };
  }

  const [existing] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.userId, session.user.id));

  if (existing) {
    await db
      .update(telegramConnections)
      .set({ chatId, username: username || null, isActive: true, updatedAt: new Date() })
      .where(eq(telegramConnections.id, existing.id));
  } else {
    await db
      .insert(telegramConnections)
      .values({ userId: session.user.id, chatId, username: username || null, isActive: true });
  }

  await sendTelegramMessage(
    chatId,
    "lamarin: Telegram berhasil terhubung.",
  ).catch((error) => {
    logger.error("Failed to send Telegram connect message", {
      userId: session.user.id,
      chatId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  });
  revalidatePath("/dashboard/settings");
  return { success: true, message: "Telegram terhubung" };
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

export async function testTelegramConnection() {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const [connection] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.userId, session.user.id));

  if (!connection || !connection.isActive) {
    return { success: false, message: "Telegram belum terhubung" };
  }

  try {
    await sendTelegramMessage(
      connection.chatId,
      "lamarin: test notifikasi berhasil.",
    );
    return { success: true, message: "Test notifikasi terkirim" };
  } catch (error) {
    logger.error("Failed to send Telegram test message", {
      userId: session.user.id,
      chatId: connection.chatId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal mengirim test notifikasi" };
  }
}
