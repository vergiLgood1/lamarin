import { buttonVariants } from "@/components/ui/button";
import { getApplications } from "@/features/applications/actions/queries";
import { getFollowUpSchedules } from "@/features/follow-up/actions/queries";
import { UnifiedFollowUpForm } from "@/features/follow-up/components/unified-follow-up-form";
import { cn } from "@/lib/utils";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default async function FollowUpComposeNewPage() {
  const [{ data: applications }, schedules] = await Promise.all([
    getApplications({ limit: 100 }),
    getFollowUpSchedules(),
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 px-6 py-5 rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mail className="size-5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Follow-up Email
                </h2>

                <p className="text-sm text-muted-foreground">
                  Kelola draft, kirim email, dan schedule follow-up.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/follow-ups/compose"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full rounded-2xl border-border/60 bg-background/70 backdrop-blur sm:w-auto",
              )}
            >
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Link>
          </div>
        </div>
      </div>

      <UnifiedFollowUpForm applications={applications} schedules={schedules} />
    </div>
  );
}
