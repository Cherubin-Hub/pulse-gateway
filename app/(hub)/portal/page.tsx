import React from "react";
import type { ApplicationItem, TraderProfile } from "@/types/portal";
import { Layers } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { gatewayDb } from "@/lib/db";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserProfileMenu } from "@/components/user-profile-menu";
import { SystemStatusBar } from "@/components/system-status-bar";
import { PortalClientGrid } from "@/components/portal-client-grid";
import { normalizeBaseUrl } from "@/lib/sso/signer";

const DEFAULT_APPS: ApplicationItem[] = [
  {
    id: "app-1",
    slug: "forex-pulse",
    name: "Forex Pulse",
    description:
      "Institutional Risk Engine, High-Impact News Gatekeeper, Multi-Timeframe Screeners & Execution Post-Mortem.",
    icon: "Activity",
    url: normalizeBaseUrl(process.env.FOREX_PULSE_URL, "http://localhost:3001"),
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
  {
    id: "app-4",
    slug: "quant-matrix",
    name: "Quant Matrix",
    description:
      "Algorithmic Arbitrage Screener, Cointegration Engine, and Automated Cross-Pair Statistical Arbitrage.",
    icon: "ShieldCheck",
    url: "",
    isActive: false,
    isComingSoon: true,
    category: "Quant",
  },
];

async function getApplications(): Promise<ApplicationItem[]> {
  try {
    const { data, error } = await gatewayDb
      .from("applications")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((item) => {
        let appUrl = item.url as string;
        if (item.slug === "forex-pulse" && process.env.FOREX_PULSE_URL) {
          appUrl = process.env.FOREX_PULSE_URL;
        }

        if (appUrl) {
          appUrl = normalizeBaseUrl(appUrl);
        }

        return {
          id: item.id as string,
          slug: item.slug as string,
          name: item.name as string,
          description: item.description as string,
          icon: item.icon as ApplicationItem["icon"],
          url: appUrl,
          isActive: Boolean(item.is_active),
          isComingSoon: Boolean(item.is_coming_soon),
          category: (item.category as ApplicationItem["category"]) || "Trading",
        };
      });
    }
  } catch {
    // Offline fallback
  }
  return DEFAULT_APPS;
}

export default async function PortalPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("pulse_gateway_user")?.value;

  if (!sessionCookie) {
    redirect("/login");
  }

  let profile: TraderProfile = {
    id: "trader-uuid-001",
    email: "trader@pulse.institutional",
    username: "trader",
    firstName: "Demo",
    lastName: "Trader",
    displayName: "Demo Trader",
  };

  try {
    const parsed = JSON.parse(sessionCookie) as TraderProfile;
    if (parsed.email) {
      profile = {
        ...profile,
        ...parsed,
      };
    }
  } catch {
    // Use fallback
  }

  const applications = await getApplications();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <header className="border-b border-border bg-card/70 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight leading-none">
              Pulse Gateway
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              Trading Hub & Single Sign-On Access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <UserProfileMenu profile={profile} />
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Welcome back, {profile.firstName || profile.displayName}
          </h2>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
            Select an authorized trading application to launch with secure Single Sign-On.
          </p>
        </div>

        {/* Dynamic Filter Grid */}
        <PortalClientGrid applications={applications} />
      </main>

      {/* Institutional Telemetry Footer */}
      <SystemStatusBar />
    </div>
  );
}
