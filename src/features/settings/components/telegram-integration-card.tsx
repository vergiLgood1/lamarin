"use client";

import { Badge } from "@/components/ui/badge";
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
  connectTelegram,
  disconnectTelegram,
  testTelegramConnection,
} from "@/features/telegram/actions/mutations";

import { cn } from "@/lib/utils";

import {
  Bot,
  CheckCircle2,
  Loader2,
  SendHorizonal,
  Unplug,
  XCircle,
} from "lucide-react";

import { useTransition } from "react";
import { toast } from "sonner";

interface TelegramIntegrationCardProps {
  isConnected: boolean;
  chatId: string;
  username: string;
}

export function TelegramIntegrationCard(props: TelegramIntegrationCardProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="rounded-3xl border-border/60">
      <CardHeader className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-2xl border",
                props.isConnected
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              <Bot className="size-7" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-xl">Koneksi Telegram</CardTitle>

              <CardDescription className="max-w-lg leading-relaxed">
                Hubungkan Telegram sebagai identitas untuk mengakses data
                Lamarin Anda melalui Hermes Agent.
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3 py-1",
              props.isConnected
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {props.isConnected ? (
              <CheckCircle2 className="mr-1 size-3.5" />
            ) : (
              <XCircle className="mr-1 size-3.5" />
            )}

            {props.isConnected ? "Terhubung" : "Belum terhubung"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await connectTelegram(formData);

              if (result.success) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
            });
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="chatId">Chat ID</Label>

              <Input
                id="chatId"
                name="chatId"
                defaultValue={props.chatId}
                placeholder="Contoh: 123456789"
                className="h-11 rounded-xl"
                required
              />

              <p className="text-xs text-muted-foreground">
                Chat dengan @userinfobot di Telegram untuk mendapatkan Chat ID Anda.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username Telegram</Label>

              <Input
                id="username"
                name="username"
                defaultValue={props.username}
                placeholder="@username"
                className="h-11 rounded-xl"
              />

              <p className="text-xs text-muted-foreground">
                Opsional untuk identifikasi akun Telegram.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 rounded-xl px-5"
          >
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Bot className="mr-2 size-4" />
            )}

            {props.isConnected ? "Update Telegram" : "Connect Telegram"}
          </Button>
        </form>

        {props.isConnected && (
          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row">
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const result = await testTelegramConnection();

                  if (result.success) {
                    toast.success(result.message);
                  } else {
                    toast.error(result.message);
                  }
                });
              }}
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <SendHorizonal className="mr-2 size-4" />
              )}
              Test Notifikasi
            </Button>

            <Button
              variant="destructive"
              className="h-11 rounded-xl"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const result = await disconnectTelegram();

                  if (result.success) {
                    toast.success(result.message);
                  } else {
                    toast.error(result.message);
                  }
                });
              }}
            >
              <Unplug className="mr-2 size-4" />
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}