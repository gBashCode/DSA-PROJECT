const SRS_KEY = "dsa-srs";

export interface SRSData {
  [problemId: string]: {
    interval: number;
    easeFactor: number;
    repetitions: number;
    nextReview: string;
    lastReview: string;
  };
}

function loadSRS(): SRSData {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(SRS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveSRS(data: SRSData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SRS_KEY, JSON.stringify(data));
}

export function recordReview(problemId: string, quality: number) {
  const data = loadSRS();
  const now = new Date();
  const entry = data[problemId] || { interval: 0, easeFactor: 2.5, repetitions: 0, nextReview: "", lastReview: "" };

  if (quality >= 3) {
    if (entry.repetitions === 0) {
      entry.interval = 1;
    } else if (entry.repetitions === 1) {
      entry.interval = 6;
    } else {
      entry.interval = Math.round(entry.interval * entry.easeFactor);
    }
    entry.repetitions++;
  } else {
    entry.repetitions = 0;
    entry.interval = 1;
  }

  entry.easeFactor = Math.max(1.3, entry.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  entry.lastReview = now.toISOString();
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + entry.interval);
  entry.nextReview = nextDate.toISOString();

  data[problemId] = entry;
  saveSRS(data);
}

export function getProblemsForReview(solvedIds: string[]): string[] {
  const data = loadSRS();
  const now = new Date();
  const reviewIds: string[] = [];

  for (const id of solvedIds) {
    const entry = data[id];
    if (entry && new Date(entry.nextReview) <= now) {
      reviewIds.push(id);
    }
  }

  return reviewIds;
}

export function getNextReviewDate(problemId: string): string | null {
  const data = loadSRS();
  const entry = data[problemId];
  if (!entry) return null;
  return entry.nextReview;
}

export function getDaysUntilReview(problemId: string): number | null {
  const data = loadSRS();
  const entry = data[problemId];
  if (!entry) return null;
  const now = new Date();
  const next = new Date(entry.nextReview);
  const diff = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}
