"use client";

import React, { useState, useRef, useEffect } from "react";
import type { TraderProfile } from "@/types/portal";
import { logoutGateway } from "@/app/actions/gatewayAuth";
import { ShieldCheck, LogOut, AtSign, Mail } from "lucide-react";

interface UserProfileMenuProps {
  profile: TraderProfile;
}

export function UserProfileMenu({ profile }: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials =
    profile.firstName && profile.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
      : profile.username.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border transition-colors text-left"
      >
        <div className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-bold leading-none text-foreground">
            {profile.displayName || profile.username}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5 leading-none">
            @{profile.username}
          </p>
        </div>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="border-b border-border pb-3 mb-3">
            <p className="text-xs font-bold text-foreground">
              {profile.displayName}
            </p>
            <p className="text-xs font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
              <AtSign className="h-3 w-3" /> {profile.username}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
              <Mail className="h-3 w-3" /> {profile.email}
            </p>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl font-medium">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>SSO Active &bull; 7-Day Session</span>
            </div>
          </div>

          <form action={logoutGateway}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-semibold transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out of Hub
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
