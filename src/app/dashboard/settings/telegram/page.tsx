import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { SettingsHeader } from "@/features/settings/components/settings-header";
import { TelegramIntegrationCard } from "@/features/settings/components/telegram-integration-card";
import { getTelegramConnection } from "@/features/telegram/actions/queries";

import { cn } from "@/lib/utils";

import {
  ArrowLeft,
  BookOpen,
  Bot,
  CheckCircle2,
  ExternalLink,
  MessageCircleMore,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

import Link from "next/link";

const HERMES_DOCS_URL = "https://hermes-agent.nousresearch.com/docs";

export default async function TelegramSettingsPage() {
  const telegramConnection = await getTelegramConnection().catch(() => null);

  const isConnected = !!(telegramConnection && telegramConnection.isActive);

  return (
    <div className="mx-auto space-y-8">
      <SettingsHeader
        eyebrow="Telegram Integration"
        title="Telegram & Hermes Agent"
        description="Hubungkan Telegram sebagai jembatan identitas untuk mengakses data Lamarin Anda melalui Hermes Agent. Install skill: npx skills add vergiLgood1/lamarin --skill lamarin"
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
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">Status Koneksi</h2>

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
                      ? "Telegram terhubung. Hermes Agent dapat mengakses data Lamarin Anda melalui chat ID ini."
                      : "Hubungkan Telegram untuk memungkinkan Hermes Agent mengakses data Lamaran Anda."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Step-by-step guide */}
          <Card className="rounded-3xl border-border/60">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-1">
                <h2 className="font-semibold">Cara Menggunakan</h2>
                <p className="text-sm text-muted-foreground">
                  Hubungkan Lamarin dengan Hermes Agent untuk mengelola lamaran
                  via Telegram.
                </p>
              </div>

              <ol className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Install Hermes Agent",
                    description:
                      "Install Hermes Agent di server atau VPS Anda.",
                    href: `${HERMES_DOCS_URL}/getting-started/installation`,
                    linkLabel: "Lihat panduan install",
                  },
                  {
                    step: 2,
                    title: "Dapatkan Chat ID",
                    description:
                      "Chat dengan @userinfobot di Telegram, bot akan mengirimkan Chat ID Anda.",
                    href: "https://t.me/userinfobot",
                    linkLabel: "Buka @userinfobot",
                  },
                  {
                    step: 3,
                    title: "Masukkan Chat ID",
                    description:
                      "Salin Chat ID dari bot Telegram ke form di samping, lalu klik Connect.",
                    href: null,
                    linkLabel: null,
                  },
                  {
                    step: 4,
                    title: "Install Skill Lamarin",
                    description:
                      "Jalankan npx skills add vergiLgood1/lamarin --skill lamarin untuk memasang skill ke Hermes Agent.",
                    href: "https://www.npmjs.com/package/skills",
                    linkLabel: "Apa itu npx skills?",
                  },
                  {
                    step: 5,
                    title: "Set Environment Variables",
                    description:
                      "Set LAMARIN_API_URL dan LAMARIN_API_KEY di lingkungan Hermes Agent.",
                    href: `${HERMES_DOCS_URL}/user-guide/configuration`,
                    linkLabel: "Panduan konfigurasi",
                  },
                  {
                    step: 6,
                    title: "Mulai Chat dengan Hermes",
                    description:
                      "Sekarang kamu bisa chat dengan Hermes Agent via Telegram untuk mengelola lamaran, cek status, dan lainnya.",
                    href: null,
                    linkLabel: null,
                  },
                ].map((item) => (
                  <li
                    key={item.step}
                    className="flex items-start gap-3 rounded-2xl border border-border/60 p-4"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {item.step}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      {item.href && (
                        <Link
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          {item.linkLabel}
                          <ExternalLink className="size-3" />
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          {/* Reference links */}
          <Card className="rounded-3xl border-border/60">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-1">
                <h2 className="font-semibold">Referensi</h2>
                <p className="text-sm text-muted-foreground">
                  Dokumentasi lengkap Hermes Agent dan Lamarin API.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: BookOpen,
                    title: "Dokumentasi Hermes Agent",
                    href: HERMES_DOCS_URL,
                    description: "Panduan lengkap install, konfigurasi, dan penggunaan.",
                  },
                  {
                    icon: Search,
                    title: "Skills System",
                    href: `${HERMES_DOCS_URL}/developer-guide/creating-skills`,
                    description: "Cara membuat dan memasang skills untuk Hermes Agent.",
                  },
                  {
                    icon: MessageCircleMore,
                    title: "Messaging Gateway",
                    href: `${HERMES_DOCS_URL}/user-guide/messaging`,
                    description: "Konfigurasi Telegram dan platform messaging lainnya.",
                  },
                  {
                    icon: ExternalLink,
                    title: "Lamarin API Reference",
                    href: "https://github.com/vergiLgood1/lamarin",
                    description:
                      "Daftar endpoint API untuk akses data lamaran.",
                  },
                ].map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 rounded-2xl border border-border/60 p-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">{link.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      </div>

                      <ExternalLink className="ml-auto mt-1 size-4 shrink-0 text-muted-foreground" />
                    </Link>
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
