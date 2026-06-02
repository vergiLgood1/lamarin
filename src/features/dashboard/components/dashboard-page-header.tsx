import { Card, CardContent } from "@/components/ui/card";

export function DashboardPageHeader() {
  return (
    <Card>
      <CardContent>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan progres lamaran, follow-up, dan insight lamarin.
        </p>
      </CardContent>
    </Card>
  );
}
