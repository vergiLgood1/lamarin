import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { authenticateRequest } from "@/lib/external-auth";
import { logger } from "@/lib/logger";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = [
  "applied",
  "reviewed",
  "interview",
  "test",
  "offered",
  "accepted",
  "rejected",
  "withdrawn",
] as const;

// PATCH /api/applications/[id]/status — update application status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || !body.status) {
    return NextResponse.json(
      { error: "status field is required" },
      { status: 400 },
    );
  }

  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json(
      {
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const [application] = await db
    .update(jobApplications)
    .set({ status: body.status, updatedAt: new Date() })
    .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, auth.userId)))
    .returning();

  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }

  logger.info("External API: update application status", {
    userId: auth.userId,
    applicationId: id,
    newStatus: body.status,
  });

  return NextResponse.json({ data: application });
}
