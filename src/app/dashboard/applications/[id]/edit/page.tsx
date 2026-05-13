import {
  getApplicationById,
  getApplicationDocuments,
} from "@/features/applications/actions/queries";
import { ApplicationForm } from "@/features/applications/components/application-form";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditApplicationPage({ params }: PageProps) {
  const { id } = await params;
  const [application, documents] = await Promise.all([
    getApplicationById(id),
    getApplicationDocuments(id),
  ]);

  if (!application) {
    notFound();
  }

  const existingDocuments = documents.map((doc) => ({
    name: doc.fileName,
    url: doc.fileUrl,
    key: doc.fileKey,
    size: Number(doc.fileSize),
    type: doc.fileType,
  }));

  return (
    <div className="mx-auto">
      <ApplicationForm
        mode="edit"
        application={application}
        existingDocuments={existingDocuments}
      />
    </div>
  );
}