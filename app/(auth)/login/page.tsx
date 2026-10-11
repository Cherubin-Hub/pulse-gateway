"use client";

import React, { useState } from "react";
import { loginToGateway, signUpToGateway } from "@/app/actions/gatewayAuth";
import { Layers, ArrowRight, Lock, Mail, UserPlus } from "lucide-react";

export default function GatewayLoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const action = isSignUp ? signUpToGateway : loginToGateway;
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-950/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
            <Layers className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Pulse Gateway</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isSignUp
              ? "Create an account to access trading workspaces"
              : "Sign in to access your authorized trading applications"}
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                name="email"
                placeholder="trader@example.com"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                name="password"
                placeholder="••••••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 mt-2 active:scale-[0.98]"
          >
            {isLoading ? (
              "Authenticating..."
            ) : isSignUp ? (
              <>
                Create Account <UserPlus className="h-4 w-4" />
              </>
            ) : (
              <>
                Sign In to Hub <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-6 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-400">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 ml-1"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 ml-1"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
