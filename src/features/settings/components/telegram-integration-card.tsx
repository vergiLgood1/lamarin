"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  connectTelegram,
  disconnectTelegram,
  testTelegramConnection,
} from "@/features/telegram/actions/mutations";
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
    <Card>
      <CardHeader>
        <CardTitle>Telegram Reminder</CardTitle>
        <CardDescription>Notifikasi follow-up H-1 dan H-0 via Telegram</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await connectTelegram(formData);
              if (result.success) toast.success(result.message);
              else toast.error(result.message);
            });
          }}
          className="space-y-3"
        >
          <div className="space-y-2">
            <Label htmlFor="chatId">Chat ID</Label>
            <Input id="chatId" name="chatId" defaultValue={props.chatId} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username (opsional)</Label>
            <Input id="username" name="username" defaultValue={props.username} />
          </div>
          <Button type="submit" variant="outline" disabled={isPending}>
            {props.isConnected ? "Update Telegram" : "Connect Telegram"}
          </Button>
        </form>
        {props.isConnected && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={async () => {
                const result = await testTelegramConnection();
                if (result.success) toast.success(result.message);
                else toast.error(result.message);
              }}
            >
              Test Notifikasi
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                const result = await disconnectTelegram();
                if (result.success) toast.success(result.message);
                else toast.error(result.message);
              }}
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
