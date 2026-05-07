import Link from "next/link";
import { getApplications } from "@/actions/applications/queries";
import { ApplicationTable } from "@/components/applications/application-table";
import { FilterBar } from "@/components/applications/filter-bar";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const { data: applications, pagination } = await getApplications({
    search: params.search,
    status: params.status as ApplicationStatus | undefined,
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lamaran Kerja</h1>
          <p className="text-sm text-muted-foreground">
            Kelola semua data lamaran kerja Anda
          </p>
        </div>
        <Link href="/applications/new" className={cn(buttonVariants())}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Lamaran
        </Link>
      </div>

      <FilterBar />

      <ApplicationTable applications={applications} />

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {applications.length} dari {pagination.total} data
          </p>
          <div className="flex gap-2">
            {pagination.page > 1 && (
              <Link
                href={`/applications?page=${pagination.page - 1}${params.search ? `&search=${params.search}` : ""}${params.status ? `&status=${params.status}` : ""}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Sebelumnya
              </Link>
            )}
            {pagination.page < pagination.totalPages && (
              <Link
                href={`/applications?page=${pagination.page + 1}${params.search ? `&search=${params.search}` : ""}${params.status ? `&status=${params.status}` : ""}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Selanjutnya
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
