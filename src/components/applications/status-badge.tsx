import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: {
    label: "Melamar",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  reviewed: {
    label: "Direview",
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  },
  interview: {
    label: "Interview",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  },
  test: {
    label: "Tes",
    className: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
  },
  offered: {
    label: "Offering",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  },
  accepted: {
    label: "Diterima",
    className: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  },
  withdrawn: {
    label: "Dibatalkan",
    className: "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400",
  },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant="outline" className={config.className}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
