import {
  Bell,
  CalendarDays,
  FileText,
  Mail,
  Stars,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface WorkflowCard {
  step: string;
  title: string;
  description: string;
}

export interface IntegrationCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Integrations", href: "#integrations" },
  { label: "FAQ", href: "#faq" },
];

export const statusItems: string[] = [
  "Applied",
  "Reviewed",
  "Interview",
  "Test",
  "Offered",
  "Rejected",
];

export const featureCards: FeatureCard[] = [
  {
    icon: Workflow,
    title: "Application tracking",
    description:
      "Save company, position, status, application source, work mode, salary, HR contact, and notes.",
  },
  {
    icon: Mail,
    title: "Follow-up email",
    description:
      "Create follow-up drafts tied directly to the application context.",
  },
  {
    icon: CalendarDays,
    title: "Calendar schedule",
    description:
      "Track interviews, deadlines, and follow-ups so important dates stay visible.",
  },
  {
    icon: FileText,
    title: "Application documents",
    description:
      "Attach CVs, portfolios, cover letters, and other documents to the related application.",
  },
];

export const workflowCards: WorkflowCard[] = [
  {
    step: "01",
    title: "Record application",
    description:
      "Enter position, company, job source, status, documents, and important notes.",
  },
  {
    step: "02",
    title: "Monitor status",
    description:
      "View application progress from Applied, Reviewed, Interview, Test, to Offered or Rejected.",
  },
  {
    step: "03",
    title: "Prepare follow-up",
    description:
      "Use application context to create professional email drafts that you can edit.",
  },
];

export const integrationCards: IntegrationCard[] = [
  {
    icon: CalendarDays,
    title: "Google Calendar",
    description: "Create and manage events for follow-ups, interviews, or deadlines.",
  },
  {
    icon: Bell,
    title: "Telegram Reminder",
    description: "Send reminders one day before and on the day to your existing channel.",
  },
  {
    icon: Stars,
    title: "Gemini AI Draft",
    description: "AI helps write draft emails, not make recruitment decisions.",
  },
];

export const faqs: FAQ[] = [
  {
    question: "Does Lamarin apply for jobs automatically?",
    answer:
      "No. Lamarin helps record and manage the application process, not submit applications automatically.",
  },
  {
    question: "Does the AI decide whether I'll be hired?",
    answer:
      "No. AI only helps draft follow-up emails. You still review, edit, and decide.",
  },
  {
    question: "Can I export my application data?",
    answer:
      "Yes. Lamarin is designed so users can keep access to their own application data.",
  },
];

export const targetAudiences: string[] = [
  "Fresh graduates",
  "Career switchers",
  "Freelancers",
];
