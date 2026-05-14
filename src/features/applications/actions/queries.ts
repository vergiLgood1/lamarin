"use server";

import { getSession } from "@/lib/auth-server";
import { db } from "@/db";
import { jobApplications, applicationDocuments } from "@/db/schema";
import { eq, and, ilike, gte, lte, desc, asc, count, sql } from "drizzle-orm";
import type { ApplicationFilters } from "@/types";

export async function getApplications(filters: ApplicationFilters = {}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const {
    search,
    status,
    startDate,
    endDate,
    companyLocation,
    workMode,
    jobSource,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = filters;

  const conditions = [eq(jobApplications.userId, session.user.id)];

  if (search) {
    conditions.push(
      sql`(${ilike(jobApplications.companyName, `%${search}%`)} OR ${ilike(jobApplications.position, `%${search}%`)})`
    );
  }

  if (status) {
    conditions.push(eq(jobApplications.status, status));
  }

  if (startDate) {
    conditions.push(gte(jobApplications.applicationDate, startDate));
  }

  if (endDate) {
    conditions.push(lte(jobApplications.applicationDate, endDate));
  }

  if (companyLocation) {
    conditions.push(ilike(jobApplications.companyLocation, `%${companyLocation}%`));
  }

  if (workMode) {
    conditions.push(eq(jobApplications.workMode, workMode));
  }

  if (jobSource) {
    conditions.push(ilike(jobApplications.jobSource, `%${jobSource}%`));
  }

  const orderByColumn = {
    applicationDate: jobApplications.applicationDate,
    companyName: jobApplications.companyName,
    status: jobApplications.status,
    createdAt: jobApplications.createdAt,
  }[sortBy];

  const orderFn = sortOrder === "asc" ? asc : desc;

  const offset = (page - 1) * limit;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(jobApplications)
      .where(and(...conditions))
      .orderBy(orderFn(orderByColumn))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(jobApplications)
      .where(and(...conditions)),
  ]);

  const total = totalResult[0]?.count || 0;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getApplicationById(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [application] = await db
    .select()
    .from(jobApplications)
    .where(
      and(eq(jobApplications.id, id), eq(jobApplications.userId, session.user.id))
    );

  if (!application) {
    return null;
  }

  return application;
}

export async function getApplicationsCount() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [result] = await db
    .select({ count: count() })
    .from(jobApplications)
    .where(eq(jobApplications.userId, session.user.id));

  return result?.count || 0;
}

export async function getApplicationDocuments(applicationId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const documents = await db
    .select()
    .from(applicationDocuments)
    .where(
      and(
        eq(applicationDocuments.applicationId, applicationId),
        eq(applicationDocuments.userId, session.user.id)
      )
    );

  return documents;
}
