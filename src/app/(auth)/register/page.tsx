"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerAction,
  type AuthActionState,
} from "@/features/auth/actions/mutation";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useForm } from "react-hook-form";

const initialState: AuthActionState = { success: false };

export default function RegisterPage() {
  const {
    register,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Applyorbit</CardTitle>
        <CardDescription>Buat akun baru</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.message && !state.success && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.message}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              aria-invalid={!!errors.name || !!state.errors?.name}
              {...register("name")}
            />
            {(errors.name || state.errors?.name) && (
              <p className="text-xs text-destructive mt-1" role="alert">
                {errors.name?.message || state.errors?.name?.[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              aria-invalid={!!errors.email || !!state.errors?.email}
              {...register("email")}
            />
            {(errors.email || state.errors?.email) && (
              <p className="text-xs text-destructive mt-1" role="alert">
                {errors.email?.message || state.errors?.email?.[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              aria-invalid={!!errors.password || !!state.errors?.password}
              {...register("password")}
            />
            {(errors.password || state.errors?.password) && (
              <p className="text-xs text-destructive mt-1" role="alert">
                {errors.password?.message || state.errors?.password?.[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              aria-invalid={
                !!errors.confirmPassword || !!state.errors?.confirmPassword
              }
              {...register("confirmPassword")}
            />
            {(errors.confirmPassword || state.errors?.confirmPassword) && (
              <p className="text-xs text-destructive mt-1" role="alert">
                {errors.confirmPassword?.message ||
                  state.errors?.confirmPassword?.[0]}
              </p>
            )}
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
