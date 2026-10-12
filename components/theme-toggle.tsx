"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydration match pattern
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-24 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
    );
  }

  const options: Array<{ value: "light" | "dark" | "system"; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className="flex items-center p-1 rounded-xl bg-secondary border border-border shadow-inner">
      {options.map((option) => {
        const IconComponent = option.icon;
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`relative flex items-center justify-center p-1.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={`Switch to ${option.label} mode`}
            title={`Switch to ${option.label} mode`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/80"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center">
              <IconComponent className="h-3.5 w-3.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
