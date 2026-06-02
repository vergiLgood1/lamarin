import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  label?: string;
  className?: string;
}

export function PageLoader({ label = "Loading...", className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
