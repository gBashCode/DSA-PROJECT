"use client";

import { cn } from "@/lib/utils";
import ProgressBar from "./progress-bar";

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

export default function Sidebar({
  topics,
  activeTopic,
  onSelectTopic,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const totalAll = topics.reduce((s, t) => s + t.total, 0);
  const solvedAll = topics.reduce((s, t) => s + t.solved, 0);

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

          {topics.map((t) => (
            <div key={t.topic}>
              <button
                onClick={() =>
                  onSelectTopic(activeTopic === t.topic ? null : t.topic)
                }
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
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
              <div className="px-3 pb-1">
                <ProgressBar value={t.solved} max={t.total} />
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
