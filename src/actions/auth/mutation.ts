"use server";

import { auth } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

export type AuthActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = Object.fromEntries(formData);
  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: result.data.email,
        password: result.data.password,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.body?.message || "Email atau password salah",
      };
    }
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }

  redirect("/");
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = Object.fromEntries(formData);
  const result = registerSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.body?.message || "Registrasi gagal",
      };
    }
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }

  redirect("/");
}
