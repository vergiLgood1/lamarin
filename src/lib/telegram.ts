const botToken = process.env.TELEGRAM_BOT_TOKEN;

function getTelegramUrl(method: string) {
  return `https://api.telegram.org/bot${botToken}/${method}`;
}

export async function validateTelegramChatId(chatId: string) {
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const response = await fetch(getTelegramUrl("getChat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId }),
  });

  if (!response.ok) return false;
  const payload = (await response.json()) as { ok: boolean };
  return payload.ok;
}

export async function sendTelegramMessage(chatId: string, text: string) {
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const response = await fetch(getTelegramUrl("sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!response.ok) {
    throw new Error("Failed to send Telegram message");
  }

  return response.json();
}
