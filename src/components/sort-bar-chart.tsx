"use client";

import { useMemo } from "react";

interface SortBarChartProps {
  /** New interface: used by /visualizer/sorting */
  step?: { array: number[]; comparing?: [number, number] | null; swapping?: [number, number] | null; sorted?: number[]; pivot?: number };
  maxValue?: number;
  barWidth?: number;
  /** Legacy interface: used by home page */
  array?: number[];
  comparing?: [number, number] | null;
  swapping?: [number, number] | null;
  sorted?: number[];
  height?: number;
}

export function SortBarChart({
  step,
  maxValue: propMaxVal,
  barWidth: propBarWidth,
  array: legacyArray,
  comparing: legacyComparing,
  swapping: legacySwapping,
  sorted: legacySorted,
  height = 220,
}: SortBarChartProps) {
  const arr = useMemo(() => (step ? step.array : legacyArray ?? []), [step, legacyArray]);
  const maxVal = useMemo(() => {
    if (step) return propMaxVal ?? Math.max(...step.array, 1);
    return Math.max(...arr, 1);
  }, [step, propMaxVal, arr]);
  const barWidth = step ? (propBarWidth ?? 20) : undefined;

  const comparing = step ? step.comparing : legacyComparing ?? null;
  const swapping = step ? step.swapping : legacySwapping ?? null;
  const sorted = useMemo(() => (step ? step.sorted : legacySorted ?? []), [step, legacySorted]);
  const pivot = step?.pivot;

  const barColors = useMemo(() => {
    return arr.map((_: number, i: number) => {
      if (sorted?.includes(i)) return "var(--accent-teal)";
      if (pivot === i) return "var(--accent-danger)";
      if (
        (comparing && comparing[0] === i) ||
        (comparing && comparing[1] === i) ||
        (swapping && swapping[0] === i) ||
        (swapping && swapping[1] === i)
      )
        return "var(--accent-amber)";
      return "var(--border-color)";
    });
  }, [arr, comparing, swapping, sorted, pivot]);

  return (
    <div
      className="flex items-end gap-px overflow-hidden rounded-md border border-border bg-bg p-3"
      style={{ height }}
    >
      {arr.map((val: number, i: number) => {
        const h = (val / maxVal) * (height - 40);
        return (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-150"
            style={{
              height: `${h}px`,
              backgroundColor: barColors[i],
              minWidth: barWidth ? `${Math.max(barWidth, 2)}px` : undefined,
            }}
            title={`${val}`}
          />
        );
      })}
    </div>
  );
}

export default SortBarChart;
