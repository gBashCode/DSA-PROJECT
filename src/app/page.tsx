"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SortBarChart from "@/components/sort-bar-chart";

const BUBBLE_SORT_SIZE = 30;
const BUBBLE_SORT_SPEED = 30;

function generateRandomArray(size: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 95) + 5);
  }
  return arr;
}

function bubbleSortSteps(input: number[]) {
  const arr = [...input];
  const steps: {
    array: number[];
    comparing: [number, number] | null;
    swapping: [number, number] | null;
    sorted: number[];
  }[] = [];
  const sorted: number[] = [];

  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: null,
        sorted: [...sorted],
      });

      if (arr[j] > arr[j + 1]) {
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: [j, j + 1],
          sorted: [...sorted],
        });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    sorted.push(i);
  }

  sorted.push(0);
  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [...sorted],
  });

  return steps;
}

const initialSteps = bubbleSortSteps(generateRandomArray(BUBBLE_SORT_SIZE));

export default function HomePage() {
  const [steps, setSteps] = useState(initialSteps);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restart = useCallback(() => {
    const arr = generateRandomArray(BUBBLE_SORT_SIZE);
    const s = bubbleSortSteps(arr);
    setSteps(s);
    setStepIndex(0);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (isPaused || steps.length === 0) return;

    timerRef.current = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setTimeout(restart, 800);
          return prev;
        }
        return prev + 1;
      });
    }, BUBBLE_SORT_SPEED);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, steps.length, restart]);

  const current = steps[stepIndex] ?? {
    array: Array.from({ length: BUBBLE_SORT_SIZE }, (_, i) => i + 1),
    comparing: null,
    swapping: null,
    sorted: [] as number[],
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] px-4">
      <div className="absolute inset-0 flex items-end justify-center opacity-20 pointer-events-none overflow-hidden pb-20">
        <div className="w-full max-w-4xl px-8">
          <SortBarChart
            array={current.array}
            comparing={current.comparing}
            swapping={current.swapping}
            sorted={current.sorted}
            height={400}
          />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight font-mono text-text">
          DSA Practice
        </h1>
        <p className="mt-6 text-lg text-text-muted leading-relaxed">
          Track your progress. Visualize algorithms. Ship with confidence.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/tracker"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-8 font-mono text-sm font-semibold text-accent-amber transition-all hover:bg-accent-amber/10 hover:border-accent-amber/40"
          >
            Tracker&nbsp;&rarr;
          </Link>
          <Link
            href="/visualizer"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-8 font-mono text-sm font-semibold text-accent-teal transition-all hover:bg-accent-teal/10 hover:border-accent-teal/40"
          >
            Visualizer&nbsp;&rarr;
          </Link>
        </div>

        <button
          onClick={() => setIsPaused((p) => !p)}
          className="mt-6 font-mono text-xs text-text-muted hover:text-text transition-colors"
        >
          {isPaused ? "[ paused — click to resume ]" : "[ running — click to pause ]"}
        </button>
      </div>
    </div>
  );
}
