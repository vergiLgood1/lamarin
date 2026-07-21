import { db } from "@/db";
import { user } from "@/db/schema";
import { authenticateRequest } from "@/lib/external-auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/me — get current user info from x-chat-id
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const [userRecord] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    .from(user)
    .where(eq(user.id, auth.userId));

  if (!userRecord) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ data: userRecord });
}
