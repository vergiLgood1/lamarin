import { streamText } from "ai";
import { aiModel, FOLLOW_UP_SYSTEM_PROMPT } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { companyName, position, status, hrContact, notes } = await req.json();

  const prompt = `Generate a professional follow-up email for a job application with the following details:
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
  });

  const result = streamText({
    model: aiModel,
    system: FOLLOW_UP_SYSTEM_PROMPT,
    prompt,
  });

  return result.toTextStreamResponse();
}
