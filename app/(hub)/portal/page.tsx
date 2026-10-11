import React from "react";
import { AppCard } from "@/components/app-card";
import type { ApplicationItem } from "@/types/portal";
import { Layers, ShieldCheck, LogOut, UserCircle } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutGateway } from "@/app/actions/gatewayAuth";
import { gatewayDb } from "@/lib/db";

const DEFAULT_APPS: ApplicationItem[] = [
  {
    id: "app-1",
    slug: "forex-pulse",
    name: "Forex Pulse",
    description:
      "Institutional Risk Engine, High-Impact News Gatekeeper, Multi-Timeframe Screeners & Execution Post-Mortem.",
    icon: "Activity",
    url: "http://localhost:3001",
    isActive: true,
    isComingSoon: false,
    category: "Trading",
  },
  {
    id: "app-2",
    slug: "crypto-radar",
    name: "Crypto Radar",
    description:
      "Order Book Imbalance, Funding Rates, Liquidation Heatmaps, and High-Velocity Volatility Tracking.",
    icon: "Flame",
    url: "",
    isActive: false,
    isComingSoon: true,
    category: "Trading",
  },
  {
    id: "app-3",
    slug: "execution-journal",
    name: "Execution Journal",
    description:
      "Psychology Edge Tracker, Rule Adherence Auditing, and Automated Trade Post-Mortems.",
    icon: "BookOpen",
    url: "",
    isActive: false,
    isComingSoon: true,
    category: "Analytics",
  },
];

async function getApplications(): Promise<ApplicationItem[]> {
  try {
    const { data, error } = await gatewayDb
      .from("applications")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id as string,
        slug: item.slug as string,
        name: item.name as string,
        description: item.description as string,
        icon: item.icon as ApplicationItem["icon"],
        url: item.url as string,
        isActive: Boolean(item.is_active),
        isComingSoon: Boolean(item.is_coming_soon),
        category: "Trading",
      }));
    }
  } catch {
    // Graceful offline fallback to default list
  }
  return DEFAULT_APPS;
}

export default async function PortalPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("pulse_gateway_user")?.value;

  // 1. Guard route: If not authenticated, redirect to Login
  if (!sessionCookie) {
    redirect("/login");
  }

  let userEmail = "trader@example.com";
  try {
    const parsed = JSON.parse(sessionCookie) as { email?: string };
    if (parsed.email) {
      userEmail = parsed.email;
    }
  } catch {
    // Use fallback
  }

  // 2. Fetch applications (Database with offline fallback)
  const applications = await getApplications();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight leading-none">
              Pulse Gateway
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">Central Trading Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs">
            <ShieldCheck className="h-3.5 w-3.5" /> Single Sign-On Active
          </div>

          {/* User Email Badge */}
          <div className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
            <UserCircle className="h-4 w-4 text-emerald-400" />
            <span className="font-mono">{userEmail}</span>
          </div>

          {/* Logout Action */}
          <form action={logoutGateway}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors py-1.5 px-2.5 rounded-md hover:bg-zinc-900"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Select Your Application
          </h2>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base">
            Choose an authorized workspace to launch with secure Single Sign-On.
          </p>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        Forex Pulse Intelligence Network &bull; Pulse Gateway v1.0
      </footer>
    </div>
  );
}
