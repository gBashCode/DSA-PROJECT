"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Code2, CheckCircle2 } from "lucide-react";
import { useAuth, AVATARS } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

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
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!loading && user) {
    router.push("/tracker");
    return null;
  }

  async function handleOAuth(provider: "google" | "github") {
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  async function handleLogin() {
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) router.push("/tracker");
    else setError(result.error ?? "Login failed.");
  }

  async function handleSignup() {
    setError("");
    if (!username.trim()) { setError("Username is required."); return; }
    setSubmitting(true);
    const result = await signup(email, password, username, displayName || username, avatar, "");
    setSubmitting(false);
    if (result.ok) router.push("/tracker");
    else setError(result.error ?? "Signup failed.");
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-border flex-col items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-amber/10 mb-6">
            <Code2 className="h-8 w-8 text-accent-amber" />
          </div>
          <h2 className="text-2xl font-mono font-bold text-text mb-3">Master DSA</h2>
          <p className="text-sm font-mono text-text-muted leading-relaxed">
            173+ problems across 26 patterns. Track progress, visualize algorithms, and prepare for interviews.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border border-border bg-bg">
              <p className="text-lg font-mono font-bold text-accent-amber">173+</p>
              <p className="text-[10px] font-mono text-text-muted">Problems</p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-bg">
              <p className="text-lg font-mono font-bold text-accent-teal">26</p>
              <p className="text-[10px] font-mono text-text-muted">Patterns</p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-bg">
              <p className="text-lg font-mono font-bold text-accent-rose">12</p>
              <p className="text-[10px] font-mono text-text-muted">Weeks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-mono font-bold text-text mb-1">
              {tab === "login" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-sm font-mono text-text-muted">
              {tab === "login" ? "Welcome back! Enter your credentials." : "Join and start solving problems."}
            </p>
          </div>

          {/* OAuth - Disabled until credentials configured */}
          {/* <div className="grid grid-cols-2 gap-2 mb-6">
            <button onClick={() => handleOAuth("google")} ...>Google</button>
            <button onClick={() => handleOAuth("github")} ...>GitHub</button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div> */}

          {/* Tab Toggle */}
          <div className="flex gap-0.5 p-0.5 rounded-lg bg-bg mb-6">
            {(["login", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2 rounded-md text-xs font-mono font-medium transition-all ${
                  tab === t ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg border border-accent-rose/20 bg-accent-rose/5 text-xs font-mono text-accent-rose">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {tab === "signup" && (
              <>
                <InputField icon={<User className="w-4 h-4" />} value={username} onChange={setUsername} placeholder="username" />
                <InputField icon={<User className="w-4 h-4" />} value={displayName} onChange={setDisplayName} placeholder="Display Name" />
                <div>
                  <label className="block text-[10px] font-mono text-text-muted mb-1.5 uppercase tracking-wider">Avatar</label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATARS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAvatar(a)}
                        className={`w-9 h-9 rounded-lg border text-base flex items-center justify-center transition-all ${
                          avatar === a ? "border-accent-amber bg-accent-amber/10 scale-110" : "border-border bg-bg hover:border-border/80"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <InputField icon={<Mail className="w-4 h-4" />} value={email} onChange={setEmail} placeholder="Email" type="email" />

            <div>
              <label className="block text-[10px] font-mono text-text-muted mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-10 rounded-lg border border-border bg-bg text-text font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/20 transition-all"
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
              className="w-full h-10 rounded-lg bg-accent-amber text-bg font-mono text-sm font-bold hover:bg-accent-amber/90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{tab === "login" ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>

          <p className="mt-6 text-center text-xs font-mono text-text-muted">
            {tab === "login" ? "No account? " : "Have an account? "}
            <button onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); }} className="text-accent-amber hover:underline">
              {tab === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, value, onChange, placeholder, type = "text" }: { icon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-mono text-text-muted mb-1.5 uppercase tracking-wider">{placeholder}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-bg text-text font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/20 transition-all"
        />
      </div>
    </div>
  );
}
