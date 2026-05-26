import { streamText } from "ai";
import { aiModel, FOLLOW_UP_SYSTEM_PROMPT } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";
import { getEmailTemplate } from "@/features/email/lib/templates";
import { z } from "zod";

const generateEmailSchema = z
  .object({
    companyName: z.string().min(1).max(255),
    position: z.string().min(1).max(255),
    status: z.string().min(1).max(100),
    hrContact: z.string().max(255).nullable().optional(),
    notes: z.string().max(2000).nullable().optional(),
    templateKey: z.string().max(100).optional(),
    customInstruction: z.string().max(1000).optional(),
  })
  .refine(
    (data) => data.templateKey !== "custom" || Boolean(data.customInstruction?.trim()),
    { message: "Custom instruction is required", path: ["customInstruction"] },
  );

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = generateEmailSchema.safeParse(await req.json());

  if (!payload.success) {
    return Response.json(
      { error: "Invalid request", details: payload.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const {
    companyName,
    position,
    status,
    hrContact,
    notes,
    templateKey,
    customInstruction,
  } = payload.data;

  const template = getEmailTemplate(templateKey);
  const templateInstruction =
    template.key === "custom" ? customInstruction : template.aiInstruction;

  const prompt = `Generate a professional job application email using this template:
- Template: ${template.label}
- Template Instruction: ${templateInstruction}

Application details:
- Company: ${companyName}
- Position: ${position}
- Current Status: ${status}
- HR Contact: ${hrContact || "HR Team"}
- Additional Notes: ${notes || "None"}

Write the email subject on the first line prefixed with "Subject: ", then leave a blank line, then write the email body.`;

  logger.info("AI email generation requested", {
    userId: session.user.id,
    company: companyName,
    position,
    templateKey: template.key,
  });

  const result = streamText({
    model: aiModel,
    system: FOLLOW_UP_SYSTEM_PROMPT,
    prompt,
  });

  return result.toTextStreamResponse();
}
