import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApplications } from "@/features/applications/actions/queries";
import {
  getFollowUpEmails,
  getFollowUpSchedules,
} from "@/features/follow-up/actions/queries";
import { EmailComposer } from "@/features/follow-up/components/email-composer";
import { EmailPreview } from "@/features/follow-up/components/email-preview";
import { ScheduleForm } from "@/features/follow-up/components/schedule-form";

export default async function FollowUpsPage() {
  const [emails, schedules, { data: applications }] = await Promise.all([
    getFollowUpEmails(),
    getFollowUpSchedules(),
    getApplications({ limit: 100 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Follow-up Email</h1>
        <p className="text-sm text-muted-foreground">
          Kelola email follow-up lamaran kerja Anda
        </p>
      </div>

      <Tabs defaultValue="compose">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
          <TabsTrigger value="schedule">Jadwal Otomatis</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-4">
          <EmailComposer applications={applications} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <EmailPreview emails={emails} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <ScheduleForm applications={applications} schedules={schedules} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
