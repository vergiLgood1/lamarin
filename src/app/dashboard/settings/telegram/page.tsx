import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { TelegramIntegrationCard } from "@/features/settings/components/telegram-integration-card";
import { getTelegramConnection } from "@/features/telegram/actions/queries";

import { cn } from "@/lib/utils";

import {
  ArrowLeft,
  BellRing,
  Bot,
  CheckCircle2,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import Link from "next/link";

export default async function TelegramSettingsPage() {
  const telegramConnection =
    await getTelegramConnection().catch(() => null);

  const isConnected = !!(
    telegramConnection && telegramConnection.isActive
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_35%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Badge
              variant="secondary"
              className="w-fit rounded-full px-3 py-1"
            >
              <Sparkles className="mr-1 size-3.5" />
              Telegram Integration
            </Badge>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Telegram Bot
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Hubungkan akun Telegram untuk menerima reminder
                follow-up interview otomatis secara real-time.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-2xl border-border/60 bg-background/70 backdrop-blur",
            )}
          >
            <ArrowLeft className="mr-2 size-4" />
            Kembali
          </Link>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TelegramIntegrationCard
          isConnected={isConnected}
          chatId={telegramConnection?.chatId || ""}
          username={telegramConnection?.username || ""}
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
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">
                      Status Koneksi
                    </h2>

                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full",
                        isConnected
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isConnected
                        ? "Terhubung"
                        : "Belum terhubung"}
                    </Badge>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {isConnected
                      ? "Bot Telegram berhasil terhubung dan siap mengirim reminder follow-up."
                      : "Hubungkan bot Telegram untuk mendapatkan reminder follow-up otomatis."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-1">
                <h2 className="font-semibold">
                  Fitur Telegram Bot
                </h2>

                <p className="text-sm text-muted-foreground">
                  Integrasi otomatis untuk workflow follow-up Anda.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: BellRing,
                    title: "Reminder Otomatis",
                    description:
                      "Notifikasi H-1 dan H-0 follow-up interview.",
                  },
                  {
                    icon: MessageCircleMore,
                    title: "Realtime Notification",
                    description:
                      "Pesan langsung masuk ke Telegram pribadi Anda.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Private & Secure",
                    description:
                      "Data reminder hanya dikirim ke chat yang terhubung.",
                  },
                  {
                    icon: Bot,
                    title: "Bot Automation",
                    description:
                      "Mengurangi risiko lupa follow-up recruiter.",
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
                        <h3 className="text-sm font-medium">
                          {feature.title}
                        </h3>

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