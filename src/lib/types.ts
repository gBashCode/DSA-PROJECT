export type Difficulty = "Easy" | "Medium" | "Hard";
export type Tier = "beginner" | "intermediate" | "advanced";

export interface Problem {
  id: string;
  leetcode?: number;
  title: string;
  difficulty: Difficulty;
  link?: string;
  description?: string;
  examples?: { input: string; output: string }[];
  hints?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface Pattern {
  slug: string;
  name: string;
  tier: Tier;
  description: string;
  keyIdea: string;
  problems: Problem[];
}

export interface SystemDesignTopic {
  slug: string;
  name: string;
  tier: "fundamentals" | "components" | "case-studies";
  difficulty?: Difficulty;
  description: string;
  keyPoints: string[];
  whenToUse?: string;
  mainChallenges?: string[];
  challenges?: string[];
  interviewQuestions: string[];
  companies?: string[];
}

export interface Progress {
  solved: string[];
  bookmarked: string[];
  notes: Record<string, string>;
}
