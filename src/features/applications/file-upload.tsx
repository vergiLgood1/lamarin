"use client";

import { useUploadThing } from "@/lib/uploadthing-client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, FileText, Image as ImageIcon, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  url: string;
  key: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
  maxFiles?: number;
}

export function FileUpload({
  onFilesUploaded,
  existingFiles = [],
  maxFiles = 10,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const { startUpload } = useUploadThing("documentUploader", {
    onClientUploadComplete: (res) => {
      const uploaded: UploadedFile[] = res.map((file) => ({
        name: file.name,
        url: file.ufsUrl,
        key: file.key,
        size: file.size,
        type: file.type,
      }));
      const newFiles = [...files, ...uploaded];
      setFiles(newFiles);
      onFilesUploaded(newFiles);
      setIsUploading(false);
      toast.success(`${uploaded.length} file berhasil diupload`);
    },
    onUploadError: (error) => {
      setIsUploading(false);
      toast.error(error.message || "Gagal upload file");
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      const remaining = maxFiles - files.length;
      if (selectedFiles.length > remaining) {
        toast.error(`Maksimal ${maxFiles} file. Sisa slot: ${remaining}`);
        return;
      }

      startUpload(Array.from(selectedFiles));
      e.target.value = "";
    },
    [files.length, maxFiles, startUpload]
  );

  function removeFile(key: string) {
    const newFiles = files.filter((f) => f.key !== key);
    setFiles(newFiles);
    onFilesUploaded(newFiles);
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
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading || files.length >= maxFiles}
          onClick={() => document.getElementById("doc-upload")?.click()}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Upload Dokumen"}
        </Button>
        <span className="text-xs text-muted-foreground">
          PDF, gambar. Maks {maxFiles} file.
        </span>
      </div>

      <input
        id="doc-upload"
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <div
              key={file.key}
              className="group flex items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1.5 text-xs"
            >
              {isImage(file.type) ? (
                <ImageIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              <span className="max-w-[120px] truncate font-medium">
                {file.name}
              </span>
              <span className="text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setPreviewFile(file)}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="h-4 w-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(file.key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Badge variant="secondary" className="text-xs self-center">
            {files.length}/{maxFiles}
          </Badge>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={!!previewFile}
        onOpenChange={(open) => {
          if (!open) setPreviewFile(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">
              {previewFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            {previewFile && isImage(previewFile.type) ? (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="w-full rounded-md object-contain max-h-[65vh]"
              />
            ) : previewFile?.type === "application/pdf" ? (
              <iframe
                src={previewFile.url}
                title={previewFile.name}
                className="h-[65vh] w-full rounded-md border"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Preview tidak tersedia untuk tipe file ini
                </p>
                <Button
                  variant="outline"
                  render={
                    <a
                      href={previewFile?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  Buka di tab baru
                </Button>
              </div>
            )}
          </div>
          {previewFile && (
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-xs text-muted-foreground">
                {formatFileSize(previewFile.size)} &middot; {previewFile.type}
              </span>
              <Button
                variant="outline"
                size="sm"
                render={
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Buka di tab baru
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
