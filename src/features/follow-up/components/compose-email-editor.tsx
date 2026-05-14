"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  cancelSchedule,
  updateFollowUpDraft,
  upsertScheduleForEmail,
} from "@/features/follow-up/actions/mutations";
import { CalendarClock, Loader2, Plus, Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ComposeEmailEditorProps {
  emailId: string;
  initialSubject: string;
  initialBody: string;
  existingSchedule?: {
    id: string;
    scheduledDate: Date;
    isActive: boolean;
  };
}

export function ComposeEmailEditor({
  emailId,
  initialSubject,
  initialBody,
  existingSchedule,
}: ComposeEmailEditorProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [isPending, startTransition] = useTransition();
  const [showScheduleForm, setShowScheduleForm] = useState(
    Boolean(existingSchedule?.isActive),
  );
  const [hasActiveSchedule, setHasActiveSchedule] = useState(
    Boolean(existingSchedule?.isActive),
  );
  const [scheduledDate, setScheduledDate] = useState(
    existingSchedule?.scheduledDate
      ? new Date(existingSchedule.scheduledDate).toISOString().slice(0, 16)
      : "",
  );

  function handleSave() {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject dan isi email wajib diisi");
      return;
    }

    startTransition(async () => {
      const result = await updateFollowUpDraft(emailId, {
        subject: subject.trim(),
        body: body.trim(),
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Gagal menyimpan perubahan");
      }
    });
  }

  function handleSaveSchedule() {
    if (!scheduledDate) {
      toast.error("Tanggal jadwal wajib diisi");
      return;
    }

    startTransition(async () => {
      const result = await upsertScheduleForEmail(emailId, scheduledDate);
      if (result.success) {
        toast.success(result.message);
        setHasActiveSchedule(true);
        setShowScheduleForm(true);
      } else {
        toast.error(result.message || "Gagal menyimpan jadwal");
      }
    });
  }

  function handleCancelSchedule() {
    if (!existingSchedule?.id) return;

    startTransition(async () => {
      const result = await cancelSchedule(existingSchedule.id);
      if (result.success) {
        toast.success(result.message);
        setScheduledDate("");
        setHasActiveSchedule(false);
        setShowScheduleForm(false);
      } else {
        toast.error(result.message || "Gagal membatalkan jadwal");
      }
    });
  }

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="space-y-2">
        <Label htmlFor="edit-subject">Subject</Label>
        <Input
          id="edit-subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Subject email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-body">Isi Email</Label>
        <Textarea
          id="edit-body"
          rows={10}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Isi email"
        />
      </div>

      <Button onClick={handleSave} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Save className="mr-2 size-4" />
        )}
        Simpan Perubahan
      </Button>

      <div className="space-y-3 rounded-md border p-4">
        <div className="flex items-center justify-between gap-2">
          <Label>Jadwalkan Pengiriman</Label>
          {!showScheduleForm ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowScheduleForm(true)}
            >
              <Plus className="mr-2 size-4" />
              Add Schedule
            </Button>
          ) : null}
        </div>

        {showScheduleForm ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="edit-scheduled-date">Tanggal & Waktu</Label>
              <Input
                id="edit-scheduled-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(event) => setScheduledDate(event.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={handleSaveSchedule}
                disabled={isPending}
                variant="outline"
              >
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <CalendarClock className="mr-2 size-4" />
                )}
                {hasActiveSchedule ? "Update Jadwal" : "Tambah Jadwal"}
              </Button>

              {hasActiveSchedule ? (
                <Button
                  type="button"
                  onClick={handleCancelSchedule}
                  disabled={isPending}
                  variant="ghost"
                  className="text-destructive"
                >
                  <X className="mr-2 size-4" />
                  Batalkan Jadwal
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowScheduleForm(false)}
                  disabled={isPending}
                >
                  Batal
                </Button>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Draft ini belum punya jadwal. Klik <span className="font-medium">Add Schedule</span> untuk menambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
