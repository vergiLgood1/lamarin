"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { eq, and, gte, lte, count, sql, desc } from "drizzle-orm";

export async function getDashboardStats() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const userId = session.user.id;

  // Total applications
  const [totalResult] = await db
    .select({ count: count() })
    .from(jobApplications)
    .where(eq(jobApplications.userId, userId));

  // This month
  const [thisMonthResult] = await db
    .select({ count: count() })
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.userId, userId),
        gte(jobApplications.applicationDate, startOfThisMonth.toISOString().split("T")[0])
      )
    );

  // Last month
  const [lastMonthResult] = await db
    .select({ count: count() })
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.userId, userId),
        gte(jobApplications.applicationDate, startOfLastMonth.toISOString().split("T")[0]),
        lte(jobApplications.applicationDate, endOfLastMonth.toISOString().split("T")[0])
      )
    );

  // Status breakdown
  const statusBreakdown = await db
    .select({
      status: jobApplications.status,
      count: count(),
    })
    .from(jobApplications)
    .where(eq(jobApplications.userId, userId))
    .groupBy(jobApplications.status);

  // Top sources
  const topSources = await db
    .select({
      source: jobApplications.jobSource,
      count: count(),
    })
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.userId, userId),
        sql`${jobApplications.jobSource} IS NOT NULL AND ${jobApplications.jobSource} != ''`
      )
    )
    .groupBy(jobApplications.jobSource)
    .orderBy(desc(count()))
    .limit(5);

  // Upcoming follow-ups
  const today = now.toISOString().split("T")[0];
  const upcomingFollowUps = await db
    .select()
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.userId, userId),
        gte(jobApplications.followUpDate, today)
      )
    )
    .orderBy(jobApplications.followUpDate)
    .limit(5);

  return {
    totalApplications: totalResult?.count || 0,
    thisMonth: thisMonthResult?.count || 0,
    lastMonth: lastMonthResult?.count || 0,
    statusBreakdown: statusBreakdown.map((s) => ({
      status: s.status,
      count: s.count,
    })),
    topSources: topSources.map((s) => ({
      source: s.source || "Unknown",
      count: s.count,
    })),
    upcomingFollowUps,
  };
}

export async function getMonthlyTrend() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const trend = await db
    .select({
      month: sql<string>`TO_CHAR(${jobApplications.applicationDate}::date, 'YYYY-MM')`,
      count: count(),
    })
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.userId, session.user.id),
        gte(
          jobApplications.applicationDate,
          sixMonthsAgo.toISOString().split("T")[0]
        )
      )
    )
    .groupBy(sql`TO_CHAR(${jobApplications.applicationDate}::date, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${jobApplications.applicationDate}::date, 'YYYY-MM')`);

  return trend;
}
