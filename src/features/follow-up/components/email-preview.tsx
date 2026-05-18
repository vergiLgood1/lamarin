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
import { cn } from "@/lib/utils";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  EllipsisVertical,
  LayoutGrid,
  List,
  Loader2,
  Mail,
  Pencil,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type EmailLayout = "grid" | "list";

const EMAILS_PER_PAGE = 6;

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

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  draft: {
    label: "Draft",
    icon: Clock3,
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  scheduled: {
    label: "Dijadwalkan",
    icon: CalendarDays,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  sent: {
    label: "Terkirim",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  failed: {
    label: "Gagal",
    icon: XCircle,
    className: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function EmailPreview({ emails }: EmailPreviewProps) {
  const [layout, setLayout] = useState<EmailLayout>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(emails.length / EMAILS_PER_PAGE);
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * EMAILS_PER_PAGE;
  const visibleEmails = emails.slice(pageStart, pageStart + EMAILS_PER_PAGE);
  const pageEnd = pageStart + visibleEmails.length;

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

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
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Riwayat Email</CardTitle>
          <CardDescription>
            Semua email follow-up akan muncul di sini.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <Mail className="size-8 text-muted-foreground" />
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-lg font-semibold">Belum ada email follow-up</h3>

            <p className="max-w-sm text-sm text-muted-foreground">
              Buat email follow-up pertama untuk mulai melacak komunikasi
              lamaran kerja kamu.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Riwayat Email</CardTitle>

          <CardDescription>
            Kelola dan pantau semua email follow-up lamaran kerja.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {emails.length} Email
          </Badge>

          <div className="flex rounded-2xl border bg-muted/40 p-1">
            <Button
              type="button"
              size="icon"
              variant={layout === "grid" ? "secondary" : "ghost"}
              className="size-8 rounded-xl"
              aria-label="Tampilkan sebagai kolom"
              aria-pressed={layout === "grid"}
              onClick={() => setLayout("grid")}
            >
              <LayoutGrid className="size-4" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant={layout === "list" ? "secondary" : "ghost"}
              className="size-8 rounded-xl"
              aria-label="Tampilkan sebagai baris"
              aria-pressed={layout === "list"}
              onClick={() => setLayout("list")}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          className={cn(
            "grid gap-4",
            layout === "grid"
              ? "sm:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {visibleEmails.map((email) => {
            const createdAtDisplay = DATE_FORMATTER.format(
              new Date(email.createdAt),
            );

            const sentAtDisplay = email.sentAt
              ? DATE_FORMATTER.format(new Date(email.sentAt))
              : null;

            const status = STATUS_CONFIG[email.status] || STATUS_CONFIG.draft;

            const StatusIcon = status.icon;

            return (
              <Link
                key={email.id}
                href={`/dashboard/follow-ups/compose/${email.id}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-200",
                  "hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  layout === "list" && "sm:p-6",
                )}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                      status.className,
                    )}
                  >
                    <StatusIcon className="size-3.5" />
                    {status.label}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-xl opacity-70 transition-opacity hover:opacity-100"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                        >
                          <EllipsisVertical className="size-4" />
                        </Button>
                      }
                    />

                    <DropdownMenuContent
                      align="end"
                      className="w-44 rounded-xl"
                    >
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/dashboard/follow-ups/compose/${email.id}?mode=edit`}
                            className="flex w-full items-center"
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
                          Kirim Email
                        </DropdownMenuItem>
                      ) : null}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
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

                <div
                  className={cn(
                    "mt-5 space-y-3",
                    layout === "list" &&
                      "sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] sm:gap-6 sm:space-y-0",
                  )}
                >
                  <div className="space-y-2">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                      {email.subject}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3.5" />
                        {email.recipientEmail}
                      </span>

                      {(email.companyName || email.position) && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="size-3.5" />
                          {email.companyName}
                          {email.position ? ` • ${email.position}` : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={cn(
                      "line-clamp-3 text-sm leading-relaxed text-muted-foreground",
                      layout === "list" && "sm:line-clamp-2",
                    )}
                  >
                    {email.body}
                  </p>
                </div>

                <div className="mt-5 flex items-end justify-between gap-3 border-t pt-4">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Dibuat {createdAtDisplay}</p>

                    {sentAtDisplay ? (
                      <p className="text-emerald-600 dark:text-emerald-400">
                        Terkirim {sentAtDisplay}
                      </p>
                    ) : (
                      <p>Belum dikirim</p>
                    )}
                  </div>

                  {email.status === "draft" ? (
                    <Button
                      size="sm"
                      className="rounded-xl"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        handleSend(email.id);
                      }}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 size-4" />
                      )}
                      Kirim
                    </Button>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>

        {totalPages > 1 ? (
          <div className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan {pageStart + 1}-{pageEnd} dari {emails.length} email
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-xl"
                aria-label="Halaman sebelumnya"
                disabled={activePage === 1}
                onClick={() => goToPage(activePage - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;

                  return (
                    <Button
                      key={page}
                      type="button"
                      variant={activePage === page ? "secondary" : "ghost"}
                      size="icon"
                      className="size-9 rounded-xl"
                      aria-label={`Halaman ${page}`}
                      aria-current={activePage === page ? "page" : undefined}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-xl"
                aria-label="Halaman berikutnya"
                disabled={activePage === totalPages}
                onClick={() => goToPage(activePage + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
