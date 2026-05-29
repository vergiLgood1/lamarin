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

export interface ReminderItem {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
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
      "Record every application with company, role, status, source, contact, documents, and notes in one pipeline.",
  },
  {
    icon: CalendarDays,
    title: "Scheduled reminders",
    description:
      "Plan interview reminders, follow-up windows, and scheduled email sends with calendar support.",
  },
  {
    icon: Mail,
    title: "Follow-up email",
    description:
      "Generate follow-up drafts from application context, then send manually or schedule them for later.",
  },
  {
    icon: FileText,
    title: "Application documents",
    description:
      "Attach CVs, portfolios, cover letters, job notes, and other context to the right application.",
  },
];

export const workflowCards: WorkflowCard[] = [
  {
    step: "01",
    title: "Record application",
    description:
      "Save the company, role, source, status, documents, recruiter contact, and notes.",
  },
  {
    step: "02",
    title: "Generate follow-up",
    description:
      "Turn application context into a professional draft that stays ready for review.",
  },
  {
    step: "03",
    title: "Schedule reminders",
    description:
      "Send manually now, schedule email for later, or get reminders through calendar and messaging channels.",
  },
];

export const integrationCards: IntegrationCard[] = [
  {
    icon: CalendarDays,
    title: "Google Calendar",
    description:
      "Schedule interview reminders, follow-up windows, and email send dates.",
  },
  {
    icon: Bell,
    title: "Messaging reminders",
    description:
      "Send reminders through Telegram, WhatsApp, Discord, or other channels.",
  },
  {
    icon: Stars,
    title: "AI email draft",
    description: "Create contextual follow-up drafts while you stay in control.",
  },
];

export const faqs: FAQ[] = [
  {
    question: "Does Lamarin apply for jobs automatically?",
    answer:
      "No. Lamarin helps record and manage the application process, not submit job applications automatically.",
  },
  {
    question: "Can Lamarin send follow-up emails automatically?",
    answer:
      "You stay in control. Lamarin can help create drafts and schedule reviewed emails, but you decide what gets sent.",
  },
  {
    question: "Can reminders go to calendar or messaging apps?",
    answer:
      "Yes. The workflow is designed around calendar reminders and messaging channels such as Telegram, WhatsApp, or Discord.",
  },
];

export const targetAudiences: string[] = [
  "Fresh graduates",
  "Career switchers",
  "Freelancers",
];

export const reminders: ReminderItem[] = Array.from({ length: 8 }, () => [
  {
    name: "Interview reminder",
    description: "Frontend Developer at Acme",
    time: "Tomorrow",
    icon: "📅",
    color: "#1E86FF",
  },
  {
    name: "Send follow-up",
    description: "2 days after interview",
    time: "Fri",
    icon: "✉️",
    color: "#8B5CF6",
  },
  {
    name: "Take-home deadline",
    description: "Submit repository link",
    time: "5 PM",
    icon: "⏱️",
    color: "#F59E0B",
  },
  {
    name: "Recruiter check-in",
    description: "Ask for timeline update",
    time: "Mon",
    icon: "👤",
    color: "#00C9A7",
  },
  {
    name: "Application deadline",
    description: "Product Designer at Nova Labs",
    time: "Today",
    icon: "📝",
    color: "#EF4444",
  },
  {
    name: "Portfolio review",
    description: "Update case study before applying",
    time: "Tonight",
    icon: "💼",
    color: "#6366F1",
  },
  {
    name: "Technical interview",
    description: "Prepare React and TypeScript questions",
    time: "Wed",
    icon: "💻",
    color: "#14B8A6",
  },
  {
    name: "HR call",
    description: "Discuss salary expectation and availability",
    time: "10 AM",
    icon: "☎️",
    color: "#EC4899",
  },
  {
    name: "Offer review",
    description: "Compare benefits, salary, and work setup",
    time: "Next week",
    icon: "📄",
    color: "#22C55E",
  },
  {
    name: "Update resume",
    description: "Tailor resume for backend role",
    time: "Sat",
    icon: "📌",
    color: "#F97316",
  },
  {
    name: "Networking message",
    description: "Reach out to hiring manager on LinkedIn",
    time: "6 PM",
    icon: "🤝",
    color: "#0EA5E9",
  },
  {
    name: "Assessment result",
    description: "Check email for coding test feedback",
    time: "Tomorrow",
    icon: "📬",
    color: "#A855F7",
  },
  {
    name: "Final interview prep",
    description: "Review company values and product roadmap",
    time: "Thu",
    icon: "🎯",
    color: "#EAB308",
  },
  {
    name: "Document upload",
    description: "Upload CV, certificate, and transcript",
    time: "3 PM",
    icon: "📎",
    color: "#06B6D4",
  },
  {
    name: "Reference check",
    description: "Confirm contact details with previous mentor",
    time: "Mon",
    icon: "✅",
    color: "#10B981",
  },
  {
    name: "Job board scan",
    description: "Review new matching roles",
    time: "Morning",
    icon: "🔎",
    color: "#64748B",
  },

  // === DATA BARU DITAMBAHKAN ===
  {
    name: "Company research",
    description: "Research culture & recent news of TechVision",
    time: "Today",
    icon: "🔍",
    color: "#3B82F6",
  },
  {
    name: "Mock interview",
    description: "Practice behavioral questions with friend",
    time: "7 PM",
    icon: "🎤",
    color: "#8B5CF6",
  },
  {
    name: "LinkedIn optimization",
    description: "Update headline and about section",
    time: "Weekend",
    icon: "🔗",
    color: "#0A66C2",
  },
  {
    name: "Salary research",
    description: "Check market rate for Senior Frontend",
    time: "Tomorrow",
    icon: "💰",
    color: "#22C55E",
  },
  {
    name: "Follow up email",
    description: "Send thank you note to interviewer",
    time: "2 PM",
    icon: "📧",
    color: "#EC4899",
  },
  {
    name: "Side project deadline",
    description: "Finish dashboard UI for portfolio",
    time: "Fri",
    icon: "🚀",
    color: "#F59E0B",
  },
  {
    name: "Job application x3",
    description: "Apply to 3 new positions",
    time: "Morning",
    icon: "📤",
    color: "#EF4444",
  },
  {
    name: "GitHub cleanup",
    description: "Update repositories and READMEs",
    time: "Sat",
    icon: "🐙",
    color: "#181717",
  },
  {
    name: "Mentor meeting",
    description: "Career discussion with senior dev",
    time: "Wed 4 PM",
    icon: "🧠",
    color: "#14B8A6",
  },
  {
    name: "Visa document prep",
    description: "Prepare for potential relocation",
    time: "Next week",
    icon: "🛫",
    color: "#6366F1",
  },
  {
    name: "Skill gap analysis",
    description: "Identify skills needed for next level",
    time: "Sunday",
    icon: "📊",
    color: "#A855F7",
  },
  {
    name: "Contract review",
    description: "Review offer letter details",
    time: "Thu",
    icon: "📋",
    color: "#10B981",
  },
]).flat();

export const followUpDrafts = [
  "Hi Sarah, I wanted to follow up on my Frontend Developer application at Acme. I enjoyed learning about the team and would be happy to share more context about my portfolio.",
  "Thank you for the interview today. The product challenges you described match the kind of frontend work I enjoy, especially improving UX around complex workflows.",
  "Hi Jordan, checking in on the next steps for the Product Engineer role. I am still excited about the opportunity and available for any follow-up discussion this week.",
];

export const applicationStatuses = [
  "Applied",
  "Reviewed",
  "Interview",
  "Test",
  "Offered",
  "Rejected",
];
