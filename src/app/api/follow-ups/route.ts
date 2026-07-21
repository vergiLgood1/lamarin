import { db } from "@/db";
import {
  followUpEmails,
  followUpSchedules,
  jobApplications,
} from "@/db/schema";
import { authenticateRequest } from "@/lib/external-auth";
import { and, count, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/follow-ups — list follow-up schedules for the user
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "active" | "completed"
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 100);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const offset = (page - 1) * limit;

  const conditions = [eq(followUpSchedules.userId, auth.userId)];

  if (status === "active") {
    conditions.push(eq(followUpSchedules.isActive, true));
  } else if (status === "completed") {
    conditions.push(eq(followUpSchedules.isActive, false));
  }

  const [data, totalResult] = await Promise.all([
    db
      .select({
        schedule: followUpSchedules,
        application: {
          id: jobApplications.id,
          companyName: jobApplications.companyName,
          position: jobApplications.position,
          status: jobApplications.status,
        },
        email: {
          id: followUpEmails.id,
          subject: followUpEmails.subject,
          recipientEmail: followUpEmails.recipientEmail,
          status: followUpEmails.status,
        },
      })
      .from(followUpSchedules)
      .innerJoin(
        jobApplications,
        eq(followUpSchedules.applicationId, jobApplications.id),
      )
      .leftJoin(
        followUpEmails,
        eq(followUpSchedules.emailId, followUpEmails.id),
      )
      .where(and(...conditions))
      .orderBy(desc(followUpSchedules.scheduledDate))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(followUpSchedules)
      .where(and(...conditions)),
  ]);

  const total = totalResult[0]?.count || 0;

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
