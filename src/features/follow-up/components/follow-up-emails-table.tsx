"use client";

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
import { Button } from "@/components/ui/button";
import { EmailStatusBadge } from "@/features/follow-up/components/email-status-badge";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Recent Follow-Up Emails</CardTitle>
        <CardDescription>
          Daftar email follow-up terbaru Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 space-y-4">
        {emails.length === 0 ? (
          <DashboardEmptyState
            className="min-h-[260px]"
            message="Belum ada email follow-up."
          />
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
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
                      <TableCell className="text-sm">
                        {email.position || "-"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {email.subject}
                      </TableCell>
                      <TableCell className="text-sm">
                        {email.recipientEmail}
                      </TableCell>
                      <TableCell>
                        <EmailStatusBadge status={email.status} />
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(email.sentAt || email.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/follow-ups/compose/${email.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                          {email.status === "draft" && (
                            <Link href={`/dashboard/follow-ups/compose/${email.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
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
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, emails.length)} of{" "}
                  {emails.length} emails
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
