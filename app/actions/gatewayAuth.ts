"use server";

import { gatewayDb } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Signs in an existing trader against the Gateway database.
 */
export async function loginToGateway(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { data, error } = await gatewayDb.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: error?.message || "Invalid login credentials." };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "pulse_gateway_user",
    value: JSON.stringify({
      id: data.user.id,
      email: data.user.email,
    }),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/portal");
}

/**
 * Creates a new trader account in the Gateway database and logs them in immediately.
 */
export async function signUpToGateway(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const { data, error } = await gatewayDb.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: error?.message || "Failed to create account." };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "pulse_gateway_user",
    value: JSON.stringify({
      id: data.user.id,
      email: data.user.email,
    }),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/portal");
}

/**
 * Destroys the Gateway session cookie and redirects to login.
 */
export async function logoutGateway() {
  const cookieStore = await cookies();
  cookieStore.delete("pulse_gateway_user");
  redirect("/login");
}
