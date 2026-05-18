import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  type LucideProps,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type Integration = {
  title: string;
  description: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  connected: boolean;
  badge: string;
};

const IntegrationCard: React.FC<{ integration: Integration }> = ({
  integration,
}) => {
  const Icon = integration.icon;
  return (
    <Card
      className={cn(
        "relative h-full overflow-hidden rounded-3xl border transition-all duration-200",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl border",
              integration.connected
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            <Icon className="size-6" />
          </div>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px]",
              integration.connected
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {integration.connected ? (
              <CheckCircle2 className="mr-1 size-3.5" />
            ) : (
              <XCircle className="mr-1 size-3.5" />
            )}

            {integration.badge}
          </Badge>
        </div>

        <div className="mt-5 flex-1 space-y-2">
          <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
            {integration.title}
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {integration.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <span className="text-sm font-medium">Kelola Integrasi</span>

          <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
