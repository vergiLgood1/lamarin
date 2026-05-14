import { buttonVariants } from "@/components/ui/button";
import { TelegramIntegrationCard } from "@/features/settings/components/telegram-integration-card";
import { getTelegramConnection } from "@/features/telegram/actions/queries";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TelegramSettingsPage() {
  const telegramConnection = await getTelegramConnection().catch(() => null);

  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pengaturan Telegram Bot</h1>
          <p className="text-muted-foreground">
            Kelola koneksi bot dan pengiriman reminder follow-up.
          </p>
        </div>
        <Link
          href="/dashboard/settings"
          className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Link>
      </div>

      <TelegramIntegrationCard
        isConnected={!!(telegramConnection && telegramConnection.isActive)}
        chatId={telegramConnection?.chatId || ""}
        username={telegramConnection?.username || ""}
      />
    </div>
  );
}
