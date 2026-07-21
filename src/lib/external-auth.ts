import { db } from "@/db";
import { telegramConnections } from "@/db/schema";
import { eq } from "drizzle-orm";

const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;

/**
 * Validates the external API key from the request header.
 * Returns 401 response JSON if invalid, or null if valid.
 */
export function validateApiKey(request: Request): Response | null {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== EXTERNAL_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

/**
 * Extracts chatId from the request header and resolves it to a Lamarin userId.
 * Returns the userId string, or a 401 Response if not found.
 */
export async function resolveUserFromChatId(
  request: Request,
): Promise<{ userId: string } | Response> {
  const chatId = request.headers.get("x-chat-id");
  if (!chatId) {
    return new Response(
      JSON.stringify({ error: "x-chat-id header is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const [connection] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.chatId, chatId));

  if (!connection || !connection.isActive) {
    return new Response(
      JSON.stringify({ error: "User not found or Telegram not connected" }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  return { userId: connection.userId };
}

/**
 * Shared auth guard for external API routes.
 * Returns a 401/400/404 Response on failure, or an object with userId on success.
 */
export async function authenticateRequest(
  request: Request,
): Promise<{ userId: string } | Response> {
  // 1. Validate API key
  const apiKeyError = validateApiKey(request);
  if (apiKeyError) return apiKeyError;

  // 2. Resolve user from chatId
  const result = await resolveUserFromChatId(request);
  if (result instanceof Response) return result;

  return result;
}
