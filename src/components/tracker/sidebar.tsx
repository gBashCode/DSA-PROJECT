"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ProgressBar from "./progress-bar";
import { ChevronDown, ChevronRight, BookOpen, Zap, Rocket } from "lucide-react";

interface TopicStats {
  topic: string;
  total: number;
  solved: number;
}

interface SidebarProps {
  topics: TopicStats[];
  activeTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const topicToTier: Record<string, string> = {
  "Arrays & Hashing": "beginner",
  "Two Pointers": "beginner",
  "Sliding Window": "beginner",
  "Prefix Sum": "beginner",
  "Binary Search": "beginner",
  "Sorting & Comparators": "beginner",
  "Stack": "beginner",
  "Recursion": "beginner",
  "Linked List": "beginner",
  "Fast & Slow Pointers": "intermediate",
  "Monotonic Stack": "intermediate",
  "Queue & Deque": "intermediate",
  "Heap": "intermediate",
  "Merge Intervals": "intermediate",
  "Trie": "intermediate",
  "Binary Tree DFS": "intermediate",
  "Binary Tree BFS": "intermediate",
  "Graph DFS": "intermediate",
  "Graph BFS": "intermediate",
  "Backtracking": "intermediate",
  "Trees": "intermediate",
  "Tries": "intermediate",
  "Intervals": "intermediate",
  "Matrix": "intermediate",
  "Dynamic Programming (1D)": "advanced",
  "1D Dynamic Programming": "advanced",
  "Dynamic Programming (2D)": "advanced",
  "2D Dynamic Programming": "advanced",
  "Greedy": "advanced",
  "Union Find": "advanced",
  "Topological Sort": "advanced",
  "Bit Manipulation": "advanced",
  "Advanced Patterns": "advanced",
  "Math & Geometry": "beginner",
  "Graphs": "intermediate",
};

const tiers = [
  { key: "beginner", title: "Beginner", icon: BookOpen, color: "text-accent-teal", bg: "bg-accent-teal/10" },
  { key: "intermediate", title: "Intermediate", icon: Zap, color: "text-accent-amber", bg: "bg-accent-amber/10" },
  { key: "advanced", title: "Advanced", icon: Rocket, color: "text-accent-rose", bg: "bg-accent-rose/10" },
];

export default function Sidebar({
  topics,
  activeTopic,
  onSelectTopic,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    beginner: true,
    intermediate: true,
    advanced: true,
  });

  const totalAll = topics.reduce((s, t) => s + t.total, 0);
  const solvedAll = topics.reduce((s, t) => s + t.solved, 0);

  const topicsByTier = {
    beginner: topics.filter((t) => (topicToTier[t.topic] || "beginner") === "beginner"),
    intermediate: topics.filter((t) => (topicToTier[t.topic] || "intermediate") === "intermediate"),
    advanced: topics.filter((t) => (topicToTier[t.topic] || "advanced") === "advanced"),
  };

  const toggleTier = (tier: string) => {
    setExpandedTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-surface transition-all duration-200",
        collapsed ? "w-10" : "w-64"
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        {!collapsed && (
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
            Topics
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="shrink-0 text-text-muted transition-colors hover:text-text"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          <button
            onClick={() => onSelectTopic(null)}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
              activeTopic === null
                ? "bg-accent-amber/10 text-accent-amber"
                : "text-text hover:bg-border/50"
            )}
          >
            <span className="min-w-0 flex-1 truncate">All Problems</span>
            <span className="shrink-0 font-mono text-xs text-text-muted">
              {solvedAll}/{totalAll}
            </span>
          </button>

          <div className="px-3 py-1">
            <ProgressBar value={solvedAll} max={totalAll} />
          </div>

          <div className="border-t border-border" />

          {tiers.map((tier) => {
            const Icon = tier.icon;
            const tierTopics = topicsByTier[tier.key as keyof typeof topicsByTier];
            const tierTotal = tierTopics.reduce((s, t) => s + t.total, 0);
            const tierSolved = tierTopics.reduce((s, t) => s + t.solved, 0);
            const isExpanded = expandedTiers[tier.key];

            if (tierTopics.length === 0) return null;

            return (
              <div key={tier.key}>
                <button
                  onClick={() => toggleTier(tier.key)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-mono uppercase tracking-wider text-text-muted hover:bg-border/30 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 shrink-0" />
                  )}
                  <Icon className={cn("w-3 h-3 shrink-0", tier.color)} />
                  <span className="flex-1">{tier.title}</span>
                  <span className="text-[10px] text-text-muted">
                    {tierSolved}/{tierTotal}
                  </span>
                </button>

                {isExpanded && (
                  <div>
                    {tierTopics.map((t) => (
                      <div key={t.topic}>
                        <button
                          onClick={() =>
                            onSelectTopic(activeTopic === t.topic ? null : t.topic)
                          }
                          className={cn(
                            "flex w-full items-center gap-2 pl-8 pr-3 py-1.5 text-left text-sm transition-colors",
                            activeTopic === t.topic
                              ? "bg-accent-amber/10 text-accent-amber"
                              : "text-text hover:bg-border/50"
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">{t.topic}</span>
                          <span className="shrink-0 font-mono text-xs text-text-muted">
                            {t.solved}/{t.total}
                          </span>
                        </button>
                        <div className="pl-8 pr-3 pb-1">
                          <ProgressBar value={t.solved} max={t.total} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-border" />
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
