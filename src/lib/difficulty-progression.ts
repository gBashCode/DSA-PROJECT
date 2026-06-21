import { problems } from "@/data/problems";

const PROGRESSION_KEY = "dsa-progression";

interface ProgressionState {
  unlockedTiers: ("Easy" | "Medium" | "Hard")[];
  lastUpdated: string;
}

function loadProgression(): ProgressionState {
  if (typeof window === "undefined") return { unlockedTiers: ["Easy"], lastUpdated: "" };
  try {
    const stored = localStorage.getItem(PROGRESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { unlockedTiers: ["Easy"], lastUpdated: "" };
}

function saveProgression(state: ProgressionState) {
  localStorage.setItem(PROGRESSION_KEY, JSON.stringify(state));
}

export function getUnlockedDifficulties(): ("Easy" | "Medium" | "Hard")[] {
  return loadProgression().unlockedTiers;
}

export function checkAndUnlockDifficulties(solvedIds: string[]): ("Easy" | "Medium" | "Hard")[] {
  const state = loadProgression();
  const easySolved = problems.filter((p) => p.difficulty === "Easy" && solvedIds.includes(p.id)).length;
  const mediumSolved = problems.filter((p) => p.difficulty === "Medium" && solvedIds.includes(p.id)).length;

  const easyTotal = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumTotal = problems.filter((p) => p.difficulty === "Medium").length;

  const easyPct = easyTotal > 0 ? easySolved / easyTotal : 0;
  const mediumPct = mediumTotal > 0 ? mediumSolved / mediumTotal : 0;

  const unlocked: ("Easy" | "Medium" | "Hard")[] = ["Easy"];

  if (easyPct >= 0.5 || easySolved >= 10) {
    unlocked.push("Medium");
  }

  if (mediumPct >= 0.4 || mediumSolved >= 15) {
    unlocked.push("Hard");
  }

  state.unlockedTiers = unlocked;
  state.lastUpdated = new Date().toISOString();
  saveProgression(state);

  return unlocked;
}

export function getNextUnlockInfo(solvedIds: string[]): { nextTier: string; current: number; required: number; description: string } | null {
  const unlocked = getUnlockedDifficulties();

  if (unlocked.includes("Hard")) return null;

  const easySolved = problems.filter((p) => p.difficulty === "Easy" && solvedIds.includes(p.id)).length;
  const mediumSolved = problems.filter((p) => p.difficulty === "Medium" && solvedIds.includes(p.id)).length;

  if (!unlocked.includes("Medium")) {
    return {
      nextTier: "Medium",
      current: easySolved,
      required: Math.max(10, Math.ceil(problems.filter((p) => p.difficulty === "Easy").length * 0.5)),
      description: `Solve more Easy problems to unlock Medium difficulty`,
    };
  }

  return {
    nextTier: "Hard",
    current: mediumSolved,
    required: Math.max(15, Math.ceil(problems.filter((p) => p.difficulty === "Medium").length * 0.4)),
    description: `Solve more Medium problems to unlock Hard difficulty`,
  };
}
