import { buttonVariants } from "@/components/ui/button";
import { getFollowUpEmails } from "@/features/follow-up/actions/queries";
import { EmailListTable } from "@/features/email/components/email-list-table";
import { cn } from "@/lib/utils";
import { MailPlus, Plus } from "lucide-react";
import Link from "next/link";

export default async function SendEmailPage() {
  const emails = await getFollowUpEmails();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-muted/30 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MailPlus className="size-5" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Kirim Email</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Kelola email lamaran yang sudah dikirim atau disimpan sebagai draft.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/send-email/new"
            className={cn(buttonVariants(), "w-full sm:w-auto")}
          >
            <Plus className="mr-2 size-4" />
            Buat Email
          </Link>
        </div>
      </div>

      <EmailListTable emails={emails} />
    </div>
  );
}
