"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Eye, FileText, Image as ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

export interface UploadedFile {
  name: string;
  url: string;
  key: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  selectedFiles: File[];
  onSelectedFilesChange: (files: File[]) => void;
  existingFiles?: UploadedFile[];
  onExistingFilesChange?: (files: UploadedFile[]) => void;
  isUploading?: boolean;
  maxFiles?: number;
}

export function FileUpload({
  selectedFiles,
  onSelectedFilesChange,
  existingFiles = [],
  onExistingFilesChange,
  isUploading = false,
  maxFiles = 10,
}: FileUploadProps) {
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [previewPendingFile, setPreviewPendingFile] = useState<File | null>(null);

  const fileSlotsLeft = Math.max(0, maxFiles - existingFiles.length - selectedFiles.length);

  const pendingFilePreviews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles]
  );

  const handleFileSelect = useCallback(
    (newFiles: File[]) => {
      if (newFiles.length === 0 || fileSlotsLeft <= 0) return;
      const acceptedFiles = newFiles.slice(0, fileSlotsLeft);
      onSelectedFilesChange([...selectedFiles, ...acceptedFiles]);
    },
    [fileSlotsLeft, onSelectedFilesChange, selectedFiles]
  );

  function removeExistingFile(key: string) {
    const nextFiles = existingFiles.filter((file) => file.key !== key);
    onExistingFilesChange?.(nextFiles);
  }

  function removePendingFile(name: string) {
    onSelectedFilesChange(selectedFiles.filter((file) => file.name !== name));
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function isImage(type: string): boolean {
    return type.startsWith("image/");
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Dropzone
          src={undefined}
          maxFiles={Math.max(1, fileSlotsLeft)}
          disabled={isUploading || fileSlotsLeft <= 0}
          accept={{
            "application/pdf": [".pdf"],
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/webp": [".webp"],
          }}
          maxSize={8 * 1024 * 1024}
          onDrop={(acceptedFiles) => handleFileSelect(acceptedFiles)}
          className="p-4"
        >
          {isUploading ? (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Mengupload dokumen...
            </div>
          ) : (
            <>
              <DropzoneContent />
              <DropzoneEmptyState />
            </>
          )}
        </Dropzone>
        <span className="text-xs text-muted-foreground">
          PDF, gambar. Maks {maxFiles} file.
        </span>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Siap diupload saat simpan</p>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file) => (
              <div
                key={`pending-${file.name}`}
                className="group flex items-center gap-1.5 rounded-md border border-dashed bg-muted/30 px-2.5 py-1.5 text-xs"
              >
                {isImage(file.type) ? (
                  <ImageIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                ) : (
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="max-w-[120px] truncate font-medium">{file.name}</span>
                <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                <Badge variant="secondary" className="h-4 px-1 text-[10px]">Pending</Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => setPreviewPendingFile(file)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="h-4 w-4 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removePendingFile(file.name)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Dokumen tersimpan</p>
          <div className="flex flex-wrap gap-2">
            {existingFiles.map((file) => (
              <div
                key={file.key}
                className="group flex items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1.5 text-xs"
              >
                {isImage(file.type) ? (
                  <ImageIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                ) : (
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="max-w-[120px] truncate font-medium">{file.name}</span>
                <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => setPreviewFile(file)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="h-4 w-4 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeExistingFile(file.key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Badge variant="secondary" className="self-center text-xs">
              {existingFiles.length + selectedFiles.length}/{maxFiles}
            </Badge>
          </div>
        </div>
      )}

      <Dialog
        open={!!previewFile || !!previewPendingFile}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewFile(null);
            setPreviewPendingFile(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">
              {previewFile?.name || previewPendingFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            {previewPendingFile && isImage(previewPendingFile.type) ? (
              <Image
                src={pendingFilePreviews.find((item) => item.file.name === previewPendingFile.name)?.url || ""}
                alt={previewPendingFile.name}
                width={0}
                height={0}
                sizes="100vw"
                className="max-h-[65vh] w-full rounded-md object-contain"
              />
            ) : previewFile && isImage(previewFile.type) ? (
              <Image
                src={previewFile.url}
                alt={previewFile.name}
                width={0}
                height={0}
                sizes="100vw"
                className="max-h-[65vh] w-full rounded-md object-contain"
              />
            ) : previewFile?.type === "application/pdf" ? (
              <iframe src={previewFile.url} title={previewFile.name} className="h-[65vh] w-full rounded-md border" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Preview tidak tersedia untuk tipe file ini</p>
                {previewFile && (
                  <Link
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Buka di tab baru
                  </Link>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
