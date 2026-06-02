"use client";

import { Button } from "@/components/ui/button";
import {
  DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteApplication } from "@/features/applications/actions/mutations";
import type { JobApplication } from "@/types";
import { Eye, FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { StatusBadge } from "./status-badge";

interface ApplicationTableProps {
  applications: JobApplication[];
  itemsPerPage?: number;
}

export function ApplicationTable({
  applications,
  itemsPerPage = 10,
}: ApplicationTableProps) {
  const [isPending, startTransition] = useTransition();
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

  function handleDelete(id: string, companyName: string) {
    if (!confirm(`Hapus lamaran di ${companyName}?`)) return;

    startTransition(async () => {
      const result = await deleteApplication(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Gagal menghapus lamaran");
      }
    });
  }

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <FileText className="size-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold">Belum Ada Lamaran</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Mulai lacak perjalanan karir Anda dengan menambahkan lamaran pertama.
      </p>
    </div>
  );

  return (
    <DataTable
      isEmpty={applications.length === 0}
      emptyState={emptyState}
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
      scrollClassName="h-[560px]"
    >
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Perusahaan</TableHead>
          <TableHead>Posisi</TableHead>
          <TableHead className="hidden md:table-cell">Lokasi</TableHead>
          <TableHead className="hidden md:table-cell">Mode</TableHead>
          <TableHead className="hidden lg:table-cell">Sumber</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentApplications.map((app) => (
          <TableRow key={app.id} className="transition-colors hover:bg-muted/50">
            <TableCell className="text-sm">{app.applicationDate}</TableCell>
            <TableCell className="font-medium">{app.companyName}</TableCell>
            <TableCell className="text-sm">{app.position}</TableCell>
            <TableCell className="hidden text-sm md:table-cell">
              {app.companyLocation || "-"}
            </TableCell>
            <TableCell className="hidden text-sm md:table-cell">
              {app.workMode || "-"}
            </TableCell>
            <TableCell className="hidden text-sm lg:table-cell">
              {app.jobSource || "-"}
            </TableCell>
            <TableCell>
              <StatusBadge status={app.status} />
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={isPending}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    render={<Link href={`/dashboard/applications/${app.id}`} />}
                  >
                    <Eye className="mr-2 size-4" />
                    Lihat Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link href={`/dashboard/applications/${app.id}/edit`} />}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDelete(app.id, app.companyName)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}
