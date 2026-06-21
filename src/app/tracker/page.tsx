"use client";

import { useState, useMemo } from "react";
import { problems } from "@/data/problems";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import Sidebar from "@/components/tracker/sidebar";
import ProblemRow from "@/components/tracker/problem-row";
import ProgressBar from "@/components/tracker/progress-bar";

interface TrackerState {
  solved: Record<string, boolean>;
  bookmarked: Record<string, boolean>;
  notes: Record<string, string>;
}

const initialTrackerState: TrackerState = {
  solved: {},
  bookmarked: {},
  notes: {},
};

export default function TrackerPage() {
  const [tracker, setTracker] = useLocalStorageState<TrackerState>(
    "dsa-tracker:v1",
    initialTrackerState
  );
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [solvedFilter, setSolvedFilter] = useState<string>("all");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const topics = useMemo(() => {
    const map = new Map<string, { total: number; solved: number }>();
    for (const p of problems) {
      const entry = map.get(p.topic) || { total: 0, solved: 0 };
      entry.total++;
      if (tracker.solved[p.id]) entry.solved++;
      map.set(p.topic, entry);
    }
    return Array.from(map.entries())
      .map(([topic, { total, solved }]) => ({ topic, total, solved }))
      .sort((a, b) => a.topic.localeCompare(b.topic));
  }, [tracker.solved]);

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      if (activeTopic && p.topic !== activeTopic) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter)
        return false;
      if (solvedFilter === "solved" && !tracker.solved[p.id]) return false;
      if (solvedFilter === "unsolved" && tracker.solved[p.id]) return false;
      return true;
    });
  }, [search, difficultyFilter, solvedFilter, activeTopic, tracker.solved]);

  const totalSolved = problems.filter((p) => tracker.solved[p.id]).length;

  return (
    <div className="flex h-[calc(100vh-2.5rem)] overflow-hidden bg-bg">
      <Sidebar
        topics={topics}
        activeTopic={activeTopic}
        onSelectTopic={setActiveTopic}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border bg-surface px-4 py-3">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="font-mono text-sm font-semibold uppercase tracking-wider text-text">
              Problem Tracker
            </h1>
            <span className="font-mono text-xs text-text-muted">
              {totalSolved}/{problems.length} solved
            </span>
          </div>

          <ProgressBar value={totalSolved} max={problems.length} className="mb-3" />

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-48 rounded border border-border bg-bg px-2 py-1 font-mono text-xs text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none"
            />

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded border border-border bg-bg px-2 py-1 font-mono text-xs text-text focus:border-accent-amber focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={solvedFilter}
              onChange={(e) => setSolvedFilter(e.target.value)}
              className="rounded border border-border bg-bg px-2 py-1 font-mono text-xs text-text focus:border-accent-amber focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>

            {(search || difficultyFilter !== "all" || solvedFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setDifficultyFilter("all");
                  setSolvedFilter("all");
                }}
                className="rounded border border-border bg-bg px-2 py-1 font-mono text-xs text-text-muted transition-colors hover:text-text"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-mono text-sm text-text-muted">
                No problems match those filters — clear them to see everything
              </p>
            </div>
          ) : (
            filteredProblems.map((p, i) => (
              <ProblemRow
                key={p.id}
                problem={p}
                index={i + 1}
                solved={!!tracker.solved[p.id]}
                bookmarked={!!tracker.bookmarked[p.id]}
                notes={tracker.notes[p.id] || ""}
                onToggleSolved={() =>
                  setTracker((prev) => ({
                    ...prev,
                    solved: {
                      ...prev.solved,
                      [p.id]: !prev.solved[p.id],
                    },
                  }))
                }
                onToggleBookmark={() =>
                  setTracker((prev) => ({
                    ...prev,
                    bookmarked: {
                      ...prev.bookmarked,
                      [p.id]: !prev.bookmarked[p.id],
                    },
                  }))
                }
                onNotesChange={(notes) =>
                  setTracker((prev) => ({
                    ...prev,
                    notes: { ...prev.notes, [p.id]: notes },
                  }))
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
