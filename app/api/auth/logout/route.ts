import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Federated Single Sign-Out (Global Logout) Endpoint for Pulse Gateway.
 * Clears the pulse_gateway_user session cookie and redirects to login or returnTo URL.
 */
export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("returnTo") || "/login";

  let destination = "/login";
  try {
    const url = new URL(returnTo, request.url);
    destination = url.toString();
  } catch {
    destination = "/login";
  }

  const response = NextResponse.redirect(destination);

  // Expire and clear the Gateway session cookie
  response.cookies.delete("pulse_gateway_user");
  response.cookies.set({
    name: "pulse_gateway_user",
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export async function POST(request: NextRequest) {
  return GET(request);
}
