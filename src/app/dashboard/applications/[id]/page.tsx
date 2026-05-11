import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getApplicationById,
  getApplicationDocuments,
} from "@/features/applications/actions/queries";
import { StatusBadge } from "@/features/applications/components/status-badge";
import { cn } from "@/lib/utils";
import { ArrowLeft, ExternalLink, FileText, Image, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [application, documents] = await Promise.all([
    getApplicationById(id),
    getApplicationDocuments(id),
  ]);

  if (!application) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/applications"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Link>
        <Link
          href={`/dashboard/applications/${id}/edit`}
          className={cn(buttonVariants())}
        >
          <Pencil className="mr-2 h-4 w-4" />
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
            <DetailItem label="Lokasi" value={application.location} />
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
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  render={
                    <a
                      href={application.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  {application.meetingLink}
                  <ExternalLink className="h-3 w-3" />
                </Button>
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
                    <Button
                      key={doc.id}
                      variant="outline"
                      className="flex h-auto w-full items-center justify-start gap-2 p-2"
                      render={
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      {doc.fileType.startsWith("image/") ? (
                        <Image className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-medium truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground font-normal">
                          {doc.documentType}
                        </p>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </Button>
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
            <span>
              Dibuat:{" "}
              {new Date(application.createdAt).toLocaleDateString("id-ID")}
            </span>
            <span>
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
