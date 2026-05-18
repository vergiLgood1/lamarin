import { getCalendarConnection } from "@/features/calendar/actions/queries";
import { ExportDataCard } from "@/features/settings/components/export-data-card";
import { ProfileCard } from "@/features/settings/components/profile-card";
import { getTelegramConnection } from "@/features/telegram/actions/queries";
import { getSession } from "@/lib/auth-server";

import { Card, CardContent } from "@/components/ui/card";

import { Bot, Calendar, ShieldCheck, Sparkles } from "lucide-react";

import IntegrationCard from "@/features/settings/components/integration-card";
import { SettingsHeader } from "@/features/settings/components/settings-header";
import Link from "next/link";

export default async function SettingsPage() {
  const [session, calendarConnection, telegramConnection] = await Promise.all([
    getSession(),
    getCalendarConnection().catch(() => null),
    getTelegramConnection().catch(() => null),
  ]);

  const integrations = [
    {
      title: "Google Calendar",
      description:
        "Sinkronisasi follow-up interview dan reminder langsung ke Google Calendar.",
      href: "/dashboard/settings/calendar",
      icon: Calendar,
      connected: Boolean(calendarConnection?.isActive),
      badge: calendarConnection?.isActive ? "Terhubung" : "Belum terhubung",
    },
    {
      title: "Telegram Bot",
      description:
        "Terima reminder follow-up otomatis H-1 dan H-0 melalui Telegram.",
      href: "/dashboard/settings/telegram",
      icon: Bot,
      connected: Boolean(telegramConnection?.isActive),
      badge: telegramConnection?.isActive ? "Terhubung" : "Belum terhubung",
    },
  ];

  const connectedCount = integrations.filter((item) => item.connected).length;

  return (
    <div className="mx-auto space-y-8">
      <SettingsHeader
        eyebrow="Pengaturan Akun"
        title="Kelola Pengaturan"
        description="Atur profil akun, integrasi aplikasi, dan preferensi notifikasi untuk mempermudah proses follow-up lamaran kerja Anda."
        icon={Sparkles}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-72">
          <Card className="rounded-2xl border-border/60 bg-background/70 shadow-none backdrop-blur">
            <CardContent className="flex flex-col gap-1 p-5">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Integrasi Aktif
              </span>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{connectedCount}</span>

                <span className="pb-1 text-sm text-muted-foreground">
                  / {integrations.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-background/70 shadow-none backdrop-blur">
            <CardContent className="flex flex-col gap-1 p-5">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Akun
              </span>

              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-500" />

                <span className="font-medium">Aman</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </SettingsHeader>

      <ProfileCard
        name={session?.user?.name || ""}
        email={session?.user?.email || ""}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Integrasi</h2>

              <p className="text-sm text-muted-foreground">
                Hubungkan aplikasi eksternal untuk otomatisasi workflow
                follow-up.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {integrations.map((integration) => (
                <Link
                  key={integration.title}
                  href={integration.href}
                  className="group"
                >
                  <IntegrationCard integration={integration} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="space-y-6">
        <ExportDataCard />
      </div>
    </div>
  );
}
