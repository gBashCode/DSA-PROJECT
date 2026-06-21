"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth, AVATARS } from "@/lib/auth";

type Tab = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signup, login } = useAuth();
  const [tab, setTab] = useState<Tab>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!loading && user) {
    router.push("/tracker");
    return null;
  }

  async function handleLogin() {
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      router.push("/tracker");
    } else {
      setError(result.error ?? "Login failed.");
    }
  }

  async function handleSignup() {
    setError("");
    setSuccess("");
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    setSubmitting(true);
    const result = await signup(email, password, username, displayName || username, avatar, "");
    setSubmitting(false);
    if (result.ok) {
      router.push("/tracker");
    } else {
      setError(result.error ?? "Signup failed.");
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-text mb-2">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm font-mono text-text-muted">
            {tab === "login" ? "Sign in to track your progress" : "Start your DSA journey"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg border border-border bg-surface mb-6">
          <button
            onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-mono transition-colors ${
              tab === "login" ? "bg-accent-amber text-bg font-bold" : "text-text-muted hover:text-text"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-mono transition-colors ${
              tab === "signup" ? "bg-accent-amber text-bg font-bold" : "text-text-muted hover:text-text"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-accent-rose/30 bg-accent-rose/5 text-xs font-mono text-accent-rose">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg border border-accent-teal/30 bg-accent-teal/5 text-xs font-mono text-accent-teal flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        <div className="space-y-4">
          {tab === "signup" && (
            <>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your-username"
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-surface text-text font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-amber/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full h-10 px-4 rounded-lg border border-border bg-surface text-text font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-amber/50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1.5">Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      className={`w-10 h-10 rounded-lg border text-lg flex items-center justify-center transition-colors ${
                        avatar === a ? "border-accent-amber bg-accent-amber/10" : "border-border bg-surface hover:border-border/80"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono text-text-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-surface text-text font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-amber/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-10 pr-10 rounded-lg border border-border bg-surface text-text font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-amber/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={tab === "login" ? handleLogin : handleSignup}
            disabled={submitting || !email || !password}
            className="w-full h-10 rounded-lg bg-accent-amber text-bg font-mono text-sm font-bold hover:bg-accent-amber/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {tab === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-xs font-mono text-text-muted">
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); }}
            className="text-accent-amber hover:underline"
          >
            {tab === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
