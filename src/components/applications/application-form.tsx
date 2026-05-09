"use client";

import { createApplication, updateApplication } from "@/actions/applications/mutations";
import { FileUpload } from "@/components/applications/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
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
import { applicationSchema, type ApplicationFormData } from "@/lib/validations";
import type { ActionState, JobApplication } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingDocuments);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: "onBlur",
    defaultValues: {
      applicationDate:
        application?.applicationDate ||
        new Date().toISOString().split("T")[0],
      companyName: application?.companyName || "",
      position: application?.position || "",
      location: application?.location || "",
      jobSource: application?.jobSource || "",
      salary: application?.salary || "",
      status: application?.status || "applied",
      followUpDate: application?.followUpDate || "",
      hrContact: application?.hrContact || "",
      meetingLink: application?.meetingLink || "",
      notes: application?.notes || "",
    },
  });

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
        <form action={formAction} className="space-y-6">
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
                type="date"
                aria-invalid={!!errors.applicationDate || !!state.errors?.applicationDate}
                {...register("applicationDate")}
              />
              {(errors.applicationDate || state.errors?.applicationDate) && (
                <p className="text-xs text-destructive mt-1" role="alert">
                  {errors.applicationDate?.message || state.errors?.applicationDate?.[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nama Perusahaan *</Label>
              <Input
                id="companyName"
                placeholder="PT. Contoh Indonesia"
                aria-invalid={!!errors.companyName || !!state.errors?.companyName}
                {...register("companyName")}
              />
              {(errors.companyName || state.errors?.companyName) && (
                <p className="text-xs text-destructive mt-1" role="alert">
                  {errors.companyName?.message || state.errors?.companyName?.[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Posisi *</Label>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <Combobox
                    name="position"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v || "")}
                  >
                    <ComboboxInput
                      placeholder="Cari atau ketik posisi..."
                      aria-invalid={!!errors.position || !!state.errors?.position}
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        {POSITION_SUGGESTIONS.map((item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                      <ComboboxEmpty>Tidak ditemukan</ComboboxEmpty>
                    </ComboboxContent>
                  </Combobox>
                )}
              />
              {(errors.position || state.errors?.position) && (
                <p className="text-xs text-destructive mt-1" role="alert">
                  {errors.position?.message || state.errors?.position?.[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Combobox
                    name="location"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v || "")}
                  >
                    <ComboboxInput placeholder="Cari atau ketik lokasi..." />
                    <ComboboxContent>
                      <ComboboxList>
                        {LOCATION_SUGGESTIONS.map((item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                      <ComboboxEmpty>Tidak ditemukan</ComboboxEmpty>
                    </ComboboxContent>
                  </Combobox>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Sumber Lowongan</Label>
              <Controller
                name="jobSource"
                control={control}
                render={({ field }) => (
                  <Combobox
                    name="jobSource"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v || "")}
                  >
                    <ComboboxInput placeholder="Cari atau ketik sumber..." />
                    <ComboboxContent>
                      <ComboboxList>
                        {JOB_SOURCE_SUGGESTIONS.map((item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                      <ComboboxEmpty>Tidak ditemukan</ComboboxEmpty>
                    </ComboboxContent>
                  </Combobox>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    name="status"
                    value={field.value}
                    onValueChange={field.onChange}
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
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpDate">Tanggal Follow Up</Label>
              <Input
                id="followUpDate"
                type="date"
                {...register("followUpDate")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hrContact">Kontak/Email HR</Label>
              <Input
                id="hrContact"
                placeholder="hr@perusahaan.com"
                {...register("hrContact")}
              />
            </div>

            <div className="space-y-2">
              <Label>Gaji</Label>
              <Controller
                name="salary"
                control={control}
                render={({ field }) => (
                  <Combobox
                    name="salary"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v || "")}
                  >
                    <ComboboxInput placeholder="Cari atau ketik gaji..." />
                    <ComboboxContent>
                      <ComboboxList>
                        {SALARY_SUGGESTIONS.map((item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                      <ComboboxEmpty>Tidak ditemukan</ComboboxEmpty>
                    </ComboboxContent>
                  </Combobox>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLink">Link Zoom/Meet</Label>
              <Input
                id="meetingLink"
                placeholder="https://zoom.us/j/..."
                {...register("meetingLink")}
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
              placeholder="Catatan tambahan..."
              rows={3}
              {...register("notes")}
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
