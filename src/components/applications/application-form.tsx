"use client";

import { createApplication, updateApplication } from "@/actions/applications/mutations";
import { FileUpload } from "@/components/applications/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import {
  JOB_SOURCE_SUGGESTIONS,
  LOCATION_SUGGESTIONS,
  POSITION_SUGGESTIONS,
  SALARY_SUGGESTIONS,
} from "@/lib/constants";
import type { ActionState, JobApplication } from "@/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "applied", label: "Melamar" },
  { value: "reviewed", label: "Direview" },
  { value: "interview", label: "Interview" },
  { value: "test", label: "Tes" },
  { value: "offered", label: "Offering" },
  { value: "accepted", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
  { value: "withdrawn", label: "Dibatalkan" },
];

interface UploadedFile {
  name: string;
  url: string;
  key: string;
  size: number;
  type: string;
}

interface ApplicationFormProps {
  application?: JobApplication;
  existingDocuments?: UploadedFile[];
  mode: "create" | "edit";
}

const initialState: ActionState<JobApplication> = { success: false };

export function ApplicationForm({
  application,
  existingDocuments = [],
  mode,
}: ApplicationFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingDocuments);

  // Hidden input values for combobox fields
  const [position, setPosition] = useState(application?.position || "");
  const [location, setLocation] = useState(application?.location || "");
  const [jobSource, setJobSource] = useState(application?.jobSource || "");
  const [salary, setSalary] = useState(application?.salary || "");

  const boundUpdateAction = application
    ? updateApplication.bind(null, application.id)
    : undefined;

  const action = mode === "create" ? createApplication : boundUpdateAction!;

  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/applications");
    } else if (state.message && state.message !== "Validasi gagal") {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Tambah Lamaran Baru" : "Edit Lamaran"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          {/* Hidden inputs for combobox values */}
          <input type="hidden" name="position" value={position} />
          <input type="hidden" name="location" value={location} />
          <input type="hidden" name="jobSource" value={jobSource} />
          <input type="hidden" name="salary" value={salary} />
          {/* Hidden input for uploaded files metadata */}
          <input
            type="hidden"
            name="documents"
            value={JSON.stringify(uploadedFiles)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Tanggal Lamar *</Label>
              <Input
                id="applicationDate"
                name="applicationDate"
                type="date"
                defaultValue={
                  application?.applicationDate ||
                  new Date().toISOString().split("T")[0]
                }
                aria-invalid={!!state.errors?.applicationDate}
              />
              <FormMessage errors={state.errors?.applicationDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nama Perusahaan *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="PT. Contoh Indonesia"
                defaultValue={application?.companyName || ""}
                aria-invalid={!!state.errors?.companyName}
              />
              <FormMessage errors={state.errors?.companyName} />
            </div>

            <div className="space-y-2">
              <Label>Posisi *</Label>
              <Combobox value={position} onValueChange={(v) => setPosition(v || "")}>
                <ComboboxInput
                  placeholder="Cari atau ketik posisi..."
                  aria-invalid={!!state.errors?.position}
                />
                <ComboboxContent>
                  <ComboboxList>
                    {POSITION_SUGGESTIONS.map((item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FormMessage errors={state.errors?.position} />
            </div>

            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Combobox value={location} onValueChange={(v) => setLocation(v || "")}>
                <ComboboxInput placeholder="Cari atau ketik lokasi..." />
                <ComboboxContent>
                  <ComboboxList>
                    {LOCATION_SUGGESTIONS.map((item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-2">
              <Label>Sumber Lowongan</Label>
              <Combobox value={jobSource} onValueChange={(v) => setJobSource(v || "")}>
                <ComboboxInput placeholder="Cari atau ketik sumber..." />
                <ComboboxContent>
                  <ComboboxList>
                    {JOB_SOURCE_SUGGESTIONS.map((item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={application?.status || "applied"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpDate">Tanggal Follow Up</Label>
              <Input
                id="followUpDate"
                name="followUpDate"
                type="date"
                defaultValue={application?.followUpDate || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hrContact">Kontak/Email HR</Label>
              <Input
                id="hrContact"
                name="hrContact"
                placeholder="hr@perusahaan.com"
                defaultValue={application?.hrContact || ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Gaji</Label>
              <Combobox value={salary} onValueChange={(v) => setSalary(v || "")}>
                <ComboboxInput placeholder="Cari atau ketik gaji..." />
                <ComboboxContent>
                  <ComboboxList>
                    {SALARY_SUGGESTIONS.map((item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLink">Link Zoom/Meet</Label>
              <Input
                id="meetingLink"
                name="meetingLink"
                placeholder="https://zoom.us/j/..."
                defaultValue={application?.meetingLink || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dokumen</Label>
            <FileUpload
              onFilesUploaded={setUploadedFiles}
              existingFiles={existingDocuments}
              maxFiles={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Catatan tambahan..."
              rows={3}
              defaultValue={application?.notes || ""}
            />
          </div>

          <div className="flex gap-3">
            <SubmitButton pendingText="Menyimpan...">
              {mode === "create" ? "Simpan" : "Perbarui"}
            </SubmitButton>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
