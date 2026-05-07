interface FormMessageProps {
  errors?: string[];
}

export function FormMessage({ errors }: FormMessageProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <p className="text-xs text-destructive mt-1" role="alert" aria-live="polite">
      {errors[0]}
    </p>
  );
}
