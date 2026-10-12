"use client";

import React, { useState } from "react";
import {
  Activity,
  Flame,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Cpu,
  Zap,
  ExternalLink,
  Lock,
  Radio,
} from "lucide-react";
import type { ApplicationItem } from "@/types/portal";
import { motion } from "framer-motion";

const iconMap = {
  Activity,
  Flame,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Cpu,
  Zap,
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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${
        app.isComingSoon
          ? "border-border/60 bg-card/40 opacity-75"
          : "border-border bg-card/90 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          {/* Icon Badge */}
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-colors ${
              app.isComingSoon
                ? "bg-secondary border-border text-muted-foreground"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500/20"
            }`}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          {/* Operational Status Pill */}
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold uppercase tracking-wider ${
                app.isComingSoon
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}
            >
              {app.isComingSoon ? "In Dev" : "Operational"}
            </span>

            {/* Live Indicator Dot */}
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                app.isComingSoon
                  ? "bg-amber-500"
                  : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"
              }`}
            />
          </div>
        </div>

        {/* Card Header & Category */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
            {app.category}
          </span>
          {app.isActive && (
            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
              <Radio className="h-2.5 w-2.5 text-emerald-500" /> ~12ms
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-emerald-500 transition-colors mb-2">
          {app.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
          {app.description}
        </p>
      </div>

      <div>
        {app.isComingSoon ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-secondary border border-border text-muted-foreground cursor-not-allowed"
          >
            <Lock className="h-3.5 w-3.5" /> Workspace Locked
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/10 active:scale-[0.98] transition-all"
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
    </motion.div>
  );
}
