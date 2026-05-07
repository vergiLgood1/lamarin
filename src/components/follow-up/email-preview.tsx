"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sendFollowUpEmail, deleteFollowUpEmail } from "@/actions/follow-up/mutations";
import { toast } from "sonner";
import { Send, Trash2, Loader2 } from "lucide-react";

interface EmailPreviewProps {
  emails: {
    id: string;
    subject: string;
    body: string;
    recipientEmail: string;
    status: string;
    mode: string;
    sentAt: Date | null;
    createdAt: Date;
    companyName: string | null;
    position: string | null;
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  scheduled: "Dijadwalkan",
  sent: "Terkirim",
  failed: "Gagal",
};

export function EmailPreview({ emails }: EmailPreviewProps) {
  const [isPending, startTransition] = useTransition();

  function handleSend(emailId: string) {
    startTransition(async () => {
      const result = await sendFollowUpEmail(emailId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Gagal mengirim email");
      }
    });
  }

  function handleDelete(emailId: string) {
    if (!confirm("Hapus email ini?")) return;
    startTransition(async () => {
      const result = await deleteFollowUpEmail(emailId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Gagal menghapus email");
      }
    });
  }

  if (emails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Belum ada email follow-up
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {emails.map((email) => (
          <div key={email.id} className="rounded-md border p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{email.subject}</p>
                <p className="text-xs text-muted-foreground">
                  Ke: {email.recipientEmail} | {email.companyName} -{" "}
                  {email.position}
                </p>
              </div>
              <Badge
                variant={email.status === "sent" ? "default" : "secondary"}
              >
                {STATUS_LABELS[email.status] || email.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {email.body}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {new Date(email.createdAt).toLocaleDateString("id-ID")}
                {email.sentAt &&
                  ` | Terkirim: ${new Date(email.sentAt).toLocaleDateString("id-ID")}`}
              </span>
              <div className="flex gap-2">
                {email.status === "draft" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSend(email.id)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="mr-1 h-3 w-3" />
                    )}
                    Kirim
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDelete(email.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
