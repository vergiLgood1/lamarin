import { ApplicationForm } from "@/components/applications/application-form";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ApplicationForm mode="create" />
    </div>
  );
}
