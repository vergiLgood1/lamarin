import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>
          Daftar lamaran terbaru Anda berdasarkan tanggal melamar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="flex h-28 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Belum ada data lamaran.
          </div>
        ) : (
          <div className="rounded-md border">
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
                    <TableCell className="text-sm">{application.applicationDate}</TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/applications/${application.id}`}
                        className="hover:underline"
                      >
                        {application.companyName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{application.position}</TableCell>
                    <TableCell>
                      <StatusBadge status={application.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
