import { Badge } from "@/components/ui/badge";
import type { EmailStatus } from "@/types";

const STATUS_CONFIG: Record<
  EmailStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  sent: {
    label: "Sent",
    className: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  },
};

interface EmailStatusBadgeProps {
  status: EmailStatus;
}

export function EmailStatusBadge({ status }: EmailStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant="outline" className={config.className}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
