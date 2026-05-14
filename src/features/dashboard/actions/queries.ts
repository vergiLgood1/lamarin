"use server";

import { getSession } from "@/lib/auth-server";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { eq, and, gte, lte, count, sql, desc } from "drizzle-orm";

export async function getDashboardStats() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const userId = session.user.id;

  const today = now.toISOString().split("T")[0];
  const [
    totalResultRows,
    thisMonthResultRows,
    lastMonthResultRows,
    statusBreakdown,
    topSources,
    upcomingFollowUps,
  ] = await Promise.all([
    db.select({ count: count() }).from(jobApplications).where(eq(jobApplications.userId, userId)),
    db
      .select({ count: count() })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, userId),
          gte(jobApplications.applicationDate, startOfThisMonth.toISOString().split("T")[0])
        )
      ),
    db
      .select({ count: count() })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, userId),
          gte(jobApplications.applicationDate, startOfLastMonth.toISOString().split("T")[0]),
          lte(jobApplications.applicationDate, endOfLastMonth.toISOString().split("T")[0])
        )
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
      .limit(5),
    db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, userId),
          gte(jobApplications.followUpDate, today)
        )
      )
      .orderBy(jobApplications.followUpDate)
      .limit(5),
  ]);

  const [totalResult] = totalResultRows;
  const [thisMonthResult] = thisMonthResultRows;
  const [lastMonthResult] = lastMonthResultRows;

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
  const session = await getSession();
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

type JobTypeKey =
  | "fulltime"
  | "parttime"
  | "internship"
  | "freelance"
  | "contract"
  | "temporary"
  | "other";

type JobTypeActivityRow = {
  month: string;
  jobType: JobTypeKey;
  count: number;
};

export async function getJobTypeActivity() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const rawRows = await db
    .select({
      month: sql<string>`TO_CHAR(${jobApplications.applicationDate}::date, 'YYYY-MM')`,
      jobType: jobApplications.jobType,
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
    .groupBy(
      sql`TO_CHAR(${jobApplications.applicationDate}::date, 'YYYY-MM')`,
      jobApplications.jobType
    )
    .orderBy(sql`TO_CHAR(${jobApplications.applicationDate}::date, 'YYYY-MM')`);

  const rows = rawRows as JobTypeActivityRow[];

  const byMonth = new Map<string, Record<JobTypeKey, number>>();

  for (const row of rows) {
    const current =
      byMonth.get(row.month) ??
      {
        fulltime: 0,
        parttime: 0,
        internship: 0,
        freelance: 0,
        contract: 0,
        temporary: 0,
        other: 0,
      };

    current[row.jobType] = row.count;
    byMonth.set(row.month, current);
  }

  return Array.from(byMonth.entries()).map(([month, counts]) => ({
    month,
    ...counts,
  }));
}

export async function getTopAppliedPositions() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const rows = await db
    .select({
      position: jobApplications.position,
      count: count(),
    })
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.userId, session.user.id),
        eq(jobApplications.status, "applied")
      )
    )
    .groupBy(jobApplications.position)
    .orderBy(desc(count()))
    .limit(3);

  return rows.map((row) => ({
    position: row.position,
    count: row.count,
  }));
}
