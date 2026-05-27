import { Button } from "@/components/ui/button";
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
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Email</CardTitle>
        <CardDescription>
          Email yang pernah dikirim atau disimpan sebagai draft.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emails.length === 0 ? (
          <DashboardEmptyState
            className="min-h-[320px]"
            message="Belum ada email. Buat email pertama dari data lamaran."
          />
        ) : (
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
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/follow-ups/compose/${email.id}`}>
                            <Eye className="size-4" />
                            <span className="sr-only">Lihat email</span>
                          </Link>
                        </Button>
                        {email.status === "draft" ? (
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/follow-ups/compose/${email.id}`}>
                              <Pencil className="size-4" />
                              <span className="sr-only">Edit draft</span>
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
