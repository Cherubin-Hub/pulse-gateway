"use server";

import { gatewayDb } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateSSOLaunchUrl } from "@/lib/sso/signer";
import type { TraderProfile } from "@/types/portal";

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Signs in an existing trader against the Gateway database.
 */
export async function loginToGateway(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const appSlug = (formData.get("app") as string)?.trim();
  const returnTo = (formData.get("returnTo") as string)?.trim();

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

  const meta = data.user.user_metadata || {};
  const firstName = (meta.first_name as string) || "";
  const middleName = (meta.middle_name as string) || undefined;
  const lastName = (meta.last_name as string) || "";
  const username = (meta.username as string) || email.split("@")[0] || "trader";
  const displayName =
    (meta.display_name as string) ||
    `${firstName} ${lastName}`.trim() ||
    username;

  const profile: TraderProfile = {
    id: data.user.id,
    email: data.user.email ?? email,
    username,
    firstName,
    middleName,
    lastName,
    displayName,
    createdAt: data.user.created_at,
  };

  const cookieStore = await cookies();
  cookieStore.set({
    name: "pulse_gateway_user",
    value: JSON.stringify(profile),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  if (appSlug === "forex-pulse") {
    const targetUrl = process.env.FOREX_PULSE_URL || "http://localhost:3001";
    const ssoUrl = generateSSOLaunchUrl(
      targetUrl,
      {
        userId: profile.id,
        email: profile.email,
        name: profile.displayName || profile.username || "Trader",
        appName: "forex-pulse",
      },
      returnTo || undefined
    );
    redirect(ssoUrl);
  }

  redirect("/portal");
}

/**
 * Creates a new trader account in the Gateway database with full profile metadata.
 */
export async function signUpToGateway(formData: FormData): Promise<AuthActionResult> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const middleName = (formData.get("middleName") as string)?.trim() || undefined;
  const lastName = (formData.get("lastName") as string)?.trim();
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const appSlug = (formData.get("app") as string)?.trim();
  const returnTo = (formData.get("returnTo") as string)?.trim();

  if (!firstName || !lastName || !username || !email || !password) {
    return { error: "Please fill in all required fields." };
  }

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters long." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const displayName = `${firstName} ${lastName}`.trim();

  const { data, error } = await gatewayDb.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        middle_name: middleName || "",
        last_name: lastName,
        username,
        display_name: displayName,
      },
    },
  });

  if (error || !data.user) {
    return { error: error?.message || "Failed to create trader account." };
  }

  const profile: TraderProfile = {
    id: data.user.id,
    email: data.user.email ?? email,
    username,
    firstName,
    middleName,
    lastName,
    displayName,
    createdAt: data.user.created_at,
  };

  const cookieStore = await cookies();
  cookieStore.set({
    name: "pulse_gateway_user",
    value: JSON.stringify(profile),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  if (appSlug === "forex-pulse") {
    const targetUrl = process.env.FOREX_PULSE_URL || "http://localhost:3001";
    const ssoUrl = generateSSOLaunchUrl(
      targetUrl,
      {
        userId: profile.id,
        email: profile.email,
        name: profile.displayName || profile.username || "Trader",
        appName: "forex-pulse",
      },
      returnTo || undefined
    );
    redirect(ssoUrl);
  }

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
