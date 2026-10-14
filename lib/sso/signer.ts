import crypto from "crypto";

export interface SignerPayload {
  userId: string;
  email: string;
  name: string;
  appName: string;
}

/**
 * Normalizes a destination application base URL by trimming whitespace,
 * stripping accidental quotation marks, guaranteeing an http:// or https:// protocol,
 * and removing trailing slashes.
 */
export function normalizeBaseUrl(rawUrl?: string | null, fallback = "http://localhost:3001"): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return fallback;
  }
  let url = rawUrl.trim().replace(/^['"`]+|['"`]+$/g, "");
  if (!url) {
    return fallback;
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, "");
}

/**
 * Generates an ephemeral cryptographic SSO URL for handoff to a destination application.
 */
export function generateSSOLaunchUrl(
  destinationBaseUrl: string,
  user: SignerPayload,
  returnTo?: string
): string {
  const secret = process.env.CROSS_APP_SSO_SECRET;

  if (!secret) {
    throw new Error("CROSS_APP_SSO_SECRET is not configured on Pulse Gateway.");
  }

  const payload = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    appName: user.appName,
    timestamp: Date.now(),
    nonce: crypto.randomUUID(),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadBase64)
    .digest("hex");

  const cleanBaseUrl = normalizeBaseUrl(destinationBaseUrl, "http://localhost:3001");
  const url = new URL("/api/auth/sso", cleanBaseUrl);
  url.searchParams.set("payload", payloadBase64);
  url.searchParams.set("sig", signature);
  if (returnTo && returnTo.startsWith("/")) {
    url.searchParams.set("returnTo", returnTo);
  }

  return url.toString();
}
