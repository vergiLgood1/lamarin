"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

interface SubmitButtonProps extends Omit<ComponentProps<typeof Button>, "type"> {
  pendingText?: string;
}

export function SubmitButton({
  children,
  pendingText,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? (pendingText || "Memproses...") : children}
    </Button>
  );
}
