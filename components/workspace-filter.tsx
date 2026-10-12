"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface WorkspaceFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Workspaces" },
  { id: "live", label: "Live Only" },
  { id: "Trading", label: "Trading" },
  { id: "Analytics", label: "Analytics" },
];

export function WorkspaceFilter({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: WorkspaceFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary/80 border border-border w-full sm:w-auto overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search workspaces..."
          className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-8 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
