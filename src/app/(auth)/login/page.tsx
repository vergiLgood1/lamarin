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
import { Separator } from "@/components/ui/separator";
import {
  loginAction,
  type AuthActionState,
} from "@/features/auth/actions/mutation";
import { signIn } from "@/lib/auth-client";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";

const initialState: AuthActionState = { success: false };

export default function LoginPage() {
  const [isPendingGoogle, startGoogleTransition] = useTransition();

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  function handleGoogleLogin() {
    startGoogleTransition(async () => {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    });
  }

  const isDisabled = isPending || isPendingGoogle;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Applyorbit</CardTitle>
        <CardDescription>Masuk ke akun Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.message && !state.success && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.message}
            </div>
          )}
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
              placeholder="••••••••"
              aria-invalid={!!errors.password || !!state.errors?.password}
              {...register("password")}
            />
            {(errors.password || state.errors?.password) && (
              <p className="text-xs text-destructive mt-1" role="alert">
                {errors.password?.message || state.errors?.password?.[0]}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isDisabled}>
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
          disabled={isDisabled}
        >
          <IconBrandGoogle className="mr-2 h-4 w-4" />
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
