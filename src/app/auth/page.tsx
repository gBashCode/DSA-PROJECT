"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    router.push("/profile");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await signInWithMagicLink(email);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-text mb-2">Sign In</h1>
          <p className="text-sm font-mono text-text-muted">
            Enter your email to receive a magic link
          </p>
        </div>

        {success ? (
          <div className="p-6 rounded-xl border border-accent-teal/30 bg-accent-teal/5 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-accent-teal" />
            <h2 className="text-lg font-mono font-bold text-text mb-2">Check your email</h2>
            <p className="text-sm font-mono text-text-muted">
              We sent a magic link to <span className="text-text">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-text-muted mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-surface text-text font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-amber/50"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-mono text-accent-rose">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-lg bg-accent-amber text-bg font-mono text-sm font-bold hover:bg-accent-amber/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
