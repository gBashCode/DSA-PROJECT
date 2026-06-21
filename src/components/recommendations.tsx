"use client";

import { useMemo } from "react";
import { getRecommendations, getWeakTopics, type Recommendation } from "@/lib/recommendations";
import { Sparkles, TrendingUp, ArrowRight, ExternalLink, AlertTriangle } from "lucide-react";

interface RecommendationsProps {
  solvedIds: string[];
  bookmarkedIds: string[];
}

export function Recommendations({ solvedIds, bookmarkedIds }: RecommendationsProps) {
  const recommendations = useMemo(() => getRecommendations(solvedIds, bookmarkedIds), [solvedIds, bookmarkedIds]);
  const weakTopics = useMemo(() => getWeakTopics(solvedIds), [solvedIds]);

  const topWeak = weakTopics.filter((t) => t.percentage < 50 && t.total > 0).slice(0, 3);

  if (recommendations.length === 0 && topWeak.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-border bg-surface">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent-amber" />
          <h3 className="text-sm font-mono font-semibold text-text">Recommendations</h3>
        </div>
        <p className="text-xs font-mono text-text-muted">Solve some problems to get personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topWeak.length > 0 && (
        <div className="p-4 rounded-xl border border-accent-rose/30 bg-accent-rose/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-accent-rose" />
            <h3 className="text-sm font-mono font-semibold text-accent-rose">Weak Areas</h3>
          </div>
          <div className="space-y-2">
            {topWeak.map((t) => (
              <div key={t.topic} className="flex items-center justify-between">
                <span className="text-xs font-mono text-text">{t.topic}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-accent-rose" style={{ width: `${t.percentage}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">{t.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="p-4 rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent-amber" />
            <h3 className="text-sm font-mono font-semibold text-text">Recommended Next</h3>
          </div>
          <div className="space-y-2">
            {recommendations.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-bg transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-text truncate">{r.title}</p>
                  <p className="text-[10px] font-mono text-text-muted">{r.reason}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    r.difficulty === "Easy" ? "bg-accent-teal/10 text-accent-teal" : r.difficulty === "Medium" ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-rose/10 text-accent-rose"
                  }`}>
                    {r.difficulty}
                  </span>
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="p-1 text-text-muted hover:text-text">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
