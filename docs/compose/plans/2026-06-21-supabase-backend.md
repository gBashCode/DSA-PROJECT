# Supabase Backend Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase backend for user authentication, cross-device data sync, and real-time progress tracking.

**Architecture:** Supabase Full Stack with Magic Link auth, PostgreSQL database with Row Level Security, and client-side sync layer that migrates existing localStorage data on first login.

**Tech Stack:** Supabase JS SDK, Next.js, PostgreSQL, Row Level Security

---

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client setup
│   ├── auth.ts              # Auth helpers (modify existing)
│   ├── sync.ts              # Data sync logic
│   └── types.ts             # Add Supabase types
├── app/
│   └── auth/
│       └── callback/
│           └── route.ts     # Magic link callback (modify)
└── components/
    └── auth-provider.tsx    # Auth context provider

supabase/
└── schema.sql               # Database schema
```

---

### Task 1: Install Dependencies & Setup Supabase Client

**Files:**
- Create: `src/lib/supabase.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Supabase SDK**

```bash
npm install @supabase/supabase-js
```

- [ ] **Step 2: Create Supabase client**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 3: Create .env.local template**

Create `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.ts .env.local.example package.json package-lock.json
git commit -m "feat: install Supabase SDK and create client"
```

---

### Task 2: Create Database Schema

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create schema file**

Create `supabase/schema.sql`:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar text,
  bio text,
  created_at timestamptz default now()
);

-- User progress (solved, bookmarked, notes)
create table public.user_progress (
  user_id uuid references auth.users(id) on delete cascade,
  problem_id text not null,
  solved boolean default false,
  bookmarked boolean default false,
  notes text default '',
  updated_at timestamptz default now(),
  primary key (user_id, problem_id)
);

-- Session history (daily stats)
create table public.session_history (
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  problems_solved int default 0,
  time_spent_seconds int default 0,
  streak int default 0,
  primary key (user_id, date)
);

-- Mock interview sessions
create table public.interview_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date timestamptz default now(),
  difficulty text not null,
  total_problems int not null,
  solved_problems int default 0,
  score int default 0,
  duration int default 0
);

-- Spaced repetition data
create table public.srs_data (
  user_id uuid references auth.users(id) on delete cascade,
  problem_id text not null,
  interval int default 1,
  ease_factor float default 2.5,
  repetitions int default 0,
  next_review timestamptz,
  last_review timestamptz,
  primary key (user_id, problem_id)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.session_history enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.srs_data enable row level security;

-- Policies: Users can only access their own data
create policy "Users can view own profile" on profiles for select using (auth.uid() = user_id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = user_id);

create policy "Users can view own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on user_progress for update using (auth.uid() = user_id);
create policy "Users can delete own progress" on user_progress for delete using (auth.uid() = user_id);

create policy "Users can view own sessions" on session_history for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on session_history for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on session_history for update using (auth.uid() = user_id);

create policy "Users can view own interviews" on interview_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own interviews" on interview_sessions for insert with check (auth.uid() = user_id);

create policy "Users can view own srs" on srs_data for select using (auth.uid() = user_id);
create policy "Users can insert own srs" on srs_data for insert with check (auth.uid() = user_id);
create policy "Users can update own srs" on srs_data for update using (auth.uid() = user_id);
create policy "Users can delete own srs" on srs_data for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, username, display_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

- [ ] **Step 2: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add Supabase database schema with RLS policies"
```

---

### Task 3: Update Auth System

**Files:**
- Modify: `src/lib/auth.ts`
- Create: `src/components/auth-provider.tsx`

- [ ] **Step 1: Create AuthProvider component**

Create `src/components/auth-provider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithMagicLink: async () => ({}),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error: error?.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 2: Update layout.tsx to include AuthProvider**

Modify `src/app/layout.tsx` - wrap children with AuthProvider:

```tsx
import { AuthProvider } from "@/components/auth-provider";

// In the body, wrap ThemeProvider children with AuthProvider
<ThemeProvider ...>
  <AuthProvider>
    <Nav />
    <main className="flex-1">{children}</main>
    <footer>...</footer>
  </AuthProvider>
</ThemeProvider>
```

- [ ] **Step 3: Update auth callback route**

Modify `src/app/auth/callback/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "magiclink";
  const next = searchParams.get("next") ?? "/profile";

  if (token_hash) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=Invalid+link`);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/auth-provider.tsx src/app/layout.tsx src/app/auth/callback/route.ts
git commit -m "feat: update auth system with Supabase Magic Link"
```

---

### Task 4: Create Sync Layer

**Files:**
- Create: `src/lib/sync.ts`

- [ ] **Step 1: Create sync module**

Create `src/lib/sync.ts`:

```typescript
import { supabase } from "./supabase";

// LocalStorage keys
const TRACKER_KEY = "dsa-tracker:v1";
const STATS_KEY = "dsa-daily-stats";
const SRS_KEY = "dsa-srs";
const INTERVIEW_KEY = "dsa-interview-history";

interface LocalTracker {
  solved: Record<string, boolean>;
  bookmarked: Record<string, boolean>;
  notes: Record<string, string>;
}

interface LocalStats {
  date: string;
  problemsSolved: number;
  timeSpentSeconds: number;
  streak: number;
}

interface LocalSRS {
  [problemId: string]: {
    interval: number;
    easeFactor: number;
    repetitions: number;
    nextReview: string;
    lastReview: string;
  };
}

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

// Sync progress to Supabase
export async function syncProgress(userId: string): Promise<void> {
  const local = loadLocal<LocalTracker>(TRACKER_KEY, { solved: {}, bookmarked: {}, notes: {} });

  const rows = Object.entries(local.solved).map(([problemId, solved]) => ({
    user_id: userId,
    problem_id: problemId,
    solved,
    bookmarked: local.bookmarked[problemId] ?? false,
    notes: local.notes[problemId] ?? "",
    updated_at: new Date().toISOString(),
  }));

  if (rows.length > 0) {
    await supabase.from("user_progress").upsert(rows, { onConflict: "user_id,problem_id" });
  }
}

// Sync session history
export async function syncSessionHistory(userId: string): Promise<void> {
  const local = loadLocal<LocalStats[]>(STATS_KEY, []);

  if (local.length > 0) {
    const rows = local.map((s) => ({
      user_id: userId,
      date: s.date,
      problems_solved: s.problemsSolved,
      time_spent_seconds: s.timeSpentSeconds,
      streak: s.streak,
    }));

    await supabase.from("session_history").upsert(rows, { onConflict: "user_id,date" });
  }
}

// Sync SRS data
export async function syncSRS(userId: string): Promise<void> {
  const local = loadLocal<LocalSRS>(SRS_KEY, {});

  const rows = Object.entries(local).map(([problemId, data]) => ({
    user_id: userId,
    problem_id: problemId,
    interval: data.interval,
    ease_factor: data.easeFactor,
    repetitions: data.repetitions,
    next_review: data.nextReview,
    last_review: data.lastReview,
  }));

  if (rows.length > 0) {
    await supabase.from("srs_data").upsert(rows, { onConflict: "user_id,problem_id" });
  }
}

// Load progress from Supabase to localStorage
export async function loadProgressFromCloud(userId: string): Promise<void> {
  const { data: progress } = await supabase
    .from("user_progress")
    .select("problem_id, solved, bookmarked, notes")
    .eq("user_id", userId);

  if (progress && progress.length > 0) {
    const tracker: LocalTracker = { solved: {}, bookmarked: {}, notes: {} };
    progress.forEach((p) => {
      if (p.solved) tracker.solved[p.problem_id] = true;
      if (p.bookmarked) tracker.bookmarked[p.problem_id] = true;
      if (p.notes) tracker.notes[p.problem_id] = p.notes;
    });
    localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker));
  }

  const { data: stats } = await supabase
    .from("session_history")
    .select("date, problems_solved, time_spent_seconds, streak")
    .eq("user_id", userId);

  if (stats && stats.length > 0) {
    const localStats: LocalStats[] = stats.map((s) => ({
      date: s.date,
      problemsSolved: s.problems_solved,
      timeSpentSeconds: s.time_spent_seconds,
      streak: s.streak,
    }));
    localStorage.setItem(STATS_KEY, JSON.stringify(localStats));
  }

  const { data: srs } = await supabase
    .from("srs_data")
    .select("problem_id, interval, ease_factor, repetitions, next_review, last_review")
    .eq("user_id", userId);

  if (srs && srs.length > 0) {
    const localSRS: LocalSRS = {};
    srs.forEach((s) => {
      localSRS[s.problem_id] = {
        interval: s.interval,
        easeFactor: s.ease_factor,
        repetitions: s.repetitions,
        nextReview: s.next_review,
        lastReview: s.last_review,
      };
    });
    localStorage.setItem(SRS_KEY, JSON.stringify(localSRS));
  }
}

// Full sync: push local to cloud, then pull cloud to local
export async function fullSync(userId: string): Promise<void> {
  await Promise.all([
    syncProgress(userId),
    syncSessionHistory(userId),
    syncSRS(userId),
  ]);
  await loadProgressFromCloud(userId);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/sync.ts
git commit -m "feat: add data sync layer for Supabase"
```

---

### Task 5: Add Sync to Tracker Page

**Files:**
- Modify: `src/app/tracker/page.tsx`

- [ ] **Step 1: Import sync and auth**

At top of tracker/page.tsx, add:

```typescript
import { useAuth } from "@/components/auth-provider";
import { fullSync } from "@/lib/sync";
```

- [ ] **Step 2: Add sync on auth state change**

Inside the component, add effect to sync when user logs in:

```typescript
const { user } = useAuth();

useEffect(() => {
  if (user) {
    fullSync(user.id).then(() => {
      window.location.reload(); // Refresh to load synced data
    });
  }
}, [user]);
```

- [ ] **Step 3: Add sync button in header**

In the header section, add a sync button (visible when logged in):

```tsx
{user && (
  <button
    onClick={() => fullSync(user.id).then(() => window.location.reload())}
    className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-bg font-mono text-xs text-text-muted hover:text-text transition-colors"
    title="Sync to cloud"
  >
    <RefreshCw className="w-3.5 h-3.5" />
    Sync
  </button>
)}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/tracker/page.tsx
git commit -m "feat: add cloud sync to tracker page"
```

---

### Task 6: Create Auth Page

**Files:**
- Modify: `src/app/auth/page.tsx`

- [ ] **Step 1: Rewrite auth page for Magic Link**

Replace content of `src/app/auth/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/auth/page.tsx
git commit -m "feat: rewrite auth page for Magic Link login"
```

---

### Task 7: Update Profile Page

**Files:**
- Modify: `src/app/profile/page.tsx`

- [ ] **Step 1: Import new auth and sync**

Update imports:

```typescript
import { useAuth } from "@/components/auth-provider";
import { fullSync } from "@/lib/sync";
```

- [ ] **Step 2: Update user references**

Replace old `useAuth()` usage with new hook. The new hook returns `{ user, loading, signInWithMagicLink, signOut }` where `user` is a Supabase User object.

Update any `user.email`, `user.id` references to work with Supabase User type.

- [ ] **Step 3: Add sync button to profile**

Add a sync button that calls `fullSync(user.id)`.

- [ ] **Step 4: Commit**

```bash
git add src/app/profile/page.tsx
git commit -m "feat: update profile page for Supabase auth"
```

---

### Task 8: Environment Variables & Testing

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Add Supabase env vars**

Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- [ ] **Step 2: Run build to verify**

```bash
npm run build
```

Expected: Build passes with no errors.

- [ ] **Step 3: Test locally**

```bash
npm run dev
```

1. Go to `/auth`
2. Enter email, receive magic link
3. Click link, should redirect to `/profile`
4. Go to `/tracker`, solve some problems
5. Click "Sync" button
6. Open in incognito, login again
7. Verify data synced

- [ ] **Step 4: Commit**

```bash
git add .env.local
git commit -m "feat: add Supabase environment variables"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Install SDK & create client | supabase.ts |
| 2 | Database schema with RLS | schema.sql |
| 3 | Auth system with Magic Link | auth-provider.tsx, layout.tsx |
| 4 | Data sync layer | sync.ts |
| 5 | Add sync to tracker | tracker/page.tsx |
| 6 | Auth page for Magic Link | auth/page.tsx |
| 7 | Update profile page | profile/page.tsx |
| 8 | Environment vars & testing | .env.local |
