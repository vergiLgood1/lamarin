import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { authenticateRequest } from "@/lib/external-auth";
import { and, count, eq, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/stats — dashboard statistics for the user
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = now.toISOString().split("T")[0];

  const userId = auth.userId;

  const [totalResult, thisMonthResult, statusBreakdown, upcomingFollowUps] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(jobApplications)
        .where(eq(jobApplications.userId, userId)),
      db
        .select({ count: count() })
        .from(jobApplications)
        .where(
          and(
            eq(jobApplications.userId, userId),
            gte(
              jobApplications.applicationDate,
              startOfThisMonth.toISOString().split("T")[0],
            ),
          ),
        ),
      db
        .select({
          status: jobApplications.status,
          count: count(),
        })
        .from(jobApplications)
        .where(eq(jobApplications.userId, userId))
        .groupBy(jobApplications.status),
      db
        .select()
        .from(jobApplications)
        .where(
          and(
            eq(jobApplications.userId, userId),
            gte(jobApplications.followUpDate, today),
          ),
        )
        .orderBy(jobApplications.followUpDate)
        .limit(5),
    ]);

  const totalApplications = totalResult[0]?.count || 0;
  const thisMonth = thisMonthResult[0]?.count || 0;

  const statusCounts: Record<string, number> = {};
  for (const row of statusBreakdown) {
    statusCounts[row.status] = row.count;
  }

  return NextResponse.json({
    data: {
      totalApplications,
      thisMonth,
      statusBreakdown: statusCounts,
      upcomingFollowUps: upcomingFollowUps.map((app) => ({
        id: app.id,
        companyName: app.companyName,
        position: app.position,
        status: app.status,
        followUpDate: app.followUpDate,
      })),
    },
  });
}
