import { buttonVariants } from "@/components/ui/button";
import { getApplications } from "@/features/applications/actions/queries";
import { ApplicationTable } from "@/features/applications/components/application-table";
import { FilterBar } from "@/features/applications/components/filter-bar";
 
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Lamaran Kerja</h1>
          <p className="text-sm text-muted-foreground">
            Kelola semua data lamaran kerja Anda
          </p>
        </div>
        <Link
          href="/dashboard/applications/new"
          className={cn(buttonVariants(), "w-full sm:w-auto")}
        >
          <Plus className="mr-2 size-4" />
          Tambah Lamaran
        </Link>
      </div>

      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      <ApplicationTable applications={applications} />

      {pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {applications.length} dari {pagination.total} data
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            {pagination.page > 1 && (
              <Link
                href={`/dashboard/applications?page=${pagination.page - 1}${params.search ? `&search=${params.search}` : ""}${params.status ? `&status=${params.status}` : ""}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 sm:flex-none")}
              >
                Sebelumnya
              </Link>
            )}
            {pagination.page < pagination.totalPages && (
              <Link
                href={`/dashboard/applications?page=${pagination.page + 1}${params.search ? `&search=${params.search}` : ""}${params.status ? `&status=${params.status}` : ""}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 sm:flex-none")}
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
