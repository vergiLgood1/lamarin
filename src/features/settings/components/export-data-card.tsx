"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  exportToCSV,
  exportToExcel,
} from "@/features/export/actions/mutations";

import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

export function ExportDataCard() {
  const [loadingType, setLoadingType] = useState<"csv" | "excel" | null>(null);

  async function handleExportCSV() {
    try {
      setLoadingType("csv");

      const csv = await exportToCSV();

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `applyorbit-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;

      link.click();

      URL.revokeObjectURL(url);

      toast.success("Data berhasil di-export ke CSV");
    } catch {
      toast.error("Gagal export data");
    } finally {
      setLoadingType(null);
    }
  }

  async function handleExportExcel() {
    try {
      setLoadingType("excel");

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

      link.download = `applyorbit-export-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      link.click();

      URL.revokeObjectURL(url);

      toast.success("Data berhasil di-export ke Excel");
    } catch {
      toast.error("Gagal export data");
    } finally {
      setLoadingType(null);
    }
  }

  return (
    <Card className="rounded-3xl border-border/60">
      <CardHeader className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">Export Data</CardTitle>

            <CardDescription className="max-w-lg leading-relaxed">
              Download seluruh data lamaran, follow-up, dan reminder dalam
              format spreadsheet.
            </CardDescription>
          </div>

          <Badge variant="outline" className="rounded-full px-3 py-1">
            <ShieldCheck className="mr-1 size-3.5" />
            Secure Export
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium">CSV Export</p>

                <p className="text-xs text-muted-foreground">
                  Format ringan & universal
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileSpreadsheet className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium">Excel Export</p>

                <p className="text-xs text-muted-foreground">
                  Cocok untuk analisis data
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="h-11 flex-1 rounded-xl"
          disabled={loadingType !== null}
          onClick={handleExportCSV}
        >
          {loadingType === "csv" ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          Export ke CSV
        </Button>

        <Button
          className="h-11 flex-1 rounded-xl"
          disabled={loadingType !== null}
          onClick={handleExportExcel}
        >
          {loadingType === "excel" ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 size-4" />
          )}
          Export ke Excel
        </Button>
      </CardContent>
    </Card>
  );
}