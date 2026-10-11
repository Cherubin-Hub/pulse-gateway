import crypto from "crypto";

export interface SignerPayload {
  userId: string;
  email: string;
  name: string;
  appName: string;
}

/**
 * Generates an ephemeral cryptographic SSO URL for handoff to a destination application.
 */
export function generateSSOLaunchUrl(
  destinationBaseUrl: string,
  user: SignerPayload
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

  const url = new URL("/api/auth/sso", destinationBaseUrl);
  url.searchParams.set("payload", payloadBase64);
  url.searchParams.set("sig", signature);

  return url.toString();
}
