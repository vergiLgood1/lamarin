import { db } from "@/db";
import { jobApplications, applicationDocuments } from "@/db/schema";
import { authenticateRequest } from "@/lib/external-auth";
import { logger } from "@/lib/logger";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/applications/[id] — get application detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;

  const [application] = await db
    .select()
    .from(jobApplications)
    .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, auth.userId)));

  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }

  // Also fetch documents
  const documents = await db
    .select()
    .from(applicationDocuments)
    .where(
      and(
        eq(applicationDocuments.applicationId, id),
        eq(applicationDocuments.userId, auth.userId),
      ),
    );

  logger.info("External API: get application", {
    userId: auth.userId,
    applicationId: id,
  });

  return NextResponse.json({ data: { ...application, documents } });
}

// PATCH /api/applications/[id] — update application
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Verify ownership
  const [existing] = await db
    .select()
    .from(jobApplications)
    .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, auth.userId)));

  if (!existing) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }

  // Allow partial updates — only update provided fields
  const allowedFields = [
    "companyName",
    "companyLocation",
    "position",
    "applicationDate",
    "status",
    "workMode",
    "jobType",
    "jobSource",
    "hrContact",
    "salary",
    "notes",
    "meetingLink",
    "followUpDate",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  }

  updates.updatedAt = new Date();

  try {
    const [application] = await db
      .update(jobApplications)
      .set(updates)
      .where(eq(jobApplications.id, id))
      .returning();

    logger.info("External API: update application", {
      userId: auth.userId,
      applicationId: id,
      updates: Object.keys(updates),
    });

    return NextResponse.json({ data: application });
  } catch (error) {
    logger.error("External API: failed to update application", {
      userId: auth.userId,
      applicationId: id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}

// DELETE /api/applications/[id] — delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;

  const [deleted] = await db
    .delete(jobApplications)
    .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, auth.userId)))
    .returning();

  if (!deleted) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );
  }

  logger.info("External API: delete application", {
    userId: auth.userId,
    applicationId: id,
  });

  return NextResponse.json({ success: true, data: deleted });
}
