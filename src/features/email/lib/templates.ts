export const EMAIL_TEMPLATES = [
  {
    key: "follow_up",
    label: "Follow-up Lamaran",
    description: "Tanyakan update proses rekrutmen secara profesional.",
    aiInstruction:
      "Write a professional follow-up email asking for an update on the hiring process.",
  },
  {
    key: "thank_you",
    label: "Ucapan Terima Kasih Interview",
    description: "Kirim apresiasi setelah sesi interview.",
    aiInstruction:
      "Write a warm thank-you email after an interview and reaffirm interest in the role.",
  },
  {
    key: "interview_confirmation",
    label: "Konfirmasi Jadwal Interview",
    description: "Konfirmasi kehadiran atau detail jadwal interview.",
    aiInstruction:
      "Write a concise email confirming the interview schedule and asking for any needed preparation details.",
  },
  {
    key: "additional_documents",
    label: "Kirim Dokumen Tambahan",
    description: "Kirim atau lengkapi dokumen lamaran tambahan.",
    aiInstruction:
      "Write a professional email for sending additional application documents.",
  },
  {
    key: "offer_negotiation",
    label: "Negosiasi Offering",
    description: "Balas offering dengan nada sopan dan terbuka.",
    aiInstruction:
      "Write a polite offer negotiation email that expresses appreciation and asks to discuss compensation or terms.",
  },
  {
    key: "withdrawal",
    label: "Withdraw Lamaran",
    description: "Tarik lamaran tanpa merusak hubungan profesional.",
    aiInstruction:
      "Write a professional email withdrawing the application while thanking the recruiter for their time.",
  },
  {
    key: "custom",
    label: "Custom",
    description: "Gunakan instruksi sendiri untuk AI.",
    aiInstruction: "Follow the user's custom instruction.",
  },
] as const;

export type EmailTemplateKey = (typeof EMAIL_TEMPLATES)[number]["key"];

export const DEFAULT_EMAIL_TEMPLATE_KEY: EmailTemplateKey = "follow_up";

export function getEmailTemplate(key: string | null | undefined) {
  return (
    EMAIL_TEMPLATES.find((template) => template.key === key) ??
    EMAIL_TEMPLATES[0]
  );
}
