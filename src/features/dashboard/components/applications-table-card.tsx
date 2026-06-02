"use client";

import {
  DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/features/applications/components/status-badge";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import type { JobApplication } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface ApplicationsTableCardProps {
  applications: JobApplication[];
  itemsPerPage?: number;
}

export function ApplicationsTableCard({
  applications,
  itemsPerPage = 5,
}: ApplicationsTableCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = applications.slice(startIndex, endIndex);

  function handlePrevPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  function handleNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  return (
    <DataTable
      title="Applications"
      description="Daftar lamaran terbaru Anda berdasarkan tanggal melamar."
      isEmpty={applications.length === 0}
      pagination={{
        page: currentPage,
        totalPages,
        totalItems: applications.length,
        startItem: startIndex + 1,
        endItem: Math.min(endIndex, applications.length),
        itemLabel: "applications",
        onPreviousPage: handlePrevPage,
        onNextPage: handleNextPage,
      }}
      emptyState={
        <DashboardEmptyState
          className="min-h-[260px]"
          message="Belum ada data lamaran."
        />
      }
      scrollClassName="h-[52vh] min-h-[260px] max-h-[420px] lg:h-full lg:max-h-none"
    >
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Perusahaan</TableHead>
          <TableHead>Posisi</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentApplications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="text-sm">
              {application.applicationDate}
            </TableCell>
            <TableCell className="font-medium">
              <Link
                href={`/dashboard/applications/${application.id}`}
                className="hover:underline"
              >
                {application.companyName}
              </Link>
            </TableCell>
            <TableCell className="text-sm">{application.position}</TableCell>
            <TableCell>
              <StatusBadge status={application.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}
