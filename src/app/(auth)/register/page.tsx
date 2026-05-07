"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { registerSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FormErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");

  function handleSubmit(formData: FormData) {
    setErrors({});
    setGeneralError("");

    const rawData = Object.fromEntries(formData);
    const result = registerSchema.safeParse(rawData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as FormErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await signUp.email({
          name: result.data.name,
          email: result.data.email,
          password: result.data.password,
        });

        if (response.error) {
          const errorMsg = response.error.message || "Registrasi gagal";
          setGeneralError(errorMsg);
          toast.error(errorMsg);
        } else {
          toast.success("Registrasi berhasil! Selamat datang.");
          router.push("/");
          router.refresh();
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan. Silakan coba lagi.";
        setGeneralError(errorMsg);
        toast.error(errorMsg);
      }
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Applyorbit</CardTitle>
        <CardDescription>Buat akun baru</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {generalError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              aria-invalid={!!errors.name}
            />
            <FormMessage errors={errors.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              aria-invalid={!!errors.email}
            />
            <FormMessage errors={errors.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 8 karakter"
              aria-invalid={!!errors.password}
            />
            <FormMessage errors={errors.password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              aria-invalid={!!errors.confirmPassword}
            />
            <FormMessage errors={errors.confirmPassword} />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Memproses..." : "Daftar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
