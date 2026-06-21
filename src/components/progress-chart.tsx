"use client";

interface ProgressChartProps {
  topics: { name: string; solved: number; total: number }[];
}

export function ProgressChart({ topics }: ProgressChartProps) {
  return (
    <div className="space-y-3">
      {topics.map((t) => {
        const pct = t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0;
        const color =
          pct >= 80 ? "bg-accent-teal" : pct >= 50 ? "bg-accent-amber" : pct > 0 ? "bg-accent-violet" : "bg-border";

        return (
          <div key={t.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-text">{t.name}</span>
              <span className="text-xs font-mono text-text-muted">
                {t.solved}/{t.total} ({pct}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-bg overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
