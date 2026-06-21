import { createClient } from "./supabase/client";

const supabase = createClient();

const TRACKER_KEY = "dsa-tracker:v1";
const STATS_KEY = "dsa-daily-stats";
const SRS_KEY = "dsa-srs";

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

export async function fullSync(userId: string): Promise<void> {
  await Promise.all([
    syncProgress(userId),
    syncSessionHistory(userId),
    syncSRS(userId),
  ]);
  await loadProgressFromCloud(userId);
}
