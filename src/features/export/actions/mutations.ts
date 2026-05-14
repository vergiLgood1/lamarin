"use server";

import { getSession } from "@/lib/auth-server";
import { logger } from "@/lib/logger";
import { getExportData } from "./queries";
import * as XLSX from "xlsx";

export async function exportToCSV(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const data = await getExportData(filters);

  const csvHeaders = [
    "No",
    "Tanggal Lamar",
    "Nama Perusahaan",
    "Lokasi Perusahaan",
    "Mode Kerja",
    "Posisi",
    "Sumber Lowongan",
    "Tanggal Follow Up",
    "Status Lamaran",
    "Kontak/Email HR",
    "Gaji",
    "Catatan",
    "Link Zoom/Meet",
  ];

  const csvRows = data.map((item, index) => [
    index + 1,
    item.applicationDate,
    item.companyName,
    item.companyLocation || "",
    item.workMode || "",
    item.position,
    item.jobSource || "",
    item.followUpDate || "",
    item.status,
    item.hrContact || "",
    item.salary || "",
    item.notes || "",
    item.meetingLink || "",
  ]);

  const csvContent = [
    csvHeaders.join(","),
    ...csvRows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  logger.info("Data exported to CSV", {
    userId: session.user.id,
    rowCount: data.length,
  });

  return csvContent;
}

export async function exportToExcel(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const data = await getExportData(filters);

  const worksheetData = [
    [
      "No",
      "Tanggal Lamar",
      "Nama Perusahaan",
      "Lokasi Perusahaan",
      "Mode Kerja",
      "Posisi",
      "Sumber Lowongan",
      "Tanggal Follow Up",
      "Status Lamaran",
      "Kontak/Email HR",
      "Gaji",
      "Catatan",
      "Link Zoom/Meet",
    ],
    ...data.map((item, index) => [
      index + 1,
      item.applicationDate,
      item.companyName,
      item.companyLocation || "",
      item.workMode || "",
      item.position,
      item.jobSource || "",
      item.followUpDate || "",
      item.status,
      item.hrContact || "",
      item.salary || "",
      item.notes || "",
      item.meetingLink || "",
    ]),
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 25 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 30 },
    { wch: 25 },
    { wch: 35 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Lamaran Kerja");

  const buffer = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });

  logger.info("Data exported to Excel", {
    userId: session.user.id,
    rowCount: data.length,
  });

  return buffer;
}
