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
import {
  followUpEmailSchema,
  scheduleSchema,
  unifiedFollowUpSchema,
} from "@/lib/validations";
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

export async function upsertScheduleForEmail(
  emailId: string,
  scheduledDate: string
): Promise<ActionState<FollowUpSchedule>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const [email] = await db
      .select()
      .from(followUpEmails)
      .where(
        and(eq(followUpEmails.id, emailId), eq(followUpEmails.userId, session.user.id))
      );

    if (!email) {
      return { success: false, message: "Email tidak ditemukan" };
    }

    const [existing] = await db
      .select()
      .from(followUpSchedules)
      .where(
        and(
          eq(followUpSchedules.applicationId, email.applicationId),
          eq(followUpSchedules.userId, session.user.id),
          eq(followUpSchedules.isActive, true)
        )
      );

    const nextDate = new Date(scheduledDate);

    let schedule: FollowUpSchedule;
    if (existing) {
      const [updated] = await db
        .update(followUpSchedules)
        .set({ scheduledDate: nextDate, emailId, updatedAt: new Date() })
        .where(eq(followUpSchedules.id, existing.id))
        .returning();
      schedule = updated;
    } else {
      const [created] = await db
        .insert(followUpSchedules)
        .values({
          applicationId: email.applicationId,
          userId: session.user.id,
          emailId,
          scheduledDate: nextDate,
        })
        .returning();
      schedule = created;
    }

    await db
      .update(followUpEmails)
      .set({ status: "scheduled" })
      .where(eq(followUpEmails.id, emailId));

    revalidatePath("/dashboard/follow-ups");
    return { success: true, message: "Jadwal berhasil disimpan", data: schedule };
  } catch (error) {
    logger.error("Failed to upsert schedule for email", {
      userId: session.user.id,
      emailId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return { success: false, message: "Gagal menyimpan jadwal" };
  }
}

export async function createScheduledFollowUp(
  prevState: ActionState<FollowUpEmail>,
  formData: FormData
): Promise<ActionState<FollowUpEmail>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData);
  const result = unifiedFollowUpSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { applicationId, subject, body, recipientEmail, action, scheduledDate } =
    result.data;

  try {
    // 1. Create email draft with appropriate status
    const emailStatus =
      action === "schedule" ? "scheduled" : action === "draft" ? "draft" : "sent";

    const [email] = await db
      .insert(followUpEmails)
      .values({
        applicationId,
        userId: session.user.id,
        subject,
        body,
        recipientEmail,
        status: emailStatus,
        mode: "manual",
        sentAt: action === "send" ? new Date() : null,
      })
      .returning();

    // 2. If action is "send", send email immediately
    if (action === "send") {
      try {
        await sendEmail({
          to: recipientEmail,
          subject,
          body,
        });

        logger.info("Follow-up email sent immediately", {
          userId: session.user.id,
          emailId: email.id,
          to: recipientEmail,
        });
      } catch (error) {
        // Update status to failed if send fails
        await db
          .update(followUpEmails)
          .set({ status: "failed" })
          .where(eq(followUpEmails.id, email.id));

        logger.error("Failed to send follow-up email immediately", {
          userId: session.user.id,
          emailId: email.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });

        return { success: false, message: "Gagal mengirim email" };
      }
    }

    // 3. If action is "schedule", create schedule and calendar event
    if (action === "schedule" && scheduledDate) {
      const [schedule] = await db
        .insert(followUpSchedules)
        .values({
          applicationId,
          userId: session.user.id,
          emailId: email.id,
          scheduledDate: new Date(scheduledDate),
        })
        .returning();

      // Get application details for calendar event
      const [application] = await db
        .select()
        .from(jobApplications)
        .where(eq(jobApplications.id, applicationId));

      if (application) {
        const event = await upsertGoogleCalendarEvent({
          userId: session.user.id,
          title: `Follow-up: ${application.companyName} - ${application.position}`,
          description: `Status: ${application.status}\nKontak HR: ${application.hrContact || "-"}\n\nSubject: ${subject}`,
          start: new Date(scheduledDate),
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
            scheduledAt: new Date(scheduledDate),
            externalUpdatedAt: event.updated ? new Date(event.updated) : null,
          });
        }
      }

      logger.info("Follow-up scheduled", {
        userId: session.user.id,
        emailId: email.id,
        scheduleId: schedule.id,
        scheduledDate,
      });
    }

    revalidatePath("/dashboard/follow-ups");

    const successMessage =
      action === "send"
        ? "Email berhasil dikirim"
        : action === "draft"
          ? "Draft email berhasil disimpan"
          : "Follow-up berhasil dijadwalkan";

    return {
      success: true,
      message: successMessage,
      data: email,
    };
  } catch (error) {
    logger.error("Failed to create scheduled follow-up", {
      userId: session.user.id,
      action,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    const errorMessage =
      action === "send"
        ? "Gagal mengirim email"
        : action === "draft"
          ? "Gagal menyimpan draft"
          : "Gagal menjadwalkan follow-up";

    return { success: false, message: errorMessage };
  }
}
