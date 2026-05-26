import { getApplications } from "@/features/applications/actions/queries";
import { SendEmailForm } from "@/features/email/components/send-email-form";
import { MailPlus } from "lucide-react";

export default async function SendEmailPage() {
  const { data: applications } = await getApplications({
    limit: 100,
    sortBy: "applicationDate",
    sortOrder: "desc",
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-muted/30 px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MailPlus className="size-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Kirim Email</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Buat email dari data lamaran, pilih template, generate dengan AI,
              lalu kirim langsung, simpan draft, atau jadwalkan pengiriman.
            </p>
          </div>
        </div>
      </div>

      <SendEmailForm applications={applications} />
    </div>
  );
}
