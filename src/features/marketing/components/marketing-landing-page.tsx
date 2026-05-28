import {
  Bot,
  CalendarDays,
  Database,
  FileText,
  Mail,
  Orbit
} from "lucide-react";

const featureCards = [
  {
    title: "Application tracker",
    description:
      "Record companies, positions, job sources, status, work type, HR contacts, salary, notes, and supporting documents.",
    icon: FileText,
  },
  {
    title: "Process dashboard",
    description:
      "View status summaries, activities, most-applied positions, job sources, timelines, and upcoming schedules.",
    icon: Orbit,
  },
  {
    title: "Follow-up email drafts",
    description:
      "Select application data, use a template, generate a draft with AI, then save it as a draft or send it via Resend.",
    icon: Mail,
  },
  {
    title: "Google Calendar",
    description:
      "Connect a Google account to create, update, and delete follow-up or interview events from application data.",
    icon: CalendarDays,
  },
  {
    title: "Telegram reminders",
    description:
      "Add a Telegram chat for H-1 and H-0 follow-up reminders through the bot once the configuration is active.",
    icon: Bot,
  },
  {
    title: "Portable data",
    description:
      "An export feature is available in settings so application records are not locked into a single view.",
    icon: Database,
  },
];

const workflowItems = [
  "Save application details and documents.",
  "Track status and activity from the dashboard.",
  "Create follow-up drafts based on existing context.",
  "Sync schedules and enable reminders when needed.",
];

export function MarketingLandingPage() {
  return (
    <main className="dark min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative isolate min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      </section>
    </main>
  );
}
