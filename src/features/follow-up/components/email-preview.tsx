"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteFollowUpEmail,
  sendFollowUpEmail,
} from "@/features/follow-up/actions/mutations";
import { EllipsisVertical, Loader2, Pencil, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

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

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", { timeZone: "UTC" });

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
      <CardContent>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {emails.map((email) => {
            const createdAtDisplay = DATE_FORMATTER.format(new Date(email.createdAt));
            const sentAtDisplay = email.sentAt
              ? DATE_FORMATTER.format(new Date(email.sentAt))
              : null;

            return (
              <Link
              key={email.id}
              href={`/dashboard/follow-ups/compose/${email.id}`}
              className="block space-y-2 rounded-md border p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium hover:underline">
                    {email.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ke: {email.recipientEmail} | {email.companyName} -{" "}
                    {email.position}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Badge
                    variant={email.status === "sent" ? "default" : "secondary"}
                  >
                    {STATUS_LABELS[email.status] || email.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                        >
                          <EllipsisVertical className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/dashboard/follow-ups/compose/${email.id}?mode=edit`}
                          >
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </Link>
                        }
                      />
                      {email.status === "draft" ? (
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleSend(email.id);
                          }}
                        >
                          <Send className="mr-2 size-4" />
                          Kirim
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleDelete(email.id);
                        }}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <p className="line-clamp-2 text-sm text-muted-foreground">
                {email.body}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {createdAtDisplay}
                  {sentAtDisplay ? ` | Terkirim: ${sentAtDisplay}` : ""}
                </span>
                {email.status === "draft" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleSend(email.id);
                    }}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-1 size-3 animate-spin" />
                    ) : (
                      <Send className="mr-1 size-3" />
                    )}
                    Kirim
                  </Button>
                ) : null}
              </div>
            </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
