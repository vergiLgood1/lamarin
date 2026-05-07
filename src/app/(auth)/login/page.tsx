"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validations";
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
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FormErrors {
  email?: string[];
  password?: string[];
}

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");

  function handleSubmit(formData: FormData) {
    setErrors({});
    setGeneralError("");

    const rawData = Object.fromEntries(formData);
    const result = loginSchema.safeParse(rawData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as FormErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await signIn.email({
          email: result.data.email,
          password: result.data.password,
        });

        if (response.error) {
          setGeneralError(response.error.message || "Login gagal");
          toast.error(response.error.message || "Login gagal");
        } else {
          toast.success("Login berhasil");
          router.push("/");
          router.refresh();
        }
      } catch {
        setGeneralError("Terjadi kesalahan. Silakan coba lagi.");
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  }

  function handleGoogleLogin() {
    startTransition(async () => {
      try {
        await signIn.social({
          provider: "google",
          callbackURL: "/",
        });
      } catch {
        setGeneralError("Gagal login dengan Google");
        toast.error("Gagal login dengan Google");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Applyorbit</CardTitle>
        <CardDescription>Masuk ke akun Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {generalError}
            </div>
          )}
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
              placeholder="••••••••"
              aria-invalid={!!errors.password}
            />
            <FormMessage errors={errors.password} />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">atau</span>
          <Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isPending}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Masuk dengan Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Daftar
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
