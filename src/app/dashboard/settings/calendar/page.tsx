import { buttonVariants } from "@/components/ui/button";
import {
  getCalendarConnection,
  getGoogleCalendarOptions,
} from "@/features/calendar/actions/queries";
import { CalendarIntegrationCard } from "@/features/settings/components/calendar-integration-card";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CalendarSettingsPage() {
  const calendarConnection = await getCalendarConnection().catch(() => null);
  const calendarOptions = calendarConnection
    ? await getGoogleCalendarOptions().catch(() => [])
    : [];

  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pengaturan Google Calendar</h1>
          <p className="text-muted-foreground">Kelola koneksi dan preferensi calendar.</p>
        </div>
        <Link
          href="/dashboard/settings"
          className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Link>
      </div>

      <CalendarIntegrationCard
        isConnected={!!(calendarConnection && calendarConnection.isActive)}
        calendarId={calendarConnection?.calendarId || "primary"}
        timezone={calendarConnection?.timezone || "Asia/Jakarta"}
        calendarOptions={calendarOptions}
      />
    </div>
  );
}
