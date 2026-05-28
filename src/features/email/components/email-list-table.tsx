"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { getEmailTemplate } from "@/features/email/lib/templates";
import { EmailStatusBadge } from "@/features/follow-up/components/email-status-badge";
import { cn } from "@/lib/utils";
import { Eye, LayoutGrid, List, Mail, Pencil, Table2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type EmailListLayout = "table" | "card";

interface EmailListItem {
  id: string;
  subject: string;
  recipientEmail: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentAt: Date | null;
  createdAt: Date;
  companyName: string | null;
  position: string | null;
  templateKey?: string;
}

interface EmailListTableProps {
  emails: EmailListItem[];
}

function formatDate(date: Date | null): string {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EmailListTable({ emails }: EmailListTableProps) {
  const [layout, setLayout] = useState<EmailListLayout>("table");

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Daftar Email</CardTitle>
          <CardDescription>
            Email yang pernah dikirim atau disimpan sebagai draft.
          </CardDescription>
        </div>

        {emails.length > 0 ? (
          <div className="flex rounded-2xl border bg-muted/40 p-1">
            <Button
              type="button"
              size="icon"
              variant={layout === "table" ? "secondary" : "ghost"}
              className="size-8 rounded-xl"
              aria-label="Tampilkan sebagai table"
              aria-pressed={layout === "table"}
              onClick={() => setLayout("table")}
            >
              <Table2 className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={layout === "card" ? "secondary" : "ghost"}
              className="size-8 rounded-xl"
              aria-label="Tampilkan sebagai card"
              aria-pressed={layout === "card"}
              onClick={() => setLayout("card")}
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {emails.length === 0 ? (
          <DashboardEmptyState
            className="min-h-[320px]"
            message="Belum ada email. Buat email pertama dari data lamaran."
          />
        ) : layout === "table" ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">
                      {email.companyName || "-"}
                    </TableCell>
                    <TableCell>{email.position || "-"}</TableCell>
                    <TableCell>{getEmailTemplate(email.templateKey).label}</TableCell>
                    <TableCell className="max-w-[240px] truncate">
                      {email.subject}
                    </TableCell>
                    <TableCell>{email.recipientEmail}</TableCell>
                    <TableCell>
                      <EmailStatusBadge status={email.status} />
                    </TableCell>
                    <TableCell>{formatDate(email.sentAt || email.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/follow-ups/compose/${email.id}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                          )}
                        >
                          <Eye className="size-4" />
                          <span className="sr-only">Lihat email</span>
                        </Link>
                        {email.status === "draft" ? (
                          <Link
                            href={`/dashboard/follow-ups/compose/${email.id}`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "icon" }),
                            )}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit draft</span>
                          </Link>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {emails.map((email) => (
              <Link
                key={email.id}
                href={`/dashboard/follow-ups/compose/${email.id}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-200",
                  "hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                )}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-3">
                  <EmailStatusBadge status={email.status} />
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    {getEmailTemplate(email.templateKey).label}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                    {email.subject}
                  </h3>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="inline-flex items-center gap-2">
                      <Mail className="size-4" />
                      {email.recipientEmail}
                    </p>
                    <p className="line-clamp-1">
                      {email.companyName || "-"}
                      {email.position ? ` - ${email.position}` : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
                  <span>{formatDate(email.sentAt || email.createdAt)}</span>
                  <span className="inline-flex items-center gap-1 font-medium text-primary">
                    <List className="size-3.5" />
                    Detail
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
