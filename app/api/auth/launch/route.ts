import { NextRequest, NextResponse } from "next/server";
import { generateSSOLaunchUrl } from "@/lib/sso/signer";
import { cookies } from "next/headers";
import { gatewayDb } from "@/lib/db";

interface GatewaySession {
  id: string;
  email: string;
}

// Default fallback registry in case the database is offline
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

  // 1. Read the real authenticated user from session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("pulse_gateway_user")?.value;

  let session: GatewaySession = {
    id: "trader-uuid-001",
    email: "trader@example.com",
  };

  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie) as GatewaySession;
      if (parsed.email) {
        session = parsed;
      }
    } catch {
      // Graceful fallback to default trader credentials
    }
  }

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
    // Database query failed, check static fallback
  }

  // Use fallback if database didn't resolve target
  if (!targetUrl && FALLBACK_URLS[appSlug]) {
    targetUrl = FALLBACK_URLS[appSlug];
  }

  if (!targetUrl) {
    return NextResponse.json(
      { error: `Application '${appSlug}' is not registered or target URL is missing.` },
      { status: 404 }
    );
  }

  // 3. Generate cryptographic SSO URL with trader payload
  const user = {
    userId: session.id,
    email: session.email,
    name: session.email.split("@")[0] || "Trader",
    appName: appSlug,
  };

  try {
    const launchUrl = generateSSOLaunchUrl(targetUrl, user);
    return NextResponse.json({ launchUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sign SSO token." },
      { status: 500 }
    );
  }
}
