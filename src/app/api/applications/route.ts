import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { authenticateRequest } from "@/lib/external-auth";
import { logger } from "@/lib/logger";
import { applicationSchema } from "@/lib/validations";
import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/applications — list user's applications
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 100);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const offset = (page - 1) * limit;

  const conditions = [eq(jobApplications.userId, auth.userId)];

  if (search) {
    conditions.push(
      sql`(${ilike(jobApplications.companyName, `%${search}%`)} OR ${ilike(jobApplications.position, `%${search}%`)})`
    );
  }

  if (status) {
    conditions.push(eq(jobApplications.status, status));
  }

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(jobApplications)
      .where(and(...conditions))
      .orderBy(desc(jobApplications.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(jobApplications)
      .where(and(...conditions)),
  ]);

  const total = totalResult[0]?.count || 0;

  logger.info("External API: list applications", {
    userId: auth.userId,
    filters: { search, status, page, limit },
  });

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/applications — create a new application
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = applicationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const [application] = await db
      .insert(jobApplications)
      .values({
        userId: auth.userId,
        applicationDate: result.data.applicationDate,
        companyName: result.data.companyName,
        companyLocation: result.data.companyLocation || null,
        workMode: result.data.workMode,
        position: result.data.position,
        jobSource: result.data.jobSource || null,
        jobType: result.data.jobType,
        followUpDate: result.data.followUpDate || null,
        status: result.data.status,
        hrContact: result.data.hrContact || null,
        salary: result.data.salary || null,
        notes: result.data.notes || null,
        meetingLink: result.data.meetingLink || null,
      })
      .returning();

    logger.info("External API: create application", {
      userId: auth.userId,
      applicationId: application.id,
      company: application.companyName,
    });

    return NextResponse.json({ data: application }, { status: 201 });
  } catch (error) {
    logger.error("External API: failed to create application", {
      userId: auth.userId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}
