"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  cancelSchedule,
  createScheduledFollowUp,
} from "@/features/follow-up/actions/mutations";
import { unifiedFollowUpSchema } from "@/lib/validations";
import type { JobApplication } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2, Save, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface UnifiedFollowUpFormProps {
  applications: JobApplication[];
  schedules: {
    id: string;
    applicationId: string;
    scheduledDate: Date;
    isActive: boolean;
    companyName: string | null;
    position: string | null;
    emailId: string | null;
  }[];
}

type FormValues = z.infer<typeof unifiedFollowUpSchema>;
type FollowUpAction = FormValues["action"];

const SUBJECT_PREFIX = "Subject:";

function toDatetimeLocal(date: Date) {
  return date.toISOString().slice(0, 16);
}

function getDefaultScheduledDate() {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  defaultDate.setHours(9, 0, 0, 0);
  return toDatetimeLocal(defaultDate);
}

function parseGeneratedEmail(fullText: string, fallbackSubject: string) {
  const lines = fullText.split("\n").map((line) => line.trimEnd());
  const subjectLine = lines.find((line) => line.startsWith(SUBJECT_PREFIX));

  if (!subjectLine) {
    return {
      subject: fallbackSubject,
      body: fullText.trim(),
    };
  }

  const subject = subjectLine.replace(SUBJECT_PREFIX, "").trim();
  const subjectIndex = lines.indexOf(subjectLine);
  const body = lines
    .slice(subjectIndex + 1)
    .join("\n")
    .trim();

  return { subject, body };
}

async function readStreamToString(stream: ReadableStream<Uint8Array> | null) {
  if (!stream) return "";

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fullText += decoder.decode(value);
  }

  return fullText;
}

export function UnifiedFollowUpForm({
  applications,
  schedules,
}: UnifiedFollowUpFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [generating, setGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(unifiedFollowUpSchema),
    defaultValues: {
      applicationId: "",
      recipientEmail: "",
      subject: "",
      body: "",
      action: "send",
      scheduledDate: "",
    },
  });

  const selectedApp = form.watch("applicationId");
  const action = form.watch("action");

  const selectedApplication = applications.find(
    (app) => String(app.id) === String(selectedApp),
  );

  const activeSchedules = schedules.filter((s) => s.isActive);
  const errors = form.formState.errors;
  const isProcessing = generating || isPending;
  const canGenerate = Boolean(selectedApp) && !isProcessing;

  const submitActionConfig: Record<
    FollowUpAction,
    { label: string; pendingLabel: string; Icon: typeof Send }
  > = {
    send: { label: "Kirim Sekarang", pendingLabel: "Mengirim...", Icon: Send },
    draft: { label: "Simpan Draft", pendingLabel: "Menyimpan...", Icon: Save },
    schedule: {
      label: "Jadwalkan",
      pendingLabel: "Menjadwalkan...",
      Icon: Clock,
    },
  };

  const submitConfig = submitActionConfig[action];

  useEffect(() => {
    if (!selectedApp) return;

    const app = applications.find((a) => String(a.id) === String(selectedApp));
    if (app?.hrContact) {
      form.setValue("recipientEmail", app.hrContact);
    }

    const existingSchedule = activeSchedules.find(
      (s) => s.applicationId === selectedApp,
    );

    if (existingSchedule) {
      form.setValue(
        "scheduledDate",
        toDatetimeLocal(new Date(existingSchedule.scheduledDate)),
      );
      form.setValue("action", "schedule");
    } else {
      form.setValue("scheduledDate", getDefaultScheduledDate());
    }
  }, [selectedApp, applications, activeSchedules, form]);

  async function handleGenerate() {
    if (!selectedApp || !selectedApplication) {
      toast.error("Pilih lamaran terlebih dahulu");
      return null;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: selectedApplication.companyName,
          position: selectedApplication.position,
          status: selectedApplication.status,
          hrContact: selectedApplication.hrContact,
          notes: selectedApplication.notes,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const fullText = await readStreamToString(response.body);
      const fallbackSubject = `Follow-up ${selectedApplication.companyName} - ${selectedApplication.position}`;
      const generated = parseGeneratedEmail(fullText, fallbackSubject);

      form.setValue("subject", generated.subject);
      form.setValue("body", generated.body);

      if (selectedApplication.hrContact) {
        form.setValue("recipientEmail", selectedApplication.hrContact);
      }

      toast.success("Email berhasil di-generate oleh AI");
      return generated;
    } catch {
      toast.error("Gagal generate email");
      return null;
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateAndSchedule() {
    const generated = await handleGenerate();
    if (!generated) return;

    form.setValue("action", "schedule");
    toast.success("Email di-generate! Pilih waktu pengiriman.");
  }

  async function handleCancelSchedule(scheduleId: string) {
    const result = await cancelSchedule(scheduleId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || "Gagal membatalkan jadwal");
    }
  }

  function handleEditSchedule(schedule: (typeof schedules)[0]) {
    form.setValue("applicationId", schedule.applicationId);
    form.setValue("action", "schedule");
    form.setValue(
      "scheduledDate",
      toDatetimeLocal(new Date(schedule.scheduledDate)),
    );

    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("applicationId", data.applicationId);
      formData.set("recipientEmail", data.recipientEmail);
      formData.set("subject", data.subject);
      formData.set("body", data.body);
      formData.set("action", data.action);
      if (data.scheduledDate) {
        formData.set("scheduledDate", data.scheduledDate);
      }

      const result = await createScheduledFollowUp(
        { success: false },
        formData,
      );

      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof FormValues, {
            message: messages[0],
          });
        });
      } else {
        toast.error(result.message || "Terjadi kesalahan");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <Field data-invalid={!!errors.applicationId}>
                    <FieldLabel htmlFor="applicationId">
                      Pilih Lamaran
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="applicationId"
                        aria-invalid={!!errors.applicationId}
                      >
                        <SelectValue placeholder="Pilih lamaran..." />
                      </SelectTrigger>
                      <SelectContent>
                        {applications.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            <div className="flex items-center gap-2">
                              <span>
                                {app.companyName} - {app.position}
                              </span>
                              {app.hrContact ? (
                                <Badge variant="outline">AI Ready</Badge>
                              ) : (
                                <Badge variant="secondary">
                                  Tanpa HR Contact
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.applicationId]} />
                  </Field>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                >
                  {generating ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 size-4" />
                  )}
                  {generating ? "Generating..." : "Generate dengan AI"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateAndSchedule}
                  disabled={!canGenerate}
                >
                  <Sparkles className="mr-2 size-4" />
                  Generate + Jadwalkan
                </Button>
              </div>

              <Field data-invalid={!!errors.recipientEmail}>
                <FieldLabel htmlFor="recipientEmail">Email Tujuan</FieldLabel>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="hr@perusahaan.com"
                  aria-invalid={!!errors.recipientEmail}
                  {...form.register("recipientEmail")}
                />
                <FieldError errors={[errors.recipientEmail]} />
              </Field>

              <Field data-invalid={!!errors.subject}>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input
                  id="subject"
                  placeholder="Subject email..."
                  aria-invalid={!!errors.subject}
                  {...form.register("subject")}
                />
                <FieldError errors={[errors.subject]} />
              </Field>

              <Field data-invalid={!!errors.body}>
                <FieldLabel htmlFor="body">Isi Email</FieldLabel>
                <Textarea
                  id="body"
                  placeholder="Tulis isi email atau generate dengan AI..."
                  rows={8}
                  aria-invalid={!!errors.body}
                  {...form.register("body")}
                />
                <FieldError errors={[errors.body]} />
              </Field>

              <Controller
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FieldSet
                    className="rounded-lg border p-4"
                    data-invalid={!!errors.action}
                  >
                    <FieldLabel>Pilih Aksi</FieldLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="send" id="send" />
                        <Label htmlFor="send" className="font-normal">
                          Kirim Sekarang
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="draft" id="draft" />
                        <Label htmlFor="draft" className="font-normal">
                          Simpan Draft
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="schedule" id="schedule" />
                        <Label htmlFor="schedule" className="font-normal">
                          Jadwalkan Pengiriman
                        </Label>
                      </div>
                    </RadioGroup>
                    <FieldError errors={[errors.action]} />
                  </FieldSet>
                )}
              />

              {action === "schedule" && (
                <Field data-invalid={!!errors.scheduledDate}>
                  <FieldLabel htmlFor="scheduledDate">
                    Tanggal & Waktu Kirim
                  </FieldLabel>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    aria-invalid={!!errors.scheduledDate}
                    {...form.register("scheduledDate")}
                  />
                  <FieldError errors={[errors.scheduledDate]} />
                </Field>
              )}

              <Button type="submit" disabled={isProcessing} className="w-full">
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <submitConfig.Icon className="mr-2 size-4" />
                )}
                {isPending ? submitConfig.pendingLabel : submitConfig.label}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* {activeSchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Aktif ({activeSchedules.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {schedule.companyName} - {schedule.position}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(schedule.scheduledDate).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Aktif</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditSchedule(schedule)}
                    title="Edit jadwal"
                  >
                    <Clock className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancelSchedule(schedule.id)}
                    title="Batalkan jadwal"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
