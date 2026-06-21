"use client";
import { getAllPatterns, getAllProblems } from "@/lib/data";
import { useProgress } from "@/lib/progress";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { CountUp } from "@/components/animations/CountUp";
import { AnimatedProgress } from "@/components/animations/AnimatedProgress";
import { CheckCircle2, Bookmark, Target, TrendingUp, Flame, BarChart3 } from "lucide-react";

const problems = getAllProblems();
const patterns = getAllPatterns();

const tierBars: Record<string, string> = {
  beginner: "bg-green-500",
  intermediate: "bg-amber-500",
  advanced: "bg-red-500",
};

const tierText: Record<string, string> = {
  beginner: "text-green-600 dark:text-green-400",
  intermediate: "text-amber-600 dark:text-amber-400",
  advanced: "text-red-600 dark:text-red-400",
};

export default function ProgressPage() {
  const { progress } = useProgress();
  const solvedCount = progress.solved.length;
  const bookmarkedCount = progress.bookmarked.length;
  const total = problems.length;
  const percentage = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

  const easySolved = problems.filter(p => p.difficulty === "Easy" && progress.solved.includes(p.id)).length;
  const mediumSolved = problems.filter(p => p.difficulty === "Medium" && progress.solved.includes(p.id)).length;
  const hardSolved = problems.filter(p => p.difficulty === "Hard" && progress.solved.includes(p.id)).length;
  const easyTotal = problems.filter(p => p.difficulty === "Easy").length;
  const mediumTotal = problems.filter(p => p.difficulty === "Medium").length;
  const hardTotal = problems.filter(p => p.difficulty === "Hard").length;

  // Streak calculation (simplified)
  const streakDays = Math.min(solvedCount, 7);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <AnimateIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          </div>
          <p className="mt-2 text-muted-foreground text-lg">Keep going — every problem solved is progress made.</p>
        </div>
      </AnimateIn>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Solved", value: solvedCount, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Bookmarked", value: bookmarkedCount, icon: Bookmark, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total", value: total, icon: Target, color: "text-foreground", bg: "bg-muted" },
          { label: "Completion", value: percentage, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", suffix: "%" },
        ].map((stat, i) => (
          <AnimateIn key={stat.label} delay={i * 80}>
            <div className="rounded-xl border border-border p-5 text-center bg-card card-interactive group">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-3 transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold">
                <CountUp end={stat.value} suffix={stat.suffix || ""} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Streak */}
      <AnimateIn delay={300}>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
            <Flame className="h-6 w-6 text-amber-500" style={{ animation: "streak-fire 1s ease-in-out infinite" }} />
          </div>
          <div>
            <div className="text-lg font-bold">{streakDays} day streak</div>
            <div className="text-sm text-muted-foreground">Keep solving to maintain your streak!</div>
          </div>
        </div>
      </AnimateIn>

      {/* Overall */}
      <AnimateIn delay={350}>
        <div className="rounded-xl border border-border p-6 mb-8 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Overall Progress</h2>
            <span className="text-sm text-muted-foreground font-medium tabular-nums">{solvedCount} / {total}</span>
          </div>
          <AnimatedProgress value={solvedCount} max={total} barClassName="bg-primary" />
        </div>
      </AnimateIn>

      {/* Difficulty */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: "Easy", solved: easySolved, total: easyTotal, bar: "bg-green-500", text: "text-green-600 dark:text-green-400" },
          { label: "Medium", solved: mediumSolved, total: mediumTotal, bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
          { label: "Hard", solved: hardSolved, total: hardTotal, bar: "bg-red-500", text: "text-red-600 dark:text-red-400" },
        ].map((diff, i) => (
          <AnimateIn key={diff.label} delay={400 + i * 80}>
            <div className="rounded-xl border border-border p-5 bg-card card-interactive">
              <div className="flex items-center justify-between mb-3">
                <span className={`font-bold ${diff.text}`}>{diff.label}</span>
                <span className="text-xs text-muted-foreground font-medium tabular-nums">{diff.solved}/{diff.total}</span>
              </div>
              <AnimatedProgress value={diff.solved} max={diff.total} barClassName={diff.bar} />
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Pattern Progress */}
      <AnimateIn delay={500}>
        <h2 className="text-lg font-bold mb-4">Pattern Progress</h2>
      </AnimateIn>
      <div className="space-y-1">
        {patterns.map((pattern, i) => {
          const pp = problems.filter(p => p.patternSlug === pattern.slug);
          const ps = pp.filter(p => progress.solved.includes(p.id)).length;
          const t = pp.length;
          return (
            <div
              key={pattern.slug}
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-accent/50 transition-all duration-150 stagger-item"
              style={{ animationDelay: `${500 + i * 20}ms` }}
            >
              <div className={`h-2.5 w-2.5 rounded-full ${tierBars[pattern.tier]} shrink-0`} />
              <span className="text-sm font-medium flex-1 min-w-0 truncate">{pattern.name}</span>
              <span className={`text-xs font-bold tabular-nums ${tierText[pattern.tier]}`}>{ps}/{t}</span>
              <div className="w-24 shrink-0">
                <AnimatedProgress value={ps} max={t} barClassName={tierBars[pattern.tier]} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
