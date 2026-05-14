"use server";

import { db } from "@/db";
import { applicationDocuments, jobApplications } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { logger } from "@/lib/logger";
import { applicationSchema, documentFileSchema } from "@/lib/validations";
import type { ActionState, JobApplication } from "@/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface DocumentFile {
  name: string;
  url: string;
  key: string;
  size: number;
  type: string;
}

function parseDocuments(documentsJson: string | undefined): DocumentFile[] {
  if (!documentsJson || documentsJson === "[]") return [];
  try {
    const parsed = JSON.parse(documentsJson);
    const result = z.array(documentFileSchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

async function saveDocuments(
  applicationId: string,
  userId: string,
  documents: DocumentFile[]
) {
  if (documents.length === 0) return;

  await db.insert(applicationDocuments).values(
    documents.map((doc) => ({
      applicationId,
      userId,
      fileName: doc.name,
      fileUrl: doc.url,
      fileKey: doc.key,
      fileSize: String(doc.size),
      fileType: doc.type,
      documentType: getDocumentType(doc.name),
    }))
  );
}

function getDocumentType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes("cv") || lower.includes("resume")) return "CV/Resume";
  if (lower.includes("cover")) return "Cover Letter";
  if (lower.includes("portfolio")) return "Portfolio";
  if (lower.includes("ijazah")) return "Ijazah";
  if (lower.includes("transkrip")) return "Transkrip Nilai";
  if (lower.includes("sertifikat") || lower.includes("certificate"))
    return "Sertifikat";
  return "Dokumen Lainnya";
}

export async function createApplication(
  prevState: ActionState<JobApplication>,
  formData: FormData
): Promise<ActionState<JobApplication>> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData);
  const result = applicationSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const [application] = await db
      .insert(jobApplications)
      .values({
        userId: session.user.id,
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

    // Save uploaded documents
    const documents = parseDocuments(result.data.documents);
    await saveDocuments(application.id, session.user.id, documents);

    logger.info("Application created", {
      userId: session.user.id,
      applicationId: application.id,
      company: result.data.companyName,
      documentsCount: documents.length,
    });

    revalidatePath("/dashboard/applications");
    return {
      success: true,
      message: "Lamaran berhasil ditambahkan",
      data: application,
    };
  } catch (error) {
    logger.error("Failed to create application", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal menyimpan lamaran" };
  }
}

export async function updateApplication(
  id: string,
  prevState: ActionState<JobApplication>,
  formData: FormData
): Promise<ActionState<JobApplication>> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData);
  const result = applicationSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const [application] = await db
      .update(jobApplications)
      .set({
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
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(jobApplications.id, id),
          eq(jobApplications.userId, session.user.id)
        )
      )
      .returning();

    if (!application) {
      return { success: false, message: "Lamaran tidak ditemukan" };
    }

    // Replace documents: delete old, insert new
    const documents = parseDocuments(result.data.documents);
    await db
      .delete(applicationDocuments)
      .where(eq(applicationDocuments.applicationId, id));
    await saveDocuments(application.id, session.user.id, documents);

    logger.info("Application updated", {
      userId: session.user.id,
      applicationId: id,
      documentsCount: documents.length,
    });

    revalidatePath("/dashboard/applications");
    revalidatePath(`/applications/${id}`);
    return {
      success: true,
      message: "Lamaran berhasil diperbarui",
      data: application,
    };
  } catch (error) {
    logger.error("Failed to update application", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal memperbarui lamaran" };
  }
}

export async function deleteApplication(id: string): Promise<ActionState> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const [deleted] = await db
      .delete(jobApplications)
      .where(
        and(
          eq(jobApplications.id, id),
          eq(jobApplications.userId, session.user.id)
        )
      )
      .returning();

    if (!deleted) {
      return { success: false, message: "Lamaran tidak ditemukan" };
    }

    logger.info("Application deleted", {
      userId: session.user.id,
      applicationId: id,
    });

    revalidatePath("/dashboard/applications");
    return { success: true, message: "Lamaran berhasil dihapus" };
  } catch (error) {
    logger.error("Failed to delete application", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal menghapus lamaran" };
  }
}

export async function updateApplicationStatus(
  id: string,
  status:
    | "applied"
    | "reviewed"
    | "interview"
    | "test"
    | "offered"
    | "accepted"
    | "rejected"
    | "withdrawn"
): Promise<ActionState<JobApplication>> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const [application] = await db
      .update(jobApplications)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(jobApplications.id, id),
          eq(jobApplications.userId, session.user.id)
        )
      )
      .returning();

    if (!application) {
      return { success: false, message: "Lamaran tidak ditemukan" };
    }

    logger.info("Application status updated", {
      userId: session.user.id,
      applicationId: id,
      newStatus: status,
    });

    revalidatePath("/dashboard/applications");
    revalidatePath(`/applications/${id}`);
    return {
      success: true,
      message: "Status berhasil diperbarui",
      data: application,
    };
  } catch (error) {
    logger.error("Failed to update application status", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal memperbarui status" };
  }
}
