"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { problems } from "@/data/problems";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import Sidebar from "@/components/tracker/sidebar";
import ProblemRow from "@/components/tracker/problem-row";
import ProgressBar from "@/components/tracker/progress-bar";
import { StatsDashboard } from "@/components/stats-dashboard";
import { TimerDisplay } from "@/components/timer-display";
import { useTimer, updateTodayStats } from "@/lib/timer";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";
import { ShortcutsModal } from "@/components/shortcuts-modal";
import { exportProgressAsJSON, exportProgressAsMarkdown } from "@/lib/export";
import { getDailyChallenge, markDailyChallengeComplete } from "@/lib/daily-challenge";
import { getProblemsForReview } from "@/lib/spaced-repetition";
import { Download, FileText, Flame, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Recommendations } from "@/components/recommendations";

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
  const [tracker, setTracker] = useLocalStorageState<TrackerState>("dsa-tracker:v1", initialTrackerState);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [solvedFilter, setSolvedFilter] = useState<string>("all");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const timer = useTimer();
  const timerStartRef = useRef<number>(0);

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
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter) return false;
      if (solvedFilter === "solved" && !tracker.solved[p.id]) return false;
      if (solvedFilter === "unsolved" && tracker.solved[p.id]) return false;
      return true;
    });
  }, [search, difficultyFilter, solvedFilter, activeTopic, tracker.solved]);

  const totalSolved = problems.filter((p) => tracker.solved[p.id]).length;
  const bookmarkedIds = problems.filter((p) => tracker.bookmarked[p.id]).map((p) => p.id);
  const solvedIds = problems.filter((p) => tracker.solved[p.id]).map((p) => p.id);

  const dailyChallenge = useMemo(() => {
    const allIds = problems.map((p) => p.id);
    return getDailyChallenge(allIds);
  }, []);

  const reviewProblems = useMemo(() => {
    return getProblemsForReview(solvedIds).map((id) => problems.find((p) => p.id === id)).filter(Boolean);
  }, [solvedIds]);

  const dailyChallengeProblem = dailyChallenge ? problems.find((p) => p.id === dailyChallenge.problemId) : null;

  const handleToggleSolved = useCallback(
    (id: string) => {
      const wasSolved = tracker.solved[id];
      setTracker((prev) => ({
        ...prev,
        solved: { ...prev.solved, [id]: !prev.solved[id] },
      }));

      if (!wasSolved && timerStartRef.current > 0) {
        const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
        updateTodayStats(true, elapsed);
        timerStartRef.current = Date.now();

        if (dailyChallenge && id === dailyChallenge.problemId) {
          markDailyChallengeComplete(id);
        }
      }
    },
    [tracker.solved, setTracker, dailyChallenge]
  );

  const exportJSON = useCallback(() => {
    exportProgressAsJSON(
      { solved: solvedIds, bookmarked: bookmarkedIds, notes: tracker.notes },
      topics.map((t) => ({
        name: t.topic,
        slug: t.topic,
        problems: problems.filter((p) => p.topic === t.topic).map((p) => ({ id: p.id, title: p.title, difficulty: p.difficulty })),
      }))
    );
    setShowExportMenu(false);
  }, [solvedIds, bookmarkedIds, tracker.notes, topics]);

  const exportMD = useCallback(() => {
    exportProgressAsMarkdown(
      { solved: solvedIds, bookmarked: bookmarkedIds, notes: tracker.notes },
      topics.map((t) => ({
        name: t.topic,
        slug: t.topic,
        problems: problems
          .filter((p) => p.topic === t.topic)
          .map((p) => ({ id: p.id, title: p.title, difficulty: p.difficulty, link: p.link })),
      }))
    );
    setShowExportMenu(false);
  }, [solvedIds, bookmarkedIds, tracker.notes, topics]);

  useKeyboardShortcuts([
    { key: "/", description: "Focus search", action: () => searchRef.current?.focus() },
    { key: "Escape", description: "Clear search", action: () => { setSearch(""); setShowShortcuts(false); setShowExportMenu(false); } },
    { key: "j", description: "Next problem", action: () => setSelectedIndex((i) => Math.min(i + 1, filteredProblems.length - 1)) },
    { key: "k", description: "Previous problem", action: () => setSelectedIndex((i) => Math.max(i - 1, 0)) },
    { key: "s", description: "Toggle solved", action: () => { if (filteredProblems[selectedIndex]) handleToggleSolved(filteredProblems[selectedIndex].id); } },
    { key: "b", description: "Toggle bookmark", action: () => { if (filteredProblems[selectedIndex]) { const p = filteredProblems[selectedIndex]; setTracker((prev) => ({ ...prev, bookmarked: { ...prev.bookmarked, [p.id]: !prev.bookmarked[p.id] } })); } } },
    { key: "?", description: "Show shortcuts", action: () => setShowShortcuts(true) },
  ]);

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
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-sm font-semibold uppercase tracking-wider text-text">Problem Tracker</h1>
              <span className="font-mono text-xs text-text-muted">{totalSolved}/{problems.length} solved</span>
            </div>
            <div className="flex items-center gap-2">
              <TimerDisplay
                formatted={timer.formatted}
                isRunning={timer.isRunning}
                isPaused={timer.isPaused}
                onToggle={() => {
                  if (!timer.isRunning && !timer.isPaused) {
                    timerStartRef.current = Date.now();
                  }
                  timer.toggle();
                }}
                onReset={() => {
                  if (timer.seconds > 0) {
                    updateTodayStats(false, timer.seconds);
                  }
                  timerStartRef.current = 0;
                  timer.reset();
                }}
              />
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-bg font-mono text-xs text-text-muted hover:text-text transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-surface shadow-lg z-50">
                    <button
                      onClick={exportJSON}
                      className="w-full px-3 py-2 text-left text-xs font-mono text-text hover:bg-bg transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      JSON
                    </button>
                    <button
                      onClick={exportMD}
                      className="w-full px-3 py-2 text-left text-xs font-mono text-text hover:bg-bg transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Markdown
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ProgressBar value={totalSolved} max={problems.length} className="mb-3" />

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems... (press /)"
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
                onClick={() => { setSearch(""); setDifficultyFilter("all"); setSolvedFilter("all"); }}
                className="rounded border border-border bg-bg px-2 py-1 font-mono text-xs text-text-muted transition-colors hover:text-text"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {showStats && (
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">Dashboard</h2>
                <button onClick={() => setShowStats(false)} className="text-text-muted hover:text-text">
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
              <StatsDashboard totalProblems={problems.length} solvedCount={totalSolved} />
            </div>
          )}

          {!showStats && (
            <button
              onClick={() => setShowStats(true)}
              className="w-full px-4 py-2 text-left font-mono text-xs text-text-muted hover:text-text hover:bg-surface border-b border-border transition-colors flex items-center gap-1"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              Show Dashboard
            </button>
          )}

          {showDailyChallenge && dailyChallengeProblem && !dailyChallenge?.completed && (
            <div className="border-b border-border p-4 bg-accent-amber/5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-amber flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Daily Challenge
                </h2>
                <button onClick={() => setShowDailyChallenge(false)} className="text-text-muted hover:text-text">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-text">{dailyChallengeProblem.title}</p>
                  <p className="text-xs font-mono text-text-muted">
                    {dailyChallengeProblem.difficulty} &middot; {dailyChallengeProblem.topic}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={dailyChallengeProblem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded border border-accent-amber/40 bg-accent-amber/10 text-accent-amber text-xs font-mono hover:bg-accent-amber/20 transition-colors"
                  >
                    Solve
                  </a>
                  <button
                    onClick={() => handleToggleSolved(dailyChallengeProblem.id)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      tracker.solved[dailyChallengeProblem.id]
                        ? "bg-accent-teal/20 text-accent-teal border border-accent-teal/40"
                        : "border border-border text-text-muted hover:text-text"
                    }`}
                  >
                    {tracker.solved[dailyChallengeProblem.id] ? "Solved" : "Mark Solved"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {reviewProblems.length > 0 && (
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-rose flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Due for Review ({reviewProblems.length})
                </h2>
                <button onClick={() => setShowReview(!showReview)} className="text-text-muted hover:text-text">
                  {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              {showReview && (
                <div className="space-y-1">
                  {reviewProblems.slice(0, 5).map((p) => p && (
                    <div key={p.id} className="flex items-center justify-between py-1">
                      <span className="text-xs font-mono text-text">{p.title}</span>
                      <span className="text-[10px] font-mono text-accent-rose">Review now</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-4">
            <Recommendations solvedIds={solvedIds} bookmarkedIds={bookmarkedIds} />
          </div>

          {filteredProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-mono text-sm text-text-muted">No problems match those filters — clear them to see everything</p>
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
                onToggleSolved={() => handleToggleSolved(p.id)}
                onToggleBookmark={() =>
                  setTracker((prev) => ({
                    ...prev,
                    bookmarked: { ...prev.bookmarked, [p.id]: !prev.bookmarked[p.id] },
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

      <ShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}
