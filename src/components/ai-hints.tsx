"use client";

import { useState } from "react";
import { Lightbulb, Eye, EyeOff } from "lucide-react";

interface AIHintsProps {
  hints: string[];
}

export function AIHints({ hints }: AIHintsProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  if (!hints || hints.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono text-text-muted flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-accent-amber" />
          Hints ({revealedCount}/{hints.length})
        </h4>
        {revealedCount < hints.length && (
          <button
            onClick={() => setRevealedCount((c) => c + 1)}
            className="text-xs font-mono text-accent-amber hover:text-accent-amber/80 transition-colors flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            Reveal next
          </button>
        )}
      </div>

      <div className="space-y-2">
        {hints.map((hint, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border text-sm font-mono transition-all ${
              i < revealedCount
                ? "border-accent-amber/30 bg-accent-amber/5 text-text"
                : i === revealedCount
                ? "border-dashed border-border bg-bg text-text-muted cursor-pointer hover:border-accent-amber/30"
                : "border-border bg-surface text-text-muted opacity-50"
            }`}
            onClick={() => i === revealedCount && setRevealedCount((c) => c + 1)}
          >
            <span className="text-accent-amber mr-2">Hint {i + 1}:</span>
            {i < revealedCount ? (
              hint
            ) : i === revealedCount ? (
              <span className="flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5" /> Click to reveal
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5" /> Locked
              </span>
            )}
          </div>
        ))}
      </div>

      {revealedCount > 0 && revealedCount < hints.length && (
        <button
          onClick={() => setRevealedCount(0)}
          className="text-xs font-mono text-text-muted hover:text-text transition-colors"
        >
          Reset hints
        </button>
      )}
    </div>
  );
}
