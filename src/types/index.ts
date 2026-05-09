import type {
  applicationDocuments,
  followUpEmails,
  followUpSchedules,
  jobApplications,
  user,
} from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof user>;
export type JobApplication = InferSelectModel<typeof jobApplications>;
export type FollowUpEmail = InferSelectModel<typeof followUpEmails>;
export type FollowUpSchedule = InferSelectModel<typeof followUpSchedules>;
export type ApplicationDocument = InferSelectModel<typeof applicationDocuments>;

export type ApplicationStatus =
  | "applied"
  | "reviewed"
  | "interview"
  | "test"
  | "offered"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type EmailStatus = "draft" | "scheduled" | "sent" | "failed";
export type EmailMode = "manual" | "automatic";

// ============================================
// Action State Types (for useActionState)
// ============================================

export type ActionState<TData = undefined> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: TData;
};

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  totalApplications: number;
  thisMonth: number;
  lastMonth: number;
  statusBreakdown: { status: string; count: number }[];
  topSources: { source: string; count: number }[];
  upcomingFollowUps: JobApplication[];
}

export interface ApplicationFilters {
  search?: string;
  status?: ApplicationStatus;
  startDate?: string;
  endDate?: string;
  location?: string;
  jobSource?: string;
  sortBy?: "applicationDate" | "companyName" | "status" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ColorScheme {
  id: string;
  label: string;
  color: string; // Preview dot color (hex/oklch for display)
}
