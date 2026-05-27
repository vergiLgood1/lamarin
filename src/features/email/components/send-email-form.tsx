"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createEmailDraft,
  sendApplicationEmail,
} from "@/features/email/actions/mutations";
import {
  DEFAULT_EMAIL_TEMPLATE_KEY,
  EMAIL_TEMPLATES,
  type EmailTemplateKey,
} from "@/features/email/lib/templates";
import type { ActionState, FollowUpEmail, JobApplication } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, Save, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SUBJECT_PREFIX = "Subject:";

const sendEmailFormSchema = z
  .object({
    applicationId: z.string().uuid("Pilih lamaran terlebih dahulu"),
    templateKey: z.enum([
      "follow_up",
      "thank_you",
      "interview_confirmation",
      "additional_documents",
      "offer_negotiation",
      "withdrawal",
      "custom",
    ]),
    customInstruction: z.string().optional(),
    recipientEmail: z.string().email("Email tujuan tidak valid"),
    subject: z.string().min(1, "Subject wajib diisi"),
    body: z.string().min(1, "Isi email wajib diisi"),
  })
  .refine(
    (data) => data.templateKey !== "custom" || Boolean(data.customInstruction?.trim()),
    {
      message: "Instruksi custom wajib diisi",
      path: ["customInstruction"],
    },
  );

type SendEmailFormValues = z.infer<typeof sendEmailFormSchema>;
type SubmitIntent = "send" | "draft";

interface SendEmailFormProps {
  applications: JobApplication[];
}

function parseGeneratedEmail(fullText: string, fallbackSubject: string) {
  const lines = fullText.split("\n").map((line) => line.trimEnd());
  const subjectLine = lines.find((line) => line.startsWith(SUBJECT_PREFIX));

  if (!subjectLine) {
    return { subject: fallbackSubject, body: fullText.trim() };
  }

  const subject = subjectLine.replace(SUBJECT_PREFIX, "").trim();
  const subjectIndex = lines.indexOf(subjectLine);
  const body = lines.slice(subjectIndex + 1).join("\n").trim();

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

function buildFormData(data: SendEmailFormValues): FormData {
  const formData = new FormData();
  formData.set("applicationId", data.applicationId);
  formData.set("recipientEmail", data.recipientEmail);
  formData.set("subject", data.subject);
  formData.set("body", data.body);
  formData.set("templateKey", data.templateKey);

  return formData;
}

function handleActionResult(
  result: ActionState<FollowUpEmail>,
  form: ReturnType<typeof useForm<SendEmailFormValues>>,
) {
  if (result.success) {
    toast.success(result.message);
    form.reset({
      applicationId: "",
      templateKey: DEFAULT_EMAIL_TEMPLATE_KEY,
      customInstruction: "",
      recipientEmail: "",
      subject: "",
      body: "",
    });
    return;
  }

  if (result.errors) {
    Object.entries(result.errors).forEach(([field, messages]) => {
      form.setError(field as keyof SendEmailFormValues, {
        message: messages[0],
      });
    });
    return;
  }

  toast.error(result.message || "Terjadi kesalahan");
}

export function SendEmailForm({ applications }: SendEmailFormProps) {
  const [generating, setGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitIntent, setSubmitIntent] = useState<SubmitIntent>("send");

  const form = useForm<SendEmailFormValues>({
    resolver: zodResolver(sendEmailFormSchema),
    defaultValues: {
      applicationId: "",
      templateKey: DEFAULT_EMAIL_TEMPLATE_KEY,
      customInstruction: "",
      recipientEmail: "",
      subject: "",
      body: "",
    },
  });

  const selectedApplicationId = form.watch("applicationId");
  const selectedTemplateKey = form.watch("templateKey");
  const bodyValue = form.watch("body");

  const selectedApplication = useMemo(
    () => applications.find((application) => application.id === selectedApplicationId),
    [applications, selectedApplicationId],
  );

  const selectedTemplate = EMAIL_TEMPLATES.find(
    (template) => template.key === selectedTemplateKey,
  );

  const errors = form.formState.errors;
  const isProcessing = generating || isPending;

  useEffect(() => {
    if (!selectedApplication?.hrContact) return;
    form.setValue("recipientEmail", selectedApplication.hrContact);
  }, [form, selectedApplication]);

  async function handleGenerate() {
    if (!selectedApplication) {
      toast.error("Pilih lamaran terlebih dahulu");
      return;
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
          templateKey: selectedTemplateKey,
          customInstruction: form.getValues("customInstruction"),
        }),
      });

      if (!response.ok) throw new Error("Failed to generate email");

      const fullText = await readStreamToString(response.body);
      const fallbackSubject = `${selectedTemplate?.label || "Email"} - ${selectedApplication.companyName}`;
      const generated = parseGeneratedEmail(fullText, fallbackSubject);

      form.setValue("subject", generated.subject);
      form.setValue("body", generated.body);
      toast.success("Email berhasil di-generate AI");
    } catch {
      toast.error("Gagal generate email");
    } finally {
      setGenerating(false);
    }
  }

  function onSubmit(data: SendEmailFormValues) {
    startTransition(async () => {
      const formData = buildFormData(data);
      const initialState = { success: false };

      if (submitIntent === "draft") {
        const result = await createEmailDraft(initialState, formData);
        handleActionResult(result, form);
        return;
      }

      const result = await sendApplicationEmail(initialState, formData);
      handleActionResult(result, form);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MailCheck className="size-5 text-primary" />
              Compose Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <Field data-invalid={!!errors.applicationId}>
                    <FieldLabel htmlFor="applicationId">Pilih Lamaran</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="applicationId" aria-invalid={!!errors.applicationId}>
                        <SelectValue placeholder="Pilih data lamaran..." />
                      </SelectTrigger>
                      <SelectContent>
                        {applications.map((application) => (
                          <SelectItem key={application.id} value={application.id}>
                            {application.companyName} - {application.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.applicationId]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="templateKey"
                render={({ field }) => (
                  <Field data-invalid={!!errors.templateKey}>
                    <FieldLabel htmlFor="templateKey">Template Email</FieldLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value as EmailTemplateKey)}
                      value={field.value}
                    >
                      <SelectTrigger id="templateKey" aria-invalid={!!errors.templateKey}>
                        <SelectValue placeholder="Pilih template..." />
                      </SelectTrigger>
                      <SelectContent>
                        {EMAIL_TEMPLATES.map((template) => (
                          <SelectItem key={template.key} value={template.key}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.templateKey]} />
                  </Field>
                )}
              />

              {selectedTemplateKey === "custom" ? (
                <Field data-invalid={!!errors.customInstruction}>
                  <FieldLabel htmlFor="customInstruction">Instruksi Custom</FieldLabel>
                  <Textarea
                    id="customInstruction"
                    rows={4}
                    placeholder="Contoh: Buat email untuk menanyakan hasil technical test dengan nada sopan dan singkat."
                    aria-invalid={!!errors.customInstruction}
                    {...form.register("customInstruction")}
                  />
                  <FieldError errors={[errors.customInstruction]} />
                </Field>
              ) : null}

              <Button
                type="button"
                variant="outline"
                className="w-fit rounded-xl"
                onClick={handleGenerate}
                disabled={!selectedApplication || isProcessing}
              >
                {generating ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 size-4" />
                )}
                {generating ? "Generating..." : "Generate dengan AI"}
              </Button>

              <Field data-invalid={!!errors.recipientEmail}>
                <FieldLabel htmlFor="recipientEmail">Email Tujuan</FieldLabel>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="hr@company.com"
                  aria-invalid={!!errors.recipientEmail}
                  {...form.register("recipientEmail")}
                />
                <FieldError errors={[errors.recipientEmail]} />
              </Field>

              <Field data-invalid={!!errors.subject}>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input
                  id="subject"
                  placeholder="Subject email"
                  aria-invalid={!!errors.subject}
                  {...form.register("subject")}
                />
                <FieldError errors={[errors.subject]} />
              </Field>

              <Field data-invalid={!!errors.body}>
                <FieldLabel htmlFor="body">Isi Email</FieldLabel>
                <Textarea
                  id="body"
                  rows={13}
                  placeholder="Tulis email atau generate dengan AI..."
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
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Detail Lamaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedApplication ? (
                <>
                  <div>
                    <p className="font-medium">{selectedApplication.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedApplication.position}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedApplication.status}</Badge>
                    <Badge variant="outline">
                      {selectedApplication.hrContact || "No HR contact"}
                    </Badge>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Pilih lamaran untuk melihat konteks email.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{selectedTemplate?.label}</p>
              <p className="text-sm text-muted-foreground">
                {selectedTemplate?.description}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-2">
            <Button
              type="submit"
              className="h-11 rounded-xl"
              disabled={isProcessing}
              onClick={() => setSubmitIntent("send")}
            >
              {isPending && submitIntent === "send" ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Send className="mr-2 size-4" />
              )}
              Kirim Sekarang
            </Button>
            <Button
              type="submit"
              variant="outline"
              className="h-11 rounded-xl"
              disabled={isProcessing}
              onClick={() => setSubmitIntent("draft")}
            >
              {isPending && submitIntent === "draft" ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              Simpan Draft
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
