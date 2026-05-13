"use server";

import { db } from "@/db";
import {
  calendarEvents,
  followUpEmails,
  followUpSchedules,
  jobApplications,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  deleteGoogleCalendarEvent,
  upsertGoogleCalendarEvent,
} from "@/lib/calendar/google";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { followUpEmailSchema, scheduleSchema } from "@/lib/validations";
import type { ActionState, FollowUpEmail, FollowUpSchedule } from "@/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createFollowUpDraft(
  prevState: ActionState<FollowUpEmail>,
  formData: FormData
): Promise<ActionState<FollowUpEmail>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData);
  const result = followUpEmailSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const [email] = await db
      .insert(followUpEmails)
      .values({
        applicationId: result.data.applicationId,
        userId: session.user.id,
        subject: result.data.subject,
        body: result.data.body,
        recipientEmail: result.data.recipientEmail,
        status: "draft",
        mode: result.data.mode,
      })
      .returning();

    logger.info("Follow-up draft created", {
      userId: session.user.id,
      emailId: email.id,
      applicationId: result.data.applicationId,
    });

    revalidatePath("/dashboard/follow-ups");
    return {
      success: true,
      message: "Draft email berhasil disimpan",
      data: email,
    };
  } catch (error) {
    logger.error("Failed to create follow-up draft", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal menyimpan draft" };
  }
}

export async function sendFollowUpEmail(
  emailId: string
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const [emailRecord] = await db
    .select()
    .from(followUpEmails)
    .where(
      and(
        eq(followUpEmails.id, emailId),
        eq(followUpEmails.userId, session.user.id)
      )
    );

  if (!emailRecord) {
    return { success: false, message: "Email tidak ditemukan" };
  }

  try {
    await sendEmail({
      to: emailRecord.recipientEmail,
      subject: emailRecord.subject,
      body: emailRecord.body,
    });

    await db
      .update(followUpEmails)
      .set({ status: "sent", sentAt: new Date() })
      .where(eq(followUpEmails.id, emailId));

    logger.info("Follow-up email sent", {
      userId: session.user.id,
      emailId,
      to: emailRecord.recipientEmail,
    });

    revalidatePath("/dashboard/follow-ups");
    return { success: true, message: "Email berhasil dikirim" };
  } catch (error) {
    await db
      .update(followUpEmails)
      .set({ status: "failed" })
      .where(eq(followUpEmails.id, emailId));

    logger.error("Failed to send follow-up email", {
      userId: session.user.id,
      emailId,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return { success: false, message: "Gagal mengirim email" };
  }
}

export async function updateFollowUpDraft(
  emailId: string,
  data: { subject?: string; body?: string }
): Promise<ActionState<FollowUpEmail>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const [updated] = await db
      .update(followUpEmails)
      .set(data)
      .where(
        and(
          eq(followUpEmails.id, emailId),
          eq(followUpEmails.userId, session.user.id)
        )
      )
      .returning();

    if (!updated) {
      return { success: false, message: "Email tidak ditemukan" };
    }

    revalidatePath("/dashboard/follow-ups");
    return { success: true, message: "Draft berhasil diperbarui", data: updated };
  } catch (error) {
    logger.error("Failed to update follow-up draft", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal memperbarui draft" };
  }
}

export async function deleteFollowUpEmail(
  emailId: string
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db
      .delete(followUpEmails)
      .where(
        and(
          eq(followUpEmails.id, emailId),
          eq(followUpEmails.userId, session.user.id)
        )
      );

    logger.info("Follow-up email deleted", {
      userId: session.user.id,
      emailId,
    });

    revalidatePath("/dashboard/follow-ups");
    return { success: true, message: "Email berhasil dihapus" };
  } catch (error) {
    logger.error("Failed to delete follow-up email", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal menghapus email" };
  }
}

export async function createSchedule(
  prevState: ActionState<FollowUpSchedule>,
  formData: FormData
): Promise<ActionState<FollowUpSchedule>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData);
  const result = scheduleSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const [schedule] = await db
      .insert(followUpSchedules)
      .values({
        applicationId: result.data.applicationId,
        userId: session.user.id,
        scheduledDate: new Date(result.data.scheduledDate),
      })
      .returning();

    const [application] = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, result.data.applicationId));

    if (application) {
      const event = await upsertGoogleCalendarEvent({
        userId: session.user.id,
        title: `Follow-up: ${application.companyName} - ${application.position}`,
        description: `Status: ${application.status}\nKontak HR: ${application.hrContact || "-"}`,
        start: new Date(result.data.scheduledDate),
        timezone: "Asia/Jakarta",
      });

      if (event?.id) {
        await db.insert(calendarEvents).values({
          userId: session.user.id,
          applicationId: application.id,
          provider: "google",
          eventType: "follow_up",
          externalEventId: event.id,
          title: event.summary || `Follow-up ${application.companyName}`,
          scheduledAt: new Date(result.data.scheduledDate),
          externalUpdatedAt: event.updated ? new Date(event.updated) : null,
        });
      }
    }

    logger.info("Follow-up schedule created", {
      userId: session.user.id,
      scheduleId: schedule.id,
      scheduledDate: result.data.scheduledDate,
    });

    revalidatePath("/dashboard/follow-ups");
    return {
      success: true,
      message: "Jadwal follow-up berhasil dibuat",
      data: schedule,
    };
  } catch (error) {
    logger.error("Failed to create schedule", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal membuat jadwal" };
  }
}

export async function cancelSchedule(
  scheduleId: string
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const [updated] = await db
      .update(followUpSchedules)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(followUpSchedules.id, scheduleId),
          eq(followUpSchedules.userId, session.user.id)
        )
      )
      .returning();

    if (!updated) {
      return { success: false, message: "Jadwal tidak ditemukan" };
    }

    logger.info("Follow-up schedule cancelled", {
      userId: session.user.id,
      scheduleId,
    });

    const [linkedEvent] = await db
      .select()
      .from(calendarEvents)
      .where(
        and(
          eq(calendarEvents.applicationId, updated.applicationId),
          eq(calendarEvents.userId, session.user.id),
          eq(calendarEvents.eventType, "follow_up")
        )
      );

    if (linkedEvent) {
      await deleteGoogleCalendarEvent({
        userId: session.user.id,
        externalEventId: linkedEvent.externalEventId,
      }).catch(() => null);

      await db.delete(calendarEvents).where(eq(calendarEvents.id, linkedEvent.id));
    }

    revalidatePath("/dashboard/follow-ups");
    return { success: true, message: "Jadwal berhasil dibatalkan" };
  } catch (error) {
    logger.error("Failed to cancel schedule", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal membatalkan jadwal" };
  }
}
