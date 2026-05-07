"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { followUpEmails, followUpSchedules, jobApplications } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getFollowUpEmails(applicationId?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const schedules = await db
    .select({
      id: followUpSchedules.id,
      applicationId: followUpSchedules.applicationId,
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
  const session = await auth.api.getSession({ headers: await headers() });
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
