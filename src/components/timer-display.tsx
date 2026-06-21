"use client";

import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerDisplayProps {
  formatted: string;
  isRunning: boolean;
  isPaused: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function TimerDisplay({ formatted, isRunning, isPaused, onToggle, onReset }: TimerDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface font-mono text-sm">
        <Clock className="w-3.5 h-3.5 text-text-muted" />
        <span className={`tabular-nums ${isRunning ? "text-accent-teal" : "text-text"}`}>{formatted}</span>
      </div>
      <button
        onClick={onToggle}
        className={`p-1.5 rounded-lg border transition-colors ${
          isRunning
            ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber"
            : "border-border bg-surface text-text-muted hover:text-text"
        }`}
        title={isRunning ? "Pause" : isPaused ? "Resume" : "Start timer"}
      >
        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
      {(isRunning || isPaused) && (
        <button
          onClick={onReset}
          className="p-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-text transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
