"use client";

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
import { Calendar } from "lucide-react";
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
    const result = await disconnectGoogleCalendar();
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar</CardTitle>
        <CardDescription>Integrasi follow-up dengan Google Calendar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!props.isConnected ? (
          <Link href="/api/calendar/connect" className="inline-flex">
            <Button>
            <Calendar className="mr-2 size-4" />
            Connect Google Calendar
            </Button>
          </Link>
        ) : (
          <>
            <form
              action={(formData) => {
                startTransition(async () => {
                  const result = await updateCalendarPreferences(formData);
                  if (result.success) toast.success(result.message);
                  else toast.error(result.message);
                });
              }}
              className="space-y-3"
            >
              <div className="space-y-2">
                <Label htmlFor="calendarId">Calendar ID</Label>
                <Select name="calendarId" defaultValue={props.calendarId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {(props.calendarOptions.length > 0
                      ? props.calendarOptions
                      : [{ id: "primary", summary: "Primary" }]
                    ).map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        {calendar.summary}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" name="timezone" defaultValue={props.timezone} />
              </div>
              <Button type="submit" variant="outline" disabled={isPending}>
                Simpan Preferensi
              </Button>
            </form>
            <Button variant="destructive" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
