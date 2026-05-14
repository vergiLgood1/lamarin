import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const aiModel = google("gemini-2.5-flash");

export const FOLLOW_UP_SYSTEM_PROMPT = `You are a professional email writer helping job applicants write follow-up emails to HR/recruiters.

Guidelines:
- Keep the tone professional but friendly
- Be concise and to the point
- Show genuine interest in the position
- Reference the specific position and company
- Include a clear call to action
- Keep the email under 200 words
- Write in the language that matches the job posting (Indonesian or English)
`;
