"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Activity, Globe } from "lucide-react";

export function SystemStatusBar() {
  const [timeUtc, setTimeUtc] = useState<string>("");
  const [timePht, setTimePht] = useState<string>("");

  useEffect(() => {
    function updateClocks() {
      const now = new Date();
      setTimeUtc(
        now.toLocaleTimeString("en-GB", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setTimePht(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-t border-border bg-card/60 backdrop-blur-md px-6 py-2.5 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground gap-3">
      {/* Network Health */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
        <span className="font-semibold text-foreground">Pulse Gateway Network:</span>
        <span className="text-emerald-500 font-medium">Nominal (99.98% Uptime)</span>
      </div>

      {/* Protocol Badge */}
      <div className="hidden md:flex items-center gap-1.5 font-mono text-[10px] bg-secondary px-2.5 py-1 rounded-lg border border-border">
        <ShieldCheck className="h-3 w-3 text-emerald-500" />
        <span>HMAC-SHA256 Encrypted Handshake</span>
      </div>

      {/* Clocks */}
      <div className="flex items-center gap-4 font-mono text-[11px]">
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3 text-muted-foreground" />
          <span>UTC: {timeUtc || "--:--:--"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-emerald-500" />
          <span className="text-foreground">PHT: {timePht || "--:--:--"}</span>
        </div>
      </div>
    </div>
  );
}
