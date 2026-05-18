"use client";

import {
  createApplication,
  updateApplication,
} from "@/features/applications/actions/mutations";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import { useUploadThing } from "@/lib/uploadthing-client";

import { applicationSchema, type ApplicationFormData } from "@/lib/validations";

import type { ActionState, JobApplication } from "@/types";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  FileText,
  Globe2,
  Loader2,
  PencilLine,
  Wallet,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { FileUpload, type UploadedFile } from "./file-upload";

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

const JOB_TYPE_OPTIONS = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "other", label: "Other" },
];

const WORK_MODE_OPTIONS = [
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

interface ApplicationFormProps {
  application?: JobApplication;
  existingDocuments?: UploadedFile[];
  mode: "create" | "edit";
}

const initialState: ActionState<JobApplication> = {
  success: false,
};

export function ApplicationForm({
  application,
  existingDocuments = [],
  mode,
}: ApplicationFormProps) {
  const router = useRouter();

  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(existingDocuments);

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("documentUploader", {
    onUploadBegin: () => setIsUploading(true),
    onUploadError: () => setIsUploading(false),
    onClientUploadComplete: () => setIsUploading(false),
  });

  const defaultFollowUpDate = useMemo(() => {
    const date = new Date();

    date.setDate(date.getDate() + 7);

    return date.toISOString().split("T")[0];
  }, []);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: "onBlur",

    defaultValues: {
      applicationDate:
        application?.applicationDate || new Date().toISOString().split("T")[0],

      companyName: application?.companyName || "",

      position: application?.position || "",

      companyLocation: application?.companyLocation || "",

      workMode: application?.workMode || "onsite",

      jobSource: application?.jobSource || "",

      jobType: application?.jobType || "other",

      salary: application?.salary || "",

      status: application?.status || "applied",

      followUpDate: application?.followUpDate || defaultFollowUpDate,

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

  async function handleSubmit(formData: FormData) {
    if (pendingFiles.length > 0) {
      const uploadResult = await startUpload(pendingFiles);

      if (!uploadResult) {
        toast.error("Gagal upload dokumen");

        return;
      }

      const uploaded = uploadResult.map((file) => ({
        name: file.name,
        url: file.ufsUrl,
        key: file.key,
        size: file.size,
        type: file.type,
      }));

      const mergedDocuments = [...uploadedFiles, ...uploaded];

      setUploadedFiles(mergedDocuments);

      formData.set("documents", JSON.stringify(mergedDocuments));
    } else {
      formData.set("documents", JSON.stringify(uploadedFiles));
    }

    startTransition(() => {
      formAction(formData);
    });
  }

  function renderError(error?: string) {
    if (!error) return null;

    return (
      <p className="text-xs text-destructive" role="alert">
        {error}
      </p>
    );
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BriefcaseBusiness className="size-6" />
              </div>

              <div>
                <CardTitle className="text-2xl">
                  {mode === "create" ? "Tambah Lamaran" : "Edit Lamaran"}
                </CardTitle>

                <CardDescription className="mt-1">
                  Kelola data aplikasi kerja, dokumen, dan reminder follow-up
                  dalam satu tempat.
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                icon: Building2,
                label: "Company",
              },
              {
                icon: CalendarClock,
                label: "Follow Up",
              },
              {
                icon: FileText,
                label: "Documents",
              },
              {
                icon: Globe2,
                label: "Tracking",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-background px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>

                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 lg:p-8">
        <form action={handleSubmit} className="space-y-8">
          <input
            type="hidden"
            name="documents"
            value={JSON.stringify(uploadedFiles)}
          />

          {/* INFORMASI UTAMA */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-4" />
              </div>

              <div>
                <h3 className="font-semibold">Informasi Utama</h3>

                <p className="text-sm text-muted-foreground">
                  Informasi dasar terkait aplikasi pekerjaan.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="applicationDate">Tanggal Lamar *</Label>

                <Input
                  id="applicationDate"
                  type="date"
                  className="h-11 rounded-xl"
                  aria-invalid={
                    !!errors.applicationDate || !!state.errors?.applicationDate
                  }
                  {...register("applicationDate")}
                />

                {renderError(
                  errors.applicationDate?.message ||
                    state.errors?.applicationDate?.[0],
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nama Perusahaan *</Label>

                <Input
                  id="companyName"
                  placeholder="PT. Example Indonesia"
                  className="h-11 rounded-xl"
                  aria-invalid={
                    !!errors.companyName || !!state.errors?.companyName
                  }
                  {...register("companyName")}
                />

                {renderError(
                  errors.companyName?.message || state.errors?.companyName?.[0],
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
                        placeholder="Cari posisi..."
                        className="h-11 rounded-xl"
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

                {renderError(
                  errors.position?.message || state.errors?.position?.[0],
                )}
              </div>

              <div className="space-y-2">
                <Label>Lokasi Perusahaan</Label>

                <Controller
                  name="companyLocation"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      name="companyLocation"
                      value={field.value}
                      onValueChange={(v) => field.onChange(v || "")}
                    >
                      <ComboboxInput
                        placeholder="Cari lokasi..."
                        className="h-11 rounded-xl"
                      />

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
            </div>
          </div>

          {/* DETAIL PEKERJAAN */}
          <div className="space-y-5 border-t pt-8">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wallet className="size-4" />
              </div>

              <div>
                <h3 className="font-semibold">Detail Pekerjaan</h3>

                <p className="text-sm text-muted-foreground">
                  Jenis pekerjaan, salary, dan source lowongan.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workMode">Mode Kerja</Label>

                <Controller
                  name="workMode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="workMode"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-11 rounded-xl flex w-full">
                        <SelectValue placeholder="Pilih mode kerja" />
                      </SelectTrigger>

                      <SelectContent>
                        {WORK_MODE_OPTIONS.map((option) => (
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
                      <ComboboxInput
                        placeholder="Cari source..."
                        className="h-11 rounded-xl"
                      />

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
                <Label htmlFor="jobType">Jenis Pekerjaan</Label>

                <Controller
                  name="jobType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="jobType"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-11 rounded-xl flex w-full">
                        <SelectValue placeholder="Pilih jenis pekerjaan" />
                      </SelectTrigger>

                      <SelectContent>
                        {JOB_TYPE_OPTIONS.map((option) => (
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
                      <ComboboxInput
                        placeholder="Contoh: 5-8 juta"
                        className="h-11 rounded-xl"
                      />

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
            </div>
          </div>

          {/* STATUS & FOLLOW UP */}
          <div className="space-y-5 border-t pt-8">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarClock className="size-4" />
              </div>

              <div>
                <h3 className="font-semibold">Follow Up & Status</h3>

                <p className="text-sm text-muted-foreground">
                  Atur status aplikasi dan jadwal follow-up.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
                      <SelectTrigger className="h-11 rounded-xl flex w-full">
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
                  className="h-11 rounded-xl"
                  {...register("followUpDate")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hrContact">Kontak HR</Label>

                <Input
                  id="hrContact"
                  placeholder="hr@company.com"
                  className="h-11 rounded-xl"
                  {...register("hrContact")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingLink">Link Meeting</Label>

                <Input
                  id="meetingLink"
                  placeholder="https://meet.google.com/..."
                  className="h-11 rounded-xl"
                  {...register("meetingLink")}
                />
              </div>
            </div>
          </div>

          {/* DOKUMEN */}
          <div className="space-y-5 border-t pt-8">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-4" />
              </div>

              <div>
                <h3 className="font-semibold">Dokumen Pendukung</h3>

                <p className="text-sm text-muted-foreground">
                  Upload CV, portfolio, sertifikat, atau dokumen lainnya.
                </p>
              </div>
            </div>

            <FileUpload
              selectedFiles={pendingFiles}
              onSelectedFilesChange={setPendingFiles}
              existingFiles={uploadedFiles}
              onExistingFilesChange={setUploadedFiles}
              isUploading={isUploading}
              maxFiles={10}
            />
          </div>

          {/* NOTES */}
          <div className="space-y-5 border-t pt-8">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PencilLine className="size-4" />
              </div>

              <div>
                <h3 className="font-semibold">Catatan Tambahan</h3>

                <p className="text-sm text-muted-foreground">
                  Tambahkan insight atau informasi penting lainnya.
                </p>
              </div>
            </div>

            <Textarea
              id="notes"
              rows={5}
              placeholder="Contoh: Interview tahap pertama berjalan baik..."
              className="rounded-2xl"
              {...register("notes")}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 border-t pt-8 sm:flex-row">
            <SubmitButton
              pendingText={isUploading ? "Mengupload..." : "Menyimpan..."}
              disabled={isUploading}
              className="h-11 rounded-xl px-6"
            >
              {isUploading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <BriefcaseBusiness className="mr-2 size-4" />
              )}

              {mode === "create" ? "Simpan Lamaran" : "Perbarui Lamaran"}
            </SubmitButton>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-6"
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