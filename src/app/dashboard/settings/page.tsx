import {
  getCalendarConnection,
} from "@/features/calendar/actions/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportDataCard } from "@/features/settings/components/export-data-card";
import { ProfileCard } from "@/features/settings/components/profile-card";
import { getTelegramConnection } from "@/features/telegram/actions/queries";
import { getSession } from "@/lib/auth-server";
import { ArrowRight, Bot, Calendar } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const [session, calendarConnection, telegramConnection] = await Promise.all([
    getSession(),
    getCalendarConnection().catch(() => null),
    getTelegramConnection().catch(() => null),
  ]);

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola akun dan preferensi Anda</p>
      </div>

      <ProfileCard
        name={session?.user?.name || ""}
        email={session?.user?.email || ""}
      />
      <ExportDataCard />
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/settings/calendar" className="group block">
          <Card className="h-full transition-colors group-hover:bg-muted/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Google Calendar
              </CardTitle>
              <CardDescription>
                Kelola integrasi follow-up dengan Google Calendar
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {calendarConnection?.isActive ? "Terhubung" : "Belum terhubung"}
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings/telegram" className="group block">
          <Card className="h-full transition-colors group-hover:bg-muted/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="size-5" />
                Telegram Bot
              </CardTitle>
              <CardDescription>
                Kelola notifikasi reminder H-1 dan H-0 via Telegram
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {telegramConnection?.isActive ? "Terhubung" : "Belum terhubung"}
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
