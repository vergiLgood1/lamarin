"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  disconnectGoogleCalendar,
  updateCalendarPreferences,
} from "@/features/calendar/actions/mutations";

import { cn } from "@/lib/utils";

import {
  Calendar,
  CheckCircle2,
  Loader2,
  Settings2,
  Unplug,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

interface CalendarIntegrationCardProps {
  isConnected: boolean;
  calendarId: string;
  timezone: string;
  calendarOptions: { id: string; summary: string }[];
}

export function CalendarIntegrationCard(props: CalendarIntegrationCardProps) {
  const [isPending, startTransition] = useTransition();

  async function handleDisconnect() {
    startTransition(async () => {
      const result = await disconnectGoogleCalendar();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="rounded-3xl border-border/60">
      <CardHeader className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-2xl border",
                props.isConnected
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              <Calendar className="size-7" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-xl">Google Calendar</CardTitle>

              <CardDescription className="max-w-lg leading-relaxed">
                Sinkronisasi follow-up interview langsung ke Google Calendar
                untuk workflow yang lebih terorganisir.
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3 py-1",
              props.isConnected
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {props.isConnected ? (
              <CheckCircle2 className="mr-1 size-3.5" />
            ) : (
              <XCircle className="mr-1 size-3.5" />
            )}

            {props.isConnected ? "Terhubung" : "Belum terhubung"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!props.isConnected ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Calendar className="size-8" />
            </div>

            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold">Connect Google Calendar</h3>

              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                Hubungkan akun Google Calendar untuk sinkronisasi jadwal
                follow-up interview otomatis.
              </p>
            </div>

            <Link href="/api/calendar/connect" className="mt-6 inline-flex">
              <Button className="h-11 rounded-xl px-5">
                <Calendar className="mr-2 size-4" />
                Connect Google Calendar
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <form
              action={(formData) => {
                startTransition(async () => {
                  const result = await updateCalendarPreferences(formData);

                  if (result.success) {
                    toast.success(result.message);
                  } else {
                    toast.error(result.message);
                  }
                });
              }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="calendarId">Calendar Workspace</Label>

                <Select name="calendarId" defaultValue={props.calendarId}>
                  <SelectTrigger className="h-11 rounded-xl w-full">
                    <SelectValue placeholder="Pilih calendar" />
                  </SelectTrigger>

                  <SelectContent>
                    {(props.calendarOptions.length > 0
                      ? props.calendarOptions
                      : [
                          {
                            id: "primary",
                            summary: "Primary",
                          },
                        ]
                    ).map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        {calendar.summary}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  Pilih calendar tujuan untuk sinkronisasi event.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>

                <Input
                  id="timezone"
                  name="timezone"
                  defaultValue={props.timezone}
                  placeholder="Asia/Jakarta"
                  className="h-11 rounded-xl"
                />

                <p className="text-xs text-muted-foreground">
                  Digunakan untuk penyesuaian waktu reminder.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="h-11 rounded-xl px-5"
              >
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Settings2 className="mr-2 size-4" />
                )}
                Simpan Preferensi
              </Button>
            </form>

            <div className="border-t pt-5">
              <Button
                variant="destructive"
                className="h-11 rounded-xl"
                disabled={isPending}
                onClick={handleDisconnect}
              >
                <Unplug className="mr-2 size-4" />
                Disconnect
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}