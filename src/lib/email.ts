import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail({
  to,
  subject,
  body,
  from,
}: {
  to: string;
  subject: string;
  body: string;
  from?: string;
}) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const result = await resend.emails.send({
    from: "Diyo Anggara <jobs@diyoanggara.dev>",
    replyTo: from,
    to: [to],
    subject,
    text: body,
  });

  return result;
}
