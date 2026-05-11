import { ApplicationForm } from "@/features/applications/components/application-form";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ApplicationForm mode="create" />
    </div>
  );
}
