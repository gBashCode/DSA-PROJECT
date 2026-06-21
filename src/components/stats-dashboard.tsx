"use client";

import { getStreak, getWeeklyStats } from "@/lib/timer";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";

interface StatsDashboardProps {
  totalProblems: number;
  solvedCount: number;
}

export function StatsDashboard({ totalProblems, solvedCount }: StatsDashboardProps) {
  const streak = getStreak();
  const weekly = getWeeklyStats();
  const percentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
  const maxProblems = Math.max(...weekly.map((d) => d.problems), 1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Flame className="w-5 h-5 text-accent-amber" />}
        label="Streak"
        value={`${streak}d`}
        sub="days"
      />
      <StatCard
        icon={<Target className="w-5 h-5 text-accent-teal" />}
        label="Solved"
        value={`${solvedCount}/${totalProblems}`}
        sub={`${percentage}%`}
      />
      <StatCard
        icon={<Clock className="w-5 h-5 text-accent-rose" />}
        label="This Week"
        value={`${weekly.reduce((s, d) => s + d.problems, 0)}`}
        sub="problems"
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5 text-accent-violet" />}
        label="Progress"
        value={`${percentage}%`}
        sub="complete"
      />

      <div className="col-span-2 md:col-span-4 p-4 rounded-lg border border-border bg-surface">
        <h3 className="text-xs font-mono text-text-muted mb-3">Weekly Activity</h3>
        <div className="flex items-end gap-2 h-20">
          {weekly.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-accent-amber/20 transition-all"
                style={{ height: `${(d.problems / maxProblems) * 100}%`, minHeight: d.problems > 0 ? "4px" : "2px" }}
              />
              <span className="text-[10px] font-mono text-text-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-border bg-surface flex items-center gap-3">
      <div className="p-2 rounded-lg bg-bg">{icon}</div>
      <div>
        <p className="text-xs font-mono text-text-muted">{label}</p>
        <p className="text-lg font-mono font-bold text-text">{value}</p>
        <p className="text-[10px] font-mono text-text-muted">{sub}</p>
      </div>
    </div>
  );
}
