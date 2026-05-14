import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

const TODAY = new Date();

export default function DashboardCalendar() {
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle className="sr-only">Kalender</CardTitle>
        <CardDescription className="sr-only">
          Jadwal follow-up dan interview mendatang
        </CardDescription>
      </CardHeader> */}
      <CardContent className="flex justify-center">
        <Calendar mode="single" selected={TODAY} className="p-0" />
      </CardContent>
    </Card>
  );
}
