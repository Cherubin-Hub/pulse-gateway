"use client";

import React, { useState } from "react";
import { Activity, Flame, BookOpen, ShieldCheck, ExternalLink, Lock } from "lucide-react";
import type { ApplicationItem } from "@/types/portal";

const iconMap = {
  Activity,
  Flame,
  BookOpen,
  ShieldCheck,
};

interface AppCardProps {
  app: ApplicationItem;
}

export function AppCard({ app }: AppCardProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const IconComponent = iconMap[app.icon] || Activity;

  async function handleLaunch() {
    if (app.isComingSoon || !app.isActive) return;

    setIsLaunching(true);
    try {
      const response = await fetch(`/api/auth/launch?app=${app.slug}`, {
        method: "POST",
      });

      const data = await response.json();
      if (data.launchUrl) {
        window.location.href = data.launchUrl;
      } else {
        alert(data.error || "Failed to generate launch URL.");
        setIsLaunching(false);
      }
    } catch {
      alert("Network error while launching application.");
      setIsLaunching(false);
    }
  }

  return (
    <div
      className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${
        app.isComingSoon
          ? "border-zinc-800/80 bg-zinc-950/40 opacity-70"
          : "border-zinc-800 bg-zinc-950/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center border ${
              app.isComingSoon
                ? "bg-zinc-900 border-zinc-800 text-zinc-500"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          {/* Status Indicator Pill */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                app.isComingSoon
                  ? "bg-amber-500 animate-pulse"
                  : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              }`}
            />
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-md border font-medium ${
                app.isComingSoon
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {app.isComingSoon ? "In Dev" : "Live"}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
          {app.name}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          {app.description}
        </p>
      </div>

      <div>
        {app.isComingSoon ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
          >
            <Lock className="h-3.5 w-3.5" /> Workspace Locked
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md active:scale-[0.98]"
          >
            {isLaunching ? (
              "Authenticating Handshake..."
            ) : (
              <>
                Launch Workspace <ExternalLink className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
