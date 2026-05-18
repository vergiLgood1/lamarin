import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  getCalendarConnection,
  getGoogleCalendarOptions,
} from "@/features/calendar/actions/queries";

import { CalendarIntegrationCard } from "@/features/settings/components/calendar-integration-card";
import { SettingsHeader } from "@/features/settings/components/settings-header";

import { cn } from "@/lib/utils";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  Globe2,
  Sparkles,
  Workflow,
  XCircle,
} from "lucide-react";

import Link from "next/link";

export default async function CalendarSettingsPage() {
  const calendarConnection =
    await getCalendarConnection().catch(() => null);

  const calendarOptions = calendarConnection
    ? await getGoogleCalendarOptions().catch(() => [])
    : [];

  const isConnected = !!(
    calendarConnection && calendarConnection.isActive
  );

  return (
    <div className="mx-auto space-y-8">
      <SettingsHeader
        eyebrow="Calendar Integration"
        title="Google Calendar"
        description="Sinkronisasikan jadwal follow-up interview langsung ke Google Calendar agar workflow tetap terorganisir."
        icon={Sparkles}
      >
        <Link
          href="/dashboard/settings"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full rounded-2xl border-border/60 bg-background/70 backdrop-blur sm:w-auto",
          )}
        >
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Link>
      </SettingsHeader>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CalendarIntegrationCard
          isConnected={isConnected}
          calendarId={calendarConnection?.calendarId || "primary"}
          timezone={calendarConnection?.timezone || "Asia/Jakarta"}
          calendarOptions={calendarOptions}
        />

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-2xl border",
                    isConnected
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                      : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {isConnected ? (
                    <CheckCircle2 className="size-7" />
                  ) : (
                    <XCircle className="size-7" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">Status Sinkronisasi</h2>

                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full",
                        isConnected
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isConnected ? "Terhubung" : "Belum terhubung"}
                    </Badge>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {isConnected
                      ? "Google Calendar berhasil terhubung dan siap melakukan sinkronisasi follow-up."
                      : "Hubungkan Google Calendar untuk sinkronisasi jadwal otomatis."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-1">
                <h2 className="font-semibold">Fitur Google Calendar</h2>

                <p className="text-sm text-muted-foreground">
                  Kelola follow-up interview dengan sinkronisasi otomatis.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Calendar,
                    title: "Auto Event Sync",
                    description:
                      "Follow-up otomatis dibuat sebagai event calendar.",
                  },
                  {
                    icon: Clock3,
                    title: "Timezone Support",
                    description:
                      "Mendukung pengaturan timezone sesuai lokasi Anda.",
                  },
                  {
                    icon: Workflow,
                    title: "Workflow Reminder",
                    description:
                      "Membantu menjaga alur follow-up tetap konsisten.",
                  },
                  {
                    icon: Globe2,
                    title: "Cross Platform",
                    description:
                      "Akses jadwal dari desktop maupun perangkat mobile.",
                  },
                ].map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-4 rounded-2xl border border-border/60 p-4"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">{feature.title}</h3>

                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
