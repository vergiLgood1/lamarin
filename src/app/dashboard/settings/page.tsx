import { getCalendarConnection } from "@/features/calendar/actions/queries";
import { ExportDataCard } from "@/features/settings/components/export-data-card";
import { ProfileCard } from "@/features/settings/components/profile-card";
import { getTelegramConnection } from "@/features/telegram/actions/queries";
import { getSession } from "@/lib/auth-server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

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
      connected: calendarConnection?.isActive,
      badge: calendarConnection?.isActive ? "Terhubung" : "Belum terhubung",
    },
    {
      title: "Telegram Bot",
      description:
        "Terima reminder follow-up otomatis H-1 dan H-0 melalui Telegram.",
      href: "/dashboard/settings/telegram",
      icon: Bot,
      connected: telegramConnection?.isActive,
      badge: telegramConnection?.isActive ? "Terhubung" : "Belum terhubung",
    },
  ];

  const connectedCount = integrations.filter((item) => item.connected).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_35%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Sparkles className="mr-1 size-3.5" />
              Pengaturan Akun
            </Badge>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Kelola Pengaturan
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Atur profil akun, integrasi aplikasi, dan preferensi notifikasi
                untuk mempermudah proses follow-up lamaran kerja Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
        </div>
      </section>

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
              {integrations.map((integration) => {
                const Icon = integration.icon;

                return (
                  <Link
                    key={integration.title}
                    href={integration.href}
                    className="group"
                  >
                    <Card
                      className={cn(
                        "relative h-full overflow-hidden rounded-3xl border transition-all duration-200",
                        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl",
                      )}
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                      <CardContent className="flex h-full flex-col p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={cn(
                              "flex size-12 items-center justify-center rounded-2xl border",
                              integration.connected
                                ? "border-primary/20 bg-primary/10 text-primary"
                                : "border-border bg-muted text-muted-foreground",
                            )}
                          >
                            <Icon className="size-6" />
                          </div>

                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[11px]",
                              integration.connected
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-border bg-muted text-muted-foreground",
                            )}
                          >
                            {integration.connected ? (
                              <CheckCircle2 className="mr-1 size-3.5" />
                            ) : (
                              <XCircle className="mr-1 size-3.5" />
                            )}

                            {integration.badge}
                          </Badge>
                        </div>

                        <div className="mt-5 flex-1 space-y-2">
                          <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                            {integration.title}
                          </h3>

                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {integration.description}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t pt-4">
                          <span className="text-sm font-medium">
                            Kelola Integrasi
                          </span>

                          <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
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
