"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    router.push("/profile");
    return null;
  }

  async function handleLogin() {
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      router.push("/profile");
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
    const result = await signup(email, password, username, displayName || username, avatar, bio);
    setSubmitting(false);
    if (result.ok) {
      setSuccess("Check your email for a confirmation link!");
    } else {
      setError(result.error ?? "Signup failed.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !submitting) {
      if (tab === "login") handleLogin();
      else handleSignup();
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          {tab === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          {tab === "login"
            ? "Log in to track your progress and join guilds."
            : "Sign up to start your DSA journey."}
        </p>
      </div>

      <div className="mb-6 flex rounded-lg border border-border bg-surface p-1">
        {(["login", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setError("");
              setSuccess("");
            }}
            className={cn(
              "flex-1 rounded-md py-2 font-mono text-sm font-medium transition-colors",
              tab === t
                ? "bg-accent-amber/15 text-accent-amber"
                : "text-text-muted hover:text-text"
            )}
          >
            {t === "login" ? "Login" : "Sign Up"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-accent-danger/30 bg-accent-danger/5 px-3 py-2 font-mono text-xs text-accent-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-accent-teal/30 bg-accent-teal/5 px-3 py-2 font-mono text-xs text-accent-teal">
          <Mail className="mr-1 inline h-3.5 w-3.5" />
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-muted">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="you@example.com"
            className="w-full rounded border border-border bg-surface px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none"
          />
        </div>

        {/* Username (signup only) */}
        {tab === "signup" && (
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-muted">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. binarybandit"
              className="w-full rounded border border-border bg-surface px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none"
            />
          </div>
        )}

        {/* Display Name (signup only) */}
        {tab === "signup" && (
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-muted">
              Display Name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Binary Bandits"
              className="w-full rounded border border-border bg-surface px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none"
            />
          </div>
        )}

        {/* Password */}
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-muted">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tab === "signup" ? "Min 6 characters" : "Enter password"}
            className="w-full rounded border border-border bg-surface px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none"
          />
        </div>

        {/* Avatar picker (signup only) */}
        {tab === "signup" && (
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-muted">
              Avatar
            </label>
            <div className="grid grid-cols-10 gap-1.5">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-all",
                    avatar === a
                      ? "border-accent-amber bg-accent-amber/15 scale-110"
                      : "border-border bg-surface hover:border-text-muted/50"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bio (signup only) */}
        {tab === "signup" && (
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-muted">
              Bio <span className="normal-case">(optional)</span>
            </label>
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short description about yourself"
              className="w-full rounded border border-border bg-surface px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none"
            />
          </div>
        )}

        {/* Submit */}
        <button
          onClick={tab === "login" ? handleLogin : handleSignup}
          disabled={submitting}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-sm font-semibold transition-all",
            submitting
              ? "border-border bg-surface text-text-muted cursor-not-allowed"
              : "border-accent-amber/50 bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20"
          )}
        >
          {tab === "login" ? (
            <>
              <LogIn className="h-4 w-4" />
              {submitting ? "Logging in..." : "Login"}
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              {submitting ? "Creating..." : "Create Account"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
