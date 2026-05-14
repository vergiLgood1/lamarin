import {
  getCalendarConnection,
  getGoogleCalendarOptions,
} from "@/features/calendar/actions/queries";
import { CalendarIntegrationCard } from "@/features/settings/components/calendar-integration-card";
import { ExportDataCard } from "@/features/settings/components/export-data-card";
import { ProfileCard } from "@/features/settings/components/profile-card";
import { TelegramIntegrationCard } from "@/features/settings/components/telegram-integration-card";
import { getTelegramConnection } from "@/features/telegram/actions/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const calendarConnection = await getCalendarConnection().catch(() => null);
  const calendarOptions = calendarConnection
    ? await getGoogleCalendarOptions().catch(() => [])
    : [];
  const telegramConnection = await getTelegramConnection().catch(() => null);

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola akun dan preferensi Anda</p>
      </div>

      <ProfileCard
        name={session?.user?.name || ""}
        email={session?.user?.email || ""}
      />
      <ExportDataCard />
      <CalendarIntegrationCard
        isConnected={!!(calendarConnection && calendarConnection.isActive)}
        calendarId={calendarConnection?.calendarId || "primary"}
        timezone={calendarConnection?.timezone || "Asia/Jakarta"}
        calendarOptions={calendarOptions}
      />
      <TelegramIntegrationCard
        isConnected={!!(telegramConnection && telegramConnection.isActive)}
        chatId={telegramConnection?.chatId || ""}
        username={telegramConnection?.username || ""}
      />
    </div>
  );
}
