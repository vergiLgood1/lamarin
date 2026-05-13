interface DashboardEmptyStateProps {
  message: string;
  className?: string;
}

export function DashboardEmptyState({
  message,
  className = "min-h-56",
}: DashboardEmptyStateProps) {
  return (
    <div
      className={`flex ${className} items-center justify-center rounded-md border border-dashed text-center text-sm text-muted-foreground`}
    >
      {message}
    </div>
  );
}
