"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import type { ApplicationStatus } from "@/types";

export async function getExportData(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const conditions = [eq(jobApplications.userId, session.user.id)];

  if (filters?.status) {
    conditions.push(
      eq(jobApplications.status, filters.status as ApplicationStatus)
    );
  }

  if (filters?.startDate) {
    conditions.push(gte(jobApplications.applicationDate, filters.startDate));
  }

  if (filters?.endDate) {
    conditions.push(lte(jobApplications.applicationDate, filters.endDate));
  }

  const data = await db
    .select()
    .from(jobApplications)
    .where(and(...conditions))
    .orderBy(desc(jobApplications.applicationDate));

  return data;
}
