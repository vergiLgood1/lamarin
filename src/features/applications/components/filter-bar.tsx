"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "applied", label: "Melamar" },
  { value: "reviewed", label: "Direview" },
  { value: "interview", label: "Interview" },
  { value: "test", label: "Tes" },
  { value: "offered", label: "Offering" },
  { value: "accepted", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
  { value: "withdrawn", label: "Dibatalkan" },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset page on filter change
    router.push(`/dashboard/applications?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/dashboard/applications");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari perusahaan atau posisi..."
          defaultValue={search}
          className="pl-9"
          onChange={(e) => {
            const value = e.target.value;
            const timeout = setTimeout(() => {
              updateParams("search", value);
            }, 500);
            return () => clearTimeout(timeout);
          }}
        />
      </div>
      <Select value={status} onValueChange={(v) => updateParams("status", v || "all")}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(search || status !== "all") && (
        <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={clearFilters}>
          <X className="mr-1 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
