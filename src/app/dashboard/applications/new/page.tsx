import { ApplicationForm } from "@/features/applications/components/application-form";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto">
      <ApplicationForm mode="create" />
    </div>
  );
}
