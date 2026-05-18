import { Badge } from "@/components/ui/badge";

import type { LucideIcon } from "lucide-react";

type SettingsHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
};

export function SettingsHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: SettingsHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_35%)]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-4">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            <Icon className="mr-1 size-3.5" />
            {eyebrow}
          </Badge>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
        </div>

        {children ? (
          <div className="w-full shrink-0 lg:w-auto">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
