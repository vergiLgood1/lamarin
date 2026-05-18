"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { unifiedFollowUpSchema } from "@/lib/validations";
import type { JobApplication } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock,
  Loader2,
  Save,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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

const ACTION_OPTIONS = [
  {
    value: "send",
    label: "Kirim Sekarang",
    description: "Email langsung dikirim ke HR",
    icon: Send,
  },
  {
    value: "draft",
    label: "Simpan Draft",
    description: "Simpan email untuk diedit nanti",
    icon: Save,
  },
  {
    value: "schedule",
    label: "Jadwalkan",
    description: "Atur waktu kirim otomatis",
    icon: CalendarClock,
  },
] as const;

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
  const bodyValue = form.watch("body");
  const subjectValue = form.watch("subject");

  const selectedApplication = useMemo(
    () => applications.find((app) => String(app.id) === String(selectedApp)),
    [applications, selectedApp],
  );

  const activeSchedules = schedules.filter((s) => s.isActive);

  const errors = form.formState.errors;
  const isProcessing = generating || isPending;

  const canGenerate = Boolean(selectedApp) && !isProcessing;

  const submitActionConfig: Record<
    FollowUpAction,
    { label: string; pendingLabel: string; Icon: typeof Send }
  > = {
    send: {
      label: "Kirim Sekarang",
      pendingLabel: "Mengirim...",
      Icon: Send,
    },
    draft: {
      label: "Simpan Draft",
      pendingLabel: "Menyimpan...",
      Icon: Save,
    },
    schedule: {
      label: "Jadwalkan Email",
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: selectedApplication.companyName,
          position: selectedApplication.position,
          status: selectedApplication.status,
          hrContact: selectedApplication.hrContact,
          notes: selectedApplication.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate");
      }

      const fullText = await readStreamToString(response.body);

      const fallbackSubject = `Follow-up ${selectedApplication.companyName} - ${selectedApplication.position}`;

      const generated = parseGeneratedEmail(fullText, fallbackSubject);

      form.setValue("subject", generated.subject);
      form.setValue("body", generated.body);

      if (selectedApplication.hrContact) {
        form.setValue("recipientEmail", selectedApplication.hrContact);
      }

      toast.success("Email berhasil di-generate AI");

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

    toast.success("Email berhasil dibuat dan siap dijadwalkan");
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

    formRef.current?.scrollIntoView({
      behavior: "smooth",
    });
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

        form.reset({
          applicationId: "",
          recipientEmail: "",
          subject: "",
          body: "",
          action: "send",
          scheduledDate: "",
        });
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
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-6">
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FieldGroup>
              <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                {/* LEFT */}
                <div className="space-y-6">
                  <Controller
                    control={form.control}
                    name="applicationId"
                    render={({ field }) => (
                      <Field data-invalid={!!errors.applicationId}>
                        <FieldLabel htmlFor="applicationId">
                          Pilih Lamaran
                        </FieldLabel>

                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id="applicationId"
                            className="h-11"
                            aria-invalid={!!errors.applicationId}
                          >
                            <SelectValue placeholder="Pilih lamaran..." />
                          </SelectTrigger>

                          <SelectContent>
                            {applications.map((app) => (
                              <SelectItem key={app.id} value={app.id}>
                                <div className="flex items-center gap-2">
                                  <span>
                                    {app.companyName} — {app.position}
                                  </span>

                                  {app.hrContact ? (
                                    <Badge
                                      variant="outline"
                                      className="rounded-full"
                                    >
                                      AI Ready
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="secondary"
                                      className="rounded-full"
                                    >
                                      No HR Contact
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

                  {selectedApplication && (
                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">
                            {selectedApplication.companyName}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            {selectedApplication.position}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {selectedApplication.status}
                          </Badge>

                          {selectedApplication.hrContact && (
                            <Badge variant="outline">
                              <CheckCircle2 className="mr-1 size-3" />
                              HR Contact
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-xl"
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
                      variant="secondary"
                      className="h-11 rounded-xl"
                      onClick={handleGenerateAndSchedule}
                      disabled={!canGenerate}
                    >
                      <Wand2 className="mr-2 size-4" />
                      Generate + Schedule
                    </Button>
                  </div>

                  <Field data-invalid={!!errors.recipientEmail}>
                    <FieldLabel htmlFor="recipientEmail">
                      Email Tujuan
                    </FieldLabel>

                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="hr@company.com"
                      className="h-11"
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
                      className="h-11"
                      aria-invalid={!!errors.subject}
                      {...form.register("subject")}
                    />

                    <FieldError errors={[errors.subject]} />
                  </Field>

                  <Field data-invalid={!!errors.body}>
                    <FieldLabel htmlFor="body">Isi Email</FieldLabel>

                    <Textarea
                      id="body"
                      rows={12}
                      placeholder="Tulis isi email atau generate dengan AI..."
                      className="resize-none"
                      aria-invalid={!!errors.body}
                      {...form.register("body")}
                    />

                    <div className="flex items-center justify-between pt-1">
                      <FieldError errors={[errors.body]} />

                      <span className="text-xs text-muted-foreground">
                        {bodyValue?.length || 0} karakter
                      </span>
                    </div>
                  </Field>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                  <FieldSet
                    className="rounded-2xl border bg-muted/20 p-5"
                    data-invalid={!!errors.action}
                  >
                    <div className="mb-4">
                      <FieldLabel className="text-base">Pilih Aksi</FieldLabel>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Tentukan bagaimana email akan diproses.
                      </p>
                    </div>

                    <Controller
                      control={form.control}
                      name="action"
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                        >
                          {ACTION_OPTIONS.map((option) => {
                            const Icon = option.icon;
                            const isSelected = field.value === option.value;

                            return (
                              <Label
                                key={option.value}
                                htmlFor={option.value}
                                className={cn(
                                  "flex cursor-pointer items-start gap-4 rounded-2xl border bg-background p-4 transition-all",
                                  isSelected &&
                                    "border-primary bg-primary/5 ring-1 ring-primary/20",
                                )}
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                  className="mt-1"
                                />

                                <div className="flex flex-1 items-start gap-3">
                                  <div
                                    className={cn(
                                      "flex size-10 items-center justify-center rounded-xl",
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted",
                                    )}
                                  >
                                    <Icon className="size-4" />
                                  </div>

                                  <div className="space-y-1">
                                    <p className="font-medium">
                                      {option.label}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </Label>
                            );
                          })}
                        </RadioGroup>
                      )}
                    />

                    <FieldError errors={[errors.action]} />
                  </FieldSet>

                  {action === "schedule" && (
                    <Field data-invalid={!!errors.scheduledDate}>
                      <FieldLabel htmlFor="scheduledDate">
                        Jadwal Pengiriman
                      </FieldLabel>

                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        className="h-11"
                        aria-invalid={!!errors.scheduledDate}
                        {...form.register("scheduledDate")}
                      />

                      <FieldError errors={[errors.scheduledDate]} />
                    </Field>
                  )}

                  <Card className="border-dashed bg-muted/20 shadow-none">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Bot className="size-5" />
                        </div>

                        <div>
                          <h3 className="font-medium">AI Assistant</h3>

                          <p className="text-sm text-muted-foreground">
                            Generate email follow-up otomatis.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Generate subject & body email otomatis</p>
                        <p>• Menyesuaikan posisi dan status lamaran</p>
                        <p>• Bisa langsung dijadwalkan</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="h-12 w-full rounded-xl text-sm font-medium"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <submitConfig.Icon className="mr-2 size-4" />
                    )}

                    {isPending ? submitConfig.pendingLabel : submitConfig.label}
                  </Button>
                </div>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}