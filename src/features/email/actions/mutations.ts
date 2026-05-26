"use server";

import { db } from "@/db";
import { calendarEvents, followUpEmails, followUpSchedules, jobApplications } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { upsertGoogleCalendarEvent } from "@/lib/calendar/google";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import type { ActionState, FollowUpEmail, FollowUpSchedule } from "@/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const emailTemplateKeySchema = z.enum([
  "follow_up",
  "thank_you",
  "interview_confirmation",
  "additional_documents",
  "offer_negotiation",
  "withdrawal",
  "custom",
]);

const applicationEmailSchema = z.object({
  applicationId: z.string().uuid("Application ID tidak valid"),
  recipientEmail: z.string().email("Email tidak valid"),
  subject: z.string().min(1, "Subject wajib diisi"),
  body: z.string().min(1, "Isi email wajib diisi"),
  templateKey: emailTemplateKeySchema.default("follow_up"),
});

const scheduleEmailSchema = applicationEmailSchema.extend({
  scheduledDate: z.string().min(1, "Tanggal jadwal wajib diisi"),
});

type ApplicationEmailInput = z.infer<typeof applicationEmailSchema>;

async function getOwnedApplication(applicationId: string, userId: string) {
  const [application] = await db
    .select()
    .from(jobApplications)
    .where(
      and(eq(jobApplications.id, applicationId), eq(jobApplications.userId, userId)),
    );

  return application ?? null;
}

function parseFormData(formData: FormData): unknown {
  return Object.fromEntries(formData);
}

async function insertEmailRecord(
  userId: string,
  data: ApplicationEmailInput,
  status: "draft" | "scheduled" | "sent" | "failed",
): Promise<FollowUpEmail> {
  const [email] = await db
    .insert(followUpEmails)
    .values({
      applicationId: data.applicationId,
      userId,
      recipientEmail: data.recipientEmail,
      subject: data.subject,
      body: data.body,
      templateKey: data.templateKey,
      status,
      mode: "manual",
      sentAt: status === "sent" ? new Date() : null,
    })
    .returning();

  return email;
}

export async function createEmailDraft(
  _prevState: ActionState<FollowUpEmail>,
  formData: FormData,
): Promise<ActionState<FollowUpEmail>> {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const result = applicationEmailSchema.safeParse(parseFormData(formData));
  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const application = await getOwnedApplication(
      result.data.applicationId,
      session.user.id,
    );
    if (!application) return { success: false, message: "Lamaran tidak ditemukan" };

    const email = await insertEmailRecord(session.user.id, result.data, "draft");
    revalidatePath("/dashboard/follow-ups");
    revalidatePath("/dashboard/send-email");
    return { success: true, message: "Draft email berhasil disimpan", data: email };
  } catch (error) {
    logger.error("Failed to create email draft", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal menyimpan draft" };
  }
}

export async function sendApplicationEmail(
  _prevState: ActionState<FollowUpEmail>,
  formData: FormData,
): Promise<ActionState<FollowUpEmail>> {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const result = applicationEmailSchema.safeParse(parseFormData(formData));
  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const application = await getOwnedApplication(
      result.data.applicationId,
      session.user.id,
    );
    if (!application) return { success: false, message: "Lamaran tidak ditemukan" };

    await sendEmail({
      to: result.data.recipientEmail,
      subject: result.data.subject,
      body: result.data.body,
    });

    const email = await insertEmailRecord(session.user.id, result.data, "sent");
    revalidatePath("/dashboard/follow-ups");
    revalidatePath("/dashboard/send-email");
    return { success: true, message: "Email berhasil dikirim", data: email };
  } catch (error) {
    logger.error("Failed to send application email", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal mengirim email" };
  }
}

export async function scheduleApplicationEmail(
  _prevState: ActionState<FollowUpSchedule>,
  formData: FormData,
): Promise<ActionState<FollowUpSchedule>> {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const result = scheduleEmailSchema.safeParse(parseFormData(formData));
  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const scheduledDate = new Date(result.data.scheduledDate);
  if (scheduledDate <= new Date()) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: { scheduledDate: ["Tanggal jadwal harus di masa depan"] },
    };
  }

  try {
    const application = await getOwnedApplication(
      result.data.applicationId,
      session.user.id,
    );
    if (!application) return { success: false, message: "Lamaran tidak ditemukan" };

    const email = await insertEmailRecord(session.user.id, result.data, "scheduled");
    const [schedule] = await db
      .insert(followUpSchedules)
      .values({
        applicationId: result.data.applicationId,
        userId: session.user.id,
        emailId: email.id,
        scheduledDate,
      })
      .returning();

    const event = await upsertGoogleCalendarEvent({
      userId: session.user.id,
      title: `Email: ${application.companyName} - ${application.position}`,
      description: `Template: ${result.data.templateKey}\nSubject: ${result.data.subject}`,
      start: scheduledDate,
      timezone: "Asia/Jakarta",
    });

    if (event?.id) {
      await db.insert(calendarEvents).values({
        userId: session.user.id,
        applicationId: application.id,
        provider: "google",
        eventType: "follow_up",
        externalEventId: event.id,
        title: event.summary || `Email ${application.companyName}`,
        scheduledAt: scheduledDate,
        externalUpdatedAt: event.updated ? new Date(event.updated) : null,
      });
    }

    revalidatePath("/dashboard/follow-ups");
    revalidatePath("/dashboard/send-email");
    return { success: true, message: "Email berhasil dijadwalkan", data: schedule };
  } catch (error) {
    logger.error("Failed to schedule application email", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal menjadwalkan email" };
  }
}
