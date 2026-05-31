import { buttonVariants } from "@/components/ui/button";
import { getFollowUpEmails } from "@/features/follow-up/actions/queries";
import { EmailPreview } from "@/features/follow-up/components/email-preview";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function FollowUpsOverviewPage() {
  const emails = await getFollowUpEmails();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Follow-up Emails
          </h1>
          <p className="text-sm text-muted-foreground">
            Riwayat email follow-up Anda. Buat email baru lewat tombol Add.
          </p>
        </div>
        <Link
          href="/dashboard/follow-ups/compose/new"
          className={cn(buttonVariants(), "w-full sm:w-auto")}
        >
          <Plus className="mr-2 size-4" />
          Add
        </Link>
      </div>

      <EmailPreview emails={emails} />
    </div>
  );
}
