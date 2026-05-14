import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getFollowUpEmailById,
  getFollowUpSchedules,
} from "@/features/follow-up/actions/queries";
import { ComposeEmailEditor } from "@/features/follow-up/components/compose-email-editor";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  scheduled: "Dijadwalkan",
  sent: "Terkirim",
  failed: "Gagal",
};

interface FollowUpComposeDetailPageProps {
  params: Promise<{ emailId: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function FollowUpComposeDetailPage({
  params,
  searchParams,
}: FollowUpComposeDetailPageProps) {
  const { emailId } = await params;
  const { mode } = await searchParams;
  const [email, schedules] = await Promise.all([
    getFollowUpEmailById(emailId),
    getFollowUpSchedules(),
  ]);

  if (!email) notFound();

  const relatedSchedules = schedules.filter(
    (schedule) =>
      schedule.applicationId === email.applicationId || schedule.emailId === email.id,
  );
  const activeSchedule = relatedSchedules.find((schedule) => schedule.isActive);
  const isEditableStatus = email.status === "draft" || email.status === "scheduled";
  const isEditMode = mode === "edit" && isEditableStatus;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Compose Email</h1>
          <p className="text-sm text-muted-foreground">
            Detail email follow-up beserta jadwal yang terhubung.
          </p>
        </div>
        <Link
          href="/dashboard/follow-ups/compose"
          className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>{email.subject}</span>
            <Badge variant={email.status === "sent" ? "default" : "secondary"}>
              {STATUS_LABELS[email.status] || email.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted-foreground">To:</span> {email.recipientEmail}
            </p>
            <p>
              <span className="text-muted-foreground">Mode:</span> {email.mode}
            </p>
            <p>
              <span className="text-muted-foreground">Dibuat:</span>{" "}
              {new Date(email.createdAt).toLocaleString("id-ID")}
            </p>
            <p>
              <span className="text-muted-foreground">Terkirim:</span>{" "}
              {email.sentAt ? new Date(email.sentAt).toLocaleString("id-ID") : "-"}
            </p>
          </div>

          {isEditMode ? (
            <ComposeEmailEditor
              emailId={email.id}
              initialSubject={email.subject}
              initialBody={email.body}
              existingSchedule={
                activeSchedule
                  ? {
                      id: activeSchedule.id,
                      scheduledDate: activeSchedule.scheduledDate,
                      isActive: activeSchedule.isActive,
                    }
                  : undefined
              }
            />
          ) : (
            <div className="rounded-md border p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{email.body}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jadwal Terkait ({relatedSchedules.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {relatedSchedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada jadwal terkait email ini.</p>
          ) : (
            relatedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {schedule.companyName} - {schedule.position}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(schedule.scheduledDate).toLocaleString("id-ID")}
                  </p>
                </div>
                <Badge variant={schedule.isActive ? "outline" : "secondary"}>
                  {schedule.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
