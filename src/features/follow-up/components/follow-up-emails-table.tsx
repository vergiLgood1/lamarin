"use client";

import { DataTable } from "@/components/ui/data-table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmailStatusBadge } from "@/features/follow-up/components/email-status-badge";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FollowUpEmail {
  id: string;
  applicationId: string | null;
  subject: string;
  recipientEmail: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentAt: Date | null;
  createdAt: Date;
  companyName: string | null;
  position: string | null;
}

interface FollowUpEmailsTableProps {
  emails: FollowUpEmail[];
  itemsPerPage?: number;
}

export function FollowUpEmailsTable({
  emails,
  itemsPerPage = 10,
}: FollowUpEmailsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(emails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmails = emails.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DataTable
      title="Recent Follow-Up Emails"
      description="Daftar email follow-up terbaru Anda."
      isEmpty={emails.length === 0}
      emptyState={
        <DashboardEmptyState
          className="min-h-[260px]"
          message="Belum ada email follow-up."
        />
      }
      scrollClassName="h-[420px]"
      pagination={{
        page: currentPage,
        totalPages,
        totalItems: emails.length,
        startItem: startIndex + 1,
        endItem: Math.min(endIndex, emails.length),
        itemLabel: "emails",
        onPreviousPage: handlePrevPage,
        onNextPage: handleNextPage,
      }}
    >
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Recipient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentEmails.map((email) => (
          <TableRow key={email.id}>
            <TableCell className="font-medium">
              {email.companyName || "-"}
            </TableCell>
            <TableCell className="text-sm">{email.position || "-"}</TableCell>
            <TableCell className="max-w-[200px] truncate text-sm">
              {email.subject}
            </TableCell>
            <TableCell className="text-sm">{email.recipientEmail}</TableCell>
            <TableCell>
              <EmailStatusBadge status={email.status} />
            </TableCell>
            <TableCell className="text-sm">
              {formatDate(email.sentAt || email.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/dashboard/follow-ups/compose/${email.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </Link>
                {email.status === "draft" && (
                  <Link href={`/dashboard/follow-ups/compose/${email.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}
