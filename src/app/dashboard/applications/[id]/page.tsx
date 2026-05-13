import {
  getApplicationById,
  getApplicationDocuments,
} from "@/features/applications/actions/queries";
import { ApplicationDetailView } from "@/features/applications/components/application-detail-view";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [application, documents] = await Promise.all([
    getApplicationById(id),
    getApplicationDocuments(id),
  ]);

  if (!application) {
    notFound();
  }

  return <ApplicationDetailView application={application} documents={documents} />;
}
