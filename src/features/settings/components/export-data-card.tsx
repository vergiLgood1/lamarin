"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { exportToCSV, exportToExcel } from "@/features/export/actions/mutations";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function ExportDataCard() {
  async function handleExportCSV() {
    try {
      const csv = await exportToCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applyorbit-export-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Data berhasil di-export ke CSV");
    } catch {
      toast.error("Gagal export data");
    }
  }

  async function handleExportExcel() {
    try {
      const base64 = await exportToExcel();
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applyorbit-export-${new Date().toISOString().split("T")[0]}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Data berhasil di-export ke Excel");
    } catch {
      toast.error("Gagal export data");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>
          Download semua data lamaran Anda dalam format spreadsheet
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 size-4" />
          Export ke CSV
        </Button>
        <Button variant="outline" onClick={handleExportExcel}>
          <Download className="mr-2 size-4" />
          Export ke Excel
        </Button>
      </CardContent>
    </Card>
  );
}
