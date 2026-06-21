import { problems } from "@/data/problems";

const RECOMMENDATIONS_KEY = "dsa-recommendations";

export interface Recommendation {
  id: string;
  title: string;
  difficulty: string;
  topic: string;
  link: string;
  reason: string;
  priority: number;
}

export function getRecommendations(solvedIds: string[], bookmarkedIds: string[]): Recommendation[] {
  const solvedTopics: Record<string, { solved: number; total: number }> = {};

  problems.forEach((p) => {
    if (!solvedTopics[p.topic]) {
      solvedTopics[p.topic] = { solved: 0, total: 0 };
    }
    solvedTopics[p.topic].total++;
    if (solvedIds.includes(p.id)) {
      solvedTopics[p.topic].solved++;
    }
  });

  const weakTopics = Object.entries(solvedTopics)
    .filter(([_, stats]) => stats.solved < stats.total * 0.5 && stats.total > 0)
    .sort((a, b) => a[1].solved / a[1].total - b[1].solved / b[1].total)
    .slice(0, 3)
    .map(([topic]) => topic);

  const recommendations: Recommendation[] = [];

  problems.forEach((p) => {
    if (solvedIds.includes(p.id)) return;

    let reason = "";
    let priority = 0;

    if (weakTopics.includes(p.topic)) {
      reason = `Weak area: ${p.topic}`;
      priority += 3;
    }

    if (p.difficulty === "Easy" && !solvedIds.includes(p.id)) {
      priority += 2;
    }

    if (p.difficulty === "Medium") {
      const easyInTopic = problems.filter((tp) => tp.topic === p.topic && tp.difficulty === "Easy").length;
      const easySolvedInTopic = problems.filter((tp) => tp.topic === p.topic && tp.difficulty === "Easy" && solvedIds.includes(tp.id)).length;
      if (easySolvedInTopic >= easyInTopic * 0.7) {
        reason = reason || `Ready for Medium in ${p.topic}`;
        priority += 1;
      }
    }

    if (bookmarkedIds.includes(p.id)) {
      reason = reason || "Bookmarked for review";
      priority += 1;
    }

    if (priority > 0) {
      recommendations.push({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        topic: p.topic,
        link: p.link,
        reason: reason || "Recommended practice",
        priority,
      });
    }
  });

  return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 10);
}

export function getWeakTopics(solvedIds: string[]): { topic: string; solved: number; total: number; percentage: number }[] {
  const topics: Record<string, { solved: number; total: number }> = {};

  problems.forEach((p) => {
    if (!topics[p.topic]) {
      topics[p.topic] = { solved: 0, total: 0 };
    }
    topics[p.topic].total++;
    if (solvedIds.includes(p.id)) {
      topics[p.topic].solved++;
    }
  });

  return Object.entries(topics)
    .map(([topic, stats]) => ({
      topic,
      solved: stats.solved,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.percentage - b.percentage);
}
