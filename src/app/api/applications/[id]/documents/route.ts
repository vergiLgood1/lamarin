import { db } from "@/db";
import { applicationDocuments } from "@/db/schema";
import { authenticateRequest } from "@/lib/external-auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/applications/[id]/documents — list documents for an application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;

  const documents = await db
    .select()
    .from(applicationDocuments)
    .where(
      and(
        eq(applicationDocuments.applicationId, id),
        eq(applicationDocuments.userId, auth.userId),
      ),
    );

  return NextResponse.json({ data: documents });
}
