"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createFollowUpDraft,
  sendFollowUpEmail,
} from "@/features/follow-up/actions/mutations";
import type { ActionState, FollowUpEmail, JobApplication } from "@/types";
import { Loader2, Save, Send, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface EmailComposerProps {
  applications: JobApplication[];
}

export function EmailComposer({ applications }: EmailComposerProps) {
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [generating, setGenerating] = useState(false);
  const [isSending, startSendTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();

  const selectedApplication = applications.find((a) => a.id === selectedApp);

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
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value);
        }
      }

      const lines = fullText.split("\n");
      const subjectLine = lines.find((l) => l.startsWith("Subject: "));
      if (subjectLine) {
        setSubject(subjectLine.replace("Subject: ", ""));
        setBody(
          lines
            .slice(lines.indexOf(subjectLine) + 2)
            .join("\n")
            .trim(),
        );
      } else {
        setBody(fullText);
      }

      if (selectedApplication.hrContact) {
        setRecipientEmail(selectedApplication.hrContact);
      }

      toast.success("Email berhasil di-generate oleh AI");
    } catch {
      toast.error("Gagal generate email");
    } finally {
      setGenerating(false);
    }
  }

  function handleSaveDraft() {
    if (!selectedApp || !subject || !body || !recipientEmail) {
      toast.error("Lengkapi semua field");
      return;
    }

    const formData = new FormData();
    formData.set("applicationId", selectedApp);
    formData.set("subject", subject);
    formData.set("body", body);
    formData.set("recipientEmail", recipientEmail);
    formData.set("mode", "manual");

    startSaveTransition(async () => {
      const initialState: ActionState<FollowUpEmail> = { success: false };
      const result = await createFollowUpDraft(initialState, formData);
      if (result.success) {
        toast.success(result.message);
        setSubject("");
        setBody("");
        setRecipientEmail("");
      } else {
        toast.error(result.message || "Gagal menyimpan draft");
      }
    });
  }

  function handleSendNow() {
    if (!selectedApp || !subject || !body || !recipientEmail) {
      toast.error("Lengkapi semua field");
      return;
    }

    const formData = new FormData();
    formData.set("applicationId", selectedApp);
    formData.set("subject", subject);
    formData.set("body", body);
    formData.set("recipientEmail", recipientEmail);
    formData.set("mode", "manual");

    startSendTransition(async () => {
      const initialState: ActionState<FollowUpEmail> = { success: false };
      const result = await createFollowUpDraft(initialState, formData);
      if (result.success && result.data) {
        const sendResult = await sendFollowUpEmail(result.data.id);
        if (sendResult.success) {
          toast.success("Email berhasil dikirim!");
          setSubject("");
          setBody("");
          setRecipientEmail("");
        } else {
          toast.error(sendResult.message || "Gagal mengirim email");
        }
      } else {
        toast.error(result.message || "Gagal menyimpan draft");
      }
    });
  }

  const isProcessing = isSending || isSaving || generating;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Follow-up Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Pilih Lamaran</Label>
          <Select
            value={selectedApp}
            onValueChange={(v) => setSelectedApp(v || "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih lamaran..." />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.companyName} - {app.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={!selectedApp || isProcessing}
        >
          {generating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {generating ? "Generating..." : "Generate dengan AI"}
        </Button>

        <div className="space-y-2">
          <Label htmlFor="recipientEmail">Email Tujuan</Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="hr@perusahaan.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Subject email..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Isi Email</Label>
          <Textarea
            id="body"
            placeholder="Tulis isi email atau generate dengan AI..."
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSendNow}
            disabled={!subject || !body || !recipientEmail || isProcessing}
          >
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSending ? "Mengirim..." : "Kirim Sekarang"}
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={!subject || !body || !recipientEmail || isProcessing}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Menyimpan..." : "Simpan Draft"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
