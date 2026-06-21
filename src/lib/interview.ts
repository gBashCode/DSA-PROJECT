const INTERVIEW_KEY = "dsa-interview-history";

export interface InterviewSession {
  id: string;
  date: string;
  duration: number;
  totalProblems: number;
  solvedProblems: number;
  problems: {
    id: string;
    title: string;
    difficulty: string;
    solved: boolean;
    timeSpent: number;
  }[];
  score: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
}

export function saveInterviewSession(session: InterviewSession) {
  if (typeof window === "undefined") return;
  const history = getInterviewHistory();
  history.unshift(session);
  if (history.length > 50) history.pop();
  localStorage.setItem(INTERVIEW_KEY, JSON.stringify(history));
}

export function getInterviewHistory(): InterviewSession[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(INTERVIEW_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getInterviewStats() {
  const history = getInterviewHistory();
  if (history.length === 0) {
    return { totalSessions: 0, avgScore: 0, bestScore: 0, totalTime: 0, totalSolved: 0 };
  }

  const totalSessions = history.length;
  const avgScore = Math.round(history.reduce((s, h) => s + h.score, 0) / totalSessions);
  const bestScore = Math.max(...history.map((h) => h.score));
  const totalTime = history.reduce((s, h) => s + h.duration, 0);
  const totalSolved = history.reduce((s, h) => s + h.solvedProblems, 0);

  return { totalSessions, avgScore, bestScore, totalTime, totalSolved };
}

export function generateSessionId(): string {
  return `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
