const DAILY_KEY = "dsa-daily-challenge";

export interface DailyChallenge {
  date: string;
  problemId: string;
  completed: boolean;
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getDailyChallenge(problemIds: string[]): DailyChallenge | null {
  if (problemIds.length === 0) return null;

  const data = loadDailyChallenge();
  const today = getTodayKey();

  if (data && data.date === today) {
    return data;
  }

  const todayTimestamp = new Date(today).getTime();
  const index = Math.floor(seededRandom(todayTimestamp) * problemIds.length);

  const challenge: DailyChallenge = {
    date: today,
    problemId: problemIds[index],
    completed: false,
  };

  saveDailyChallenge(challenge);
  return challenge;
}

export function markDailyChallengeComplete(problemId: string): boolean {
  const data = loadDailyChallenge();
  if (!data || data.problemId !== problemId) return false;
  data.completed = true;
  saveDailyChallenge(data);
  return true;
}

function loadDailyChallenge(): DailyChallenge | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveDailyChallenge(data: DailyChallenge) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAILY_KEY, JSON.stringify(data));
}
