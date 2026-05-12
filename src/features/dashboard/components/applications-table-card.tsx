import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/features/applications/components/status-badge";
import type { JobApplication } from "@/types";
import Link from "next/link";

interface ApplicationsTableCardProps {
  applications: JobApplication[];
}

export function ApplicationsTableCard({ applications }: ApplicationsTableCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>
          Daftar lamaran terbaru Anda berdasarkan tanggal melamar.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        {applications.length === 0 ? (
          <div className="flex h-28 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada data lamaran.
          </div>
        ) : (
          <ScrollArea className="h-[52vh] min-h-[260px] max-h-[420px] rounded-md border lg:h-full lg:max-h-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Perusahaan</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="text-sm">
                      {application.applicationDate}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/applications/${application.id}`}
                        className="hover:underline"
                      >
                        {application.companyName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {application.position}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={application.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
