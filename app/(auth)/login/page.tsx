"use client";

import React, { useState, useMemo } from "react";
import { loginToGateway, signUpToGateway } from "@/app/actions/gatewayAuth";
import {
  Layers,
  ArrowRight,
  Lock,
  Mail,
  UserPlus,
  Eye,
  EyeOff,
  User,
  AtSign,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

export default function GatewayLoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password visibility & values
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  // Real-time password strength calculation
  const strength = useMemo(() => {
    let score = 0;
    if (passwordInput.length >= 8) score += 1;
    if (/[A-Z]/.test(passwordInput)) score += 1;
    if (/[0-9]/.test(passwordInput)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordInput)) score += 1;
    return score;
  }, [passwordInput]);

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    if (isSignUp && passwordInput !== confirmPasswordInput) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const action = isSignUp ? signUpToGateway : loginToGateway;
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  function handleFillDemo() {
    const emailEl = document.querySelector<HTMLInputElement>('input[name="email"]');
    const passEl = document.querySelector<HTMLInputElement>('input[name="password"]');
    if (emailEl) emailEl.value = "trader@pulse.institutional";
    if (passEl) {
      passEl.value = "ForexPulse2026!";
      setPasswordInput("ForexPulse2026!");
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 bg-grid-pattern transition-colors">
      {/* Top Theme Controls */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Decorative Glow Orb */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="border border-border/80 bg-card/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3.5 shadow-inner">
              <Layers className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pulse Gateway
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
              Institutional Single Sign-On Access Control & Trading Workspaces
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 rounded-2xl bg-secondary border border-border mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                !isSignUp
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                isSignUp
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register Trader
            </button>
          </div>

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignUp ? (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5"
                >
                  {/* First Name & Middle Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          name="firstName"
                          placeholder="e.g. Alexander"
                          required
                          className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        Middle Name <span className="text-muted-foreground text-[10px]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          name="middleName"
                          placeholder="e.g. Vance"
                          className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Last Name & Username */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="e.g. Sterling"
                          required
                          className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        Username <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          name="username"
                          placeholder="trader_handle"
                          required
                          className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                Institutional Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  placeholder="trader@pulse.institutional"
                  required
                  className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Meter (Registration) */}
              {isSignUp && passwordInput.length > 0 && (
                <div className="mt-2 p-2.5 rounded-xl bg-secondary/70 border border-border">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                    <span className="text-muted-foreground">Password Strength:</span>
                    <span className="font-semibold text-emerald-500">
                      {strengthLabels[strength - 1] || "Very Weak"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`rounded-full transition-all duration-300 ${
                          strength >= level
                            ? strengthColors[strength - 1]
                            : "bg-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Registration) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <label className="block text-xs font-semibold text-foreground/80 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••••••"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPasswordInput && passwordInput !== confirmPasswordInput && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Passwords do not match
                  </p>
                )}
              </motion.div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                "Verifying Credentials..."
              ) : isSignUp ? (
                <>
                  Register Trader <UserPlus className="h-4 w-4" />
                </>
              ) : (
                <>
                  Enter Trading Portal <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          {!isSignUp && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-emerald-500 transition-colors font-medium"
              >
                <Sparkles className="h-3 w-3" /> Fill Demo Trader Credentials
              </button>
            </div>
          )}

          {/* Security Badge */}
          <div className="mt-6 pt-5 border-t border-border flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>End-to-End Cryptographic SSO Session Protection</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
