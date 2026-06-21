"use client";

import { useState } from "react";
import type { Problem } from "@/data/problems";
import { cn } from "@/lib/utils";

interface ProblemRowProps {
  problem: Problem;
  index: number;
  solved: boolean;
  bookmarked: boolean;
  notes: string;
  onToggleSolved: () => void;
  onToggleBookmark: () => void;
  onNotesChange: (notes: string) => void;
}

const difficultyStyles: Record<string, string> = {
  Easy: "text-accent-teal",
  Medium: "text-accent-amber",
  Hard: "text-accent-danger",
};

export default function ProblemRow({
  problem,
  index,
  solved,
  bookmarked,
  notes,
  onToggleSolved,
  onToggleBookmark,
  onNotesChange,
}: ProblemRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group border-b border-border transition-colors",
        solved && "bg-accent-teal/5"
      )}
    >
      <div className="flex items-center gap-3 px-3 py-2 text-sm">
        <span className="w-8 shrink-0 text-right font-mono text-xs text-text-muted">
          {index}
        </span>

        <button
          onClick={onToggleSolved}
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border transition-colors",
            solved
              ? "border-accent-teal bg-accent-teal"
              : "border-border hover:border-text-muted"
          )}
          aria-label={solved ? "Mark unsolved" : "Mark solved"}
        >
          {solved && (
            <svg
              viewBox="0 0 12 12"
              className="h-full w-full p-0.5 text-bg"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          )}
        </button>

        <a
          href={problem.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "min-w-0 flex-1 truncate transition-colors hover:text-accent-amber",
            solved ? "text-text-muted line-through" : "text-text"
          )}
        >
          {problem.title}
        </a>

        <span
          className={cn(
            "shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider",
            difficultyStyles[problem.difficulty]
          )}
        >
          [{problem.difficulty.toUpperCase()}]
        </span>

        <button
          onClick={onToggleBookmark}
          className={cn(
            "shrink-0 text-sm transition-colors",
            bookmarked ? "text-accent-amber" : "text-text-muted hover:text-accent-amber"
          )}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark for revisit"}
        >
          {bookmarked ? "★" : "☆"}
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 text-xs text-text-muted transition-colors hover:text-text"
          aria-label={expanded ? "Collapse notes" : "Expand notes"}
        >
          {expanded ? "▾" : "▸"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border bg-surface px-12 py-2">
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add notes..."
            rows={2}
            className="w-full resize-y rounded bg-bg p-2 font-mono text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-amber"
          />
        </div>
      )}
    </div>
  );
}
