import { z } from "zod";

// ============================================
// Application Schema
// ============================================

export const documentFileSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  key: z.string(),
  size: z.number(),
  type: z.string(),
});

export const applicationSchema = z.object({
  applicationDate: z.string().min(1, "Tanggal lamar wajib diisi"),
  companyName: z.string().min(1, "Nama perusahaan wajib diisi"),
  companyLocation: z.string().optional(),
  workMode: z.enum(["onsite", "hybrid", "remote"]).default("onsite"),
  position: z.string().min(1, "Posisi wajib diisi"),
  jobSource: z.string().optional(),
  jobType: z
    .enum([
      "fulltime",
      "parttime",
      "internship",
      "freelance",
      "contract",
      "temporary",
      "other",
    ])
    .default("other"),
  followUpDate: z.string().optional(),
  status: z
    .enum([
      "applied",
      "reviewed",
      "interview",
      "test",
      "offered",
      "accepted",
      "rejected",
      "withdrawn",
    ])
    .default("applied"),
  hrContact: z.string().optional(),
  salary: z.string().optional(),
  notes: z.string().optional(),
  meetingLink: z.string().optional(),
  documents: z.string().optional(), // JSON string of UploadedFile[]
});

// ============================================
// Follow-up Schemas
// ============================================

export const followUpEmailSchema = z.object({
  applicationId: z.string().uuid("Application ID tidak valid"),
  subject: z.string().min(1, "Subject wajib diisi"),
  body: z.string().min(1, "Body email wajib diisi"),
  recipientEmail: z.string().email("Email tidak valid"),
  mode: z.enum(["manual", "automatic"]).default("manual"),
});

export const scheduleSchema = z.object({
  applicationId: z.string().min(1, "Pilih lamaran terlebih dahulu"),
  scheduledDate: z.string().min(1, "Tanggal jadwal wajib diisi"),
});

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi").min(2, "Nama minimal 2 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

// ============================================
// Inferred Types
// ============================================

export type ApplicationFormData = z.input<typeof applicationSchema>;
export type FollowUpEmailFormData = z.infer<typeof followUpEmailSchema>;
export type ScheduleFormData = z.infer<typeof scheduleSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
