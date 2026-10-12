"use client";

import React, { useState, useMemo } from "react";
import type { ApplicationItem } from "@/types/portal";
import { AppCard } from "@/components/app-card";
import { WorkspaceFilter } from "@/components/workspace-filter";
import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";

interface PortalClientGridProps {
  applications: ApplicationItem[];
}

export function PortalClientGrid({ applications }: PortalClientGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === "all") return true;
      if (activeCategory === "live") return app.isActive && !app.isComingSoon;
      return app.category === activeCategory;
    });
  }, [applications, searchQuery, activeCategory]);

  return (
    <div>
      <WorkspaceFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {filteredApps.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-secondary/30">
          <Layers className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">
            No workspaces found
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
