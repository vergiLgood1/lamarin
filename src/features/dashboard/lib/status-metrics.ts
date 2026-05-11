export interface StatusMetricItem {
  status: string;
  count: number;
}

export interface StatusMetrics {
  appliedCount: number;
  interviewCount: number;
  rejectedCount: number;
}

export function getStatusMetrics(items: StatusMetricItem[]): StatusMetrics {
  return {
    appliedCount: items.find((item) => item.status === "applied")?.count ?? 0,
    interviewCount: items.find((item) => item.status === "interview")?.count ?? 0,
    rejectedCount: items.find((item) => item.status === "rejected")?.count ?? 0,
  };
}
