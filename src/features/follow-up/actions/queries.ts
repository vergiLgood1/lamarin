"use server";

import { getSession } from "@/lib/auth-server";
import { db } from "@/db";
import { followUpEmails, followUpSchedules, jobApplications } from "@/db/schema";
import { eq, and, desc, count, sql, gte } from "drizzle-orm";

export async function getFollowUpEmails(applicationId?: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const conditions = [eq(followUpEmails.userId, session.user.id)];

  if (applicationId) {
    conditions.push(eq(followUpEmails.applicationId, applicationId));
  }

  const emails = await db
    .select({
      id: followUpEmails.id,
      applicationId: followUpEmails.applicationId,
      subject: followUpEmails.subject,
      body: followUpEmails.body,
      recipientEmail: followUpEmails.recipientEmail,
      sentAt: followUpEmails.sentAt,
      status: followUpEmails.status,
      mode: followUpEmails.mode,
      createdAt: followUpEmails.createdAt,
      companyName: jobApplications.companyName,
      position: jobApplications.position,
    })
    .from(followUpEmails)
    .leftJoin(jobApplications, eq(followUpEmails.applicationId, jobApplications.id))
    .where(and(...conditions))
    .orderBy(desc(followUpEmails.createdAt));

  return emails;
}

export async function getFollowUpSchedules() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const schedules = await db
    .select({
      id: followUpSchedules.id,
      applicationId: followUpSchedules.applicationId,
      emailId: followUpSchedules.emailId,
      scheduledDate: followUpSchedules.scheduledDate,
      isActive: followUpSchedules.isActive,
      createdAt: followUpSchedules.createdAt,
      companyName: jobApplications.companyName,
      position: jobApplications.position,
      hrContact: jobApplications.hrContact,
    })
    .from(followUpSchedules)
    .leftJoin(
      jobApplications,
      eq(followUpSchedules.applicationId, jobApplications.id)
    )
    .where(eq(followUpSchedules.userId, session.user.id))
    .orderBy(desc(followUpSchedules.scheduledDate));

  return schedules;
}

export async function getFollowUpEmailById(emailId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [email] = await db
    .select()
    .from(followUpEmails)
    .where(
      and(eq(followUpEmails.id, emailId), eq(followUpEmails.userId, session.user.id))
    );

  return email || null;
}

export async function getFollowUpStats() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const [totalResult, draftResult, scheduledResult, sentResult, failedResult] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(followUpEmails)
        .where(eq(followUpEmails.userId, userId)),
      db
        .select({ count: count() })
        .from(followUpEmails)
        .where(
          and(
            eq(followUpEmails.userId, userId),
            eq(followUpEmails.status, "draft")
          )
        ),
      db
        .select({ count: count() })
        .from(followUpEmails)
        .where(
          and(
            eq(followUpEmails.userId, userId),
            eq(followUpEmails.status, "scheduled")
          )
        ),
      db
        .select({ count: count() })
        .from(followUpEmails)
        .where(
          and(
            eq(followUpEmails.userId, userId),
            eq(followUpEmails.status, "sent")
          )
        ),
      db
        .select({ count: count() })
        .from(followUpEmails)
        .where(
          and(
            eq(followUpEmails.userId, userId),
            eq(followUpEmails.status, "failed")
          )
        ),
    ]);

  return {
    total: totalResult[0]?.count || 0,
    draft: draftResult[0]?.count || 0,
    scheduled: scheduledResult[0]?.count || 0,
    sent: sentResult[0]?.count || 0,
    failed: failedResult[0]?.count || 0,
  };
}

type EmailStatusKey = "draft" | "scheduled" | "sent" | "failed";

type EmailTrendRow = {
  month: string;
  status: EmailStatusKey;
  count: number;
};

export async function getFollowUpTrend() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const rawRows = await db
    .select({
      month: sql<string>`TO_CHAR(${followUpEmails.createdAt}::date, 'YYYY-MM')`,
      status: followUpEmails.status,
      count: count(),
    })
    .from(followUpEmails)
    .where(
      and(
        eq(followUpEmails.userId, session.user.id),
        gte(followUpEmails.createdAt, sixMonthsAgo)
      )
    )
    .groupBy(
      sql`TO_CHAR(${followUpEmails.createdAt}::date, 'YYYY-MM')`,
      followUpEmails.status
    )
    .orderBy(sql`TO_CHAR(${followUpEmails.createdAt}::date, 'YYYY-MM')`);

  const rows = rawRows as EmailTrendRow[];

  const byMonth = new Map<string, Record<EmailStatusKey, number>>();

  for (const row of rows) {
    const current =
      byMonth.get(row.month) ?? {
        draft: 0,
        scheduled: 0,
        sent: 0,
        failed: 0,
      };

    current[row.status] = row.count;
    byMonth.set(row.month, current);
  }

  return Array.from(byMonth.entries()).map(([month, counts]) => ({
    month,
    ...counts,
  }));
}
