import { auth } from "@/lib/auth";
import { getGoogleAuthUrl } from "@/lib/calendar/google";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.redirect(new URL("/login", process.env.BETTER_AUTH_URL));

  const url = getGoogleAuthUrl(session.user.id);
  return NextResponse.redirect(url);
}
