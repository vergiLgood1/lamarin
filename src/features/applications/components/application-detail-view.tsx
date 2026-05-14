import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/features/applications/components/status-badge";
import { cn } from "@/lib/utils";
import type { ApplicationDocument, JobApplication } from "@/types";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import Link from "next/link";

interface ApplicationDetailViewProps {
  application: JobApplication;
  documents: ApplicationDocument[];
}

export function ApplicationDetailView({
  application,
  documents,
}: ApplicationDetailViewProps) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/applications"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Link>
        <Link
          href={`/dashboard/applications/${application.id}/edit`}
          className={cn(buttonVariants())}
        >
          <Pencil className="mr-2 size-4" />
          Edit
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                {application.companyName}
              </CardTitle>
              <p className="text-muted-foreground">{application.position}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="Tanggal Lamar"
              value={application.applicationDate}
            />
            <DetailItem
              label="Lokasi Perusahaan"
              value={application.companyLocation}
            />
            <DetailItem label="Mode Kerja" value={application.workMode} />
            <DetailItem label="Sumber Lowongan" value={application.jobSource} />
            <DetailItem
              label="Tanggal Follow Up"
              value={application.followUpDate}
            />
            <DetailItem label="Kontak/Email HR" value={application.hrContact} />
            <DetailItem label="Gaji" value={application.salary} />
          </div>

          {application.meetingLink && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Link Zoom/Meet
                </p>
                <a
                  href={application.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                >
                  {application.meetingLink}
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </>
          )}

          {documents.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Dokumen ({documents.length})
                </p>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-start gap-2 rounded-lg border p-2 hover:bg-muted"
                    >
                      {doc.fileType.startsWith("image/") ? (
                        <ImageIcon className="size-4 text-muted-foreground" />
                      ) : (
                        <FileText className="size-4 text-muted-foreground" />
                      )}
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-medium">
                          {doc.fileName}
                        </p>
                        <p className="text-xs font-normal text-muted-foreground">
                          {doc.documentType}
                        </p>
                      </div>
                      <ExternalLink className="size-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {application.notes && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Catatan
                </p>
                <p className="whitespace-pre-wrap text-sm">
                  {application.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex gap-4 text-xs text-muted-foreground">
            <span suppressHydrationWarning>
              Dibuat:{" "}
              {new Date(application.createdAt).toLocaleDateString("id-ID")}
            </span>
            <span suppressHydrationWarning>
              Diperbarui:{" "}
              {new Date(application.updatedAt).toLocaleDateString("id-ID")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value || "-"}</p>
    </div>
  );
}
