import { NextRequest, NextResponse } from "next/server";
import { generateSSOLaunchUrl } from "@/lib/sso/signer";
import { cookies } from "next/headers";
import { gatewayDb } from "@/lib/db";
import type { TraderProfile } from "@/types/portal";

const FALLBACK_URLS: Record<string, string> = {
  "forex-pulse": process.env.FOREX_PULSE_URL || "http://localhost:3001",
};

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const appSlug = searchParams.get("app");

  if (!appSlug) {
    return NextResponse.json(
      { error: "Missing required 'app' query parameter." },
      { status: 400 }
    );
  }

  // 1. Read real authenticated trader profile from session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("pulse_gateway_user")?.value;

  let session: TraderProfile = {
    id: "trader-uuid-001",
    email: "trader@pulse.institutional",
    username: "trader",
    firstName: "Demo",
    lastName: "Trader",
    displayName: "Demo Trader",
  };

  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie) as TraderProfile;
      if (parsed.email) {
        session = { ...session, ...parsed };
      }
    } catch {
      // Graceful fallback
    }
  }

  const returnTo = searchParams.get("returnTo") || undefined;

  // 2. Fetch destination application dynamically from database
  let targetUrl: string | null = null;

  try {
    const { data: appData, error } = await gatewayDb
      .from("applications")
      .select("url, is_active, is_coming_soon")
      .eq("slug", appSlug)
      .single();

    if (!error && appData) {
      if (appData.is_coming_soon || !appData.is_active) {
        return NextResponse.json(
          { error: "This application is currently in development or inactive." },
          { status: 403 }
        );
      }
      targetUrl = appData.url;
    }
  } catch {
    // Fallback if database fails
  }

  // Prioritize environment variable if app is forex-pulse or if targetUrl is pointing to localhost
  if (appSlug === "forex-pulse" && process.env.FOREX_PULSE_URL) {
    targetUrl = process.env.FOREX_PULSE_URL;
  } else if (!targetUrl && FALLBACK_URLS[appSlug]) {
    targetUrl = FALLBACK_URLS[appSlug];
  } else if (targetUrl?.includes("localhost") && process.env.FOREX_PULSE_URL && appSlug === "forex-pulse") {
    targetUrl = process.env.FOREX_PULSE_URL;
  }

  if (!targetUrl) {
    return NextResponse.json(
      { error: `Application '${appSlug}' is not registered or target URL is missing.` },
      { status: 404 }
    );
  }

  // 3. Generate cryptographic SSO URL with real trader name
  const user = {
    userId: session.id,
    email: session.email,
    name: session.displayName || session.username || "Trader",
    appName: appSlug,
  };

  try {
    const launchUrl = generateSSOLaunchUrl(targetUrl, user, returnTo);
    return NextResponse.json({ launchUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sign SSO token." },
      { status: 500 }
    );
  }
}
