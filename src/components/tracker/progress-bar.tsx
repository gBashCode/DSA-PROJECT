"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
  height?: string;
}

export default function ProgressBar({
  value,
  max,
  color = "bg-accent-amber",
  className,
  height = "h-1.5",
}: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-border",
        height,
        className
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-300", color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
