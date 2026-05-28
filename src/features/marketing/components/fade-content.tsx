import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type FadeContentProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FadeContent({ children, className, delay = 0 }: FadeContentProps) {
  return (
    <div
      className={cn("animate-in fade-in slide-in-from-bottom-4 fill-mode-both", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
