import type { Progress } from "./types";
import { getDailyStats, getStreak } from "./timer";

export function exportProgressAsJSON(progress: Progress, patterns: { name: string; slug: string; problems: { id: string; title: string; difficulty: string }[] }[]) {
  const totalProblems = patterns.reduce((sum, p) => sum + p.problems.length, 0);
  const solvedCount = progress.solved.length;
  const bookmarkedCount = progress.bookmarked.length;

  const topicStats = patterns.map((p) => {
    const solved = p.problems.filter((prob) => progress.solved.includes(prob.id)).length;
    return {
      topic: p.name,
      total: p.problems.length,
      solved,
      percentage: p.problems.length > 0 ? Math.round((solved / p.problems.length) * 100) : 0,
    };
  });

  const difficultyStats = {
    easy: { total: 0, solved: 0 },
    medium: { total: 0, solved: 0 },
    hard: { total: 0, solved: 0 },
  };

  patterns.forEach((p) => {
    p.problems.forEach((prob) => {
      const diff = prob.difficulty.toLowerCase() as "easy" | "medium" | "hard";
      difficultyStats[diff].total++;
      if (progress.solved.includes(prob.id)) {
        difficultyStats[diff].solved++;
      }
    });
  });

  const data = {
    exportDate: new Date().toISOString(),
    summary: {
      totalProblems,
      solved: solvedCount,
      bookmarked: bookmarkedCount,
      percentage: totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0,
      streak: getStreak(),
    },
    difficultyBreakdown: difficultyStats,
    topicStats,
    bookmarkedProblems: progress.bookmarked,
    notes: progress.notes,
    dailyStats: getDailyStats(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dsa-progress-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportProgressAsMarkdown(progress: Progress, patterns: { name: string; slug: string; problems: { id: string; title: string; difficulty: string; link: string }[] }[]) {
  const totalProblems = patterns.reduce((sum, p) => sum + p.problems.length, 0);
  const solvedCount = progress.solved.length;

  let md = `# DSA Progress Report\n\n`;
  md += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Value |\n|--------|-------|\n`;
  md += `| Total Problems | ${totalProblems} |\n`;
  md += `| Solved | ${solvedCount} |\n`;
  md += `| Bookmarked | ${progress.bookmarked.length} |\n`;
  md += `| Completion | ${totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0}% |\n`;
  md += `| Streak | ${getStreak()} days |\n\n`;

  md += `## Topic Progress\n\n`;
  md += `| Topic | Solved | Total | % |\n|-------|--------|-------|---|\n`;
  patterns.forEach((p) => {
    const solved = p.problems.filter((prob) => progress.solved.includes(prob.id)).length;
    const pct = p.problems.length > 0 ? Math.round((solved / p.problems.length) * 100) : 0;
    md += `| ${p.name} | ${solved} | ${p.problems.length} | ${pct}% |\n`;
  });

  md += `\n## Solved Problems\n\n`;
  patterns.forEach((p) => {
    const solved = p.problems.filter((prob) => progress.solved.includes(prob.id));
    if (solved.length > 0) {
      md += `### ${p.name}\n\n`;
      solved.forEach((prob) => {
        md += `- [${prob.difficulty}] [${prob.title}](${prob.link})\n`;
      });
      md += `\n`;
    }
  });

  if (progress.bookmarked.length > 0) {
    md += `## Bookmarked Problems\n\n`;
    patterns.forEach((p) => {
      const bookmarked = p.problems.filter((prob) => progress.bookmarked.includes(prob.id));
      bookmarked.forEach((prob) => {
        md += `- [${prob.difficulty}] [${prob.title}](${prob.link}) (${p.name})\n`;
      });
    });
  }

  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dsa-progress-${new Date().toISOString().split("T")[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
