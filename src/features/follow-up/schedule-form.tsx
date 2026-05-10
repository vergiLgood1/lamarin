"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage } from "@/components/ui/form-message";
import { createSchedule, cancelSchedule } from "@/actions/follow-up/mutations";
import { toast } from "sonner";
import { Clock, X } from "lucide-react";
import type { JobApplication, ActionState, FollowUpSchedule } from "@/types";

interface ScheduleFormProps {
  applications: JobApplication[];
  schedules: {
    id: string;
    applicationId: string;
    scheduledDate: Date;
    isActive: boolean;
    companyName: string | null;
    position: string | null;
  }[];
}

const initialState: ActionState<FollowUpSchedule> = { success: false };

export function ScheduleForm({ applications, schedules }: ScheduleFormProps) {
  const [state, formAction] = useActionState(createSchedule, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message && state.message !== "Validasi gagal") {
      toast.error(state.message);
    }
  }, [state]);

  async function handleCancel(scheduleId: string) {
    const result = await cancelSchedule(scheduleId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || "Gagal membatalkan jadwal");
    }
  }

  const activeSchedules = schedules.filter((s) => s.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jadwal Auto Follow-up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Pilih Lamaran</Label>
            <Select name="applicationId">
              <SelectTrigger>
                <SelectValue placeholder="Pilih lamaran..." />
              </SelectTrigger>
              <SelectContent>
                {applications
                  .filter((app) => app.hrContact)
                  .map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.companyName} - {app.position}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FormMessage errors={state.errors?.applicationId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Tanggal & Waktu Kirim</Label>
            <Input
              id="scheduledDate"
              name="scheduledDate"
              type="datetime-local"
              aria-invalid={!!state.errors?.scheduledDate}
            />
            <FormMessage errors={state.errors?.scheduledDate} />
          </div>

          <SubmitButton pendingText="Menjadwalkan...">
            <Clock className="mr-2 h-4 w-4" />
            Jadwalkan
          </SubmitButton>
        </form>

        {activeSchedules.length > 0 && (
          <div className="space-y-2 pt-4">
            <p className="text-sm font-medium">Jadwal Aktif</p>
            {activeSchedules.map((schedule) => (
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Aktif</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancel(schedule.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
