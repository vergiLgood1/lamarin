import { buttonVariants } from "@/components/ui/button";
import { getApplications } from "@/features/applications/actions/queries";
import { getFollowUpSchedules } from "@/features/follow-up/actions/queries";
import { UnifiedFollowUpForm } from "@/features/follow-up/components/unified-follow-up-form";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function FollowUpComposeNewPage() {
  const [{ data: applications }, schedules] = await Promise.all([
    getApplications({ limit: 100 }),
    getFollowUpSchedules(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Compose Follow-up
          </h1>
          <p className="text-sm text-muted-foreground">
            Buat follow-up email dan pilih untuk kirim sekarang, simpan draft, atau jadwalkan pengiriman.
          </p>
        </div>
        <Link
          href="/dashboard/follow-ups/compose"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full sm:w-auto",
          )}
        >
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Link>
      </div>

      <UnifiedFollowUpForm applications={applications} schedules={schedules} />
    </div>
  );
}
