import { upsertCalendarConnection } from "@/lib/calendar/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard/settings", req.url));
  }

  await upsertCalendarConnection({ userId: state, code });
  return NextResponse.redirect(new URL("/dashboard/settings", req.url));
}
