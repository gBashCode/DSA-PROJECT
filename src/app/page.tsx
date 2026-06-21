"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SortBarChart from "@/components/sort-bar-chart";
import { Code2, Brain, Trophy, BookOpen, Timer, ArrowRight } from "lucide-react";

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

const features = [
  { icon: <Timer className="w-5 h-5" />, title: "Track Progress", description: "Log solved problems with timer and streaks", color: "text-accent-amber", bg: "bg-accent-amber/10" },
  { icon: <Brain className="w-5 h-5" />, title: "Visualize", description: "Watch sorting, trees, and graphs in action", color: "text-accent-teal", bg: "bg-accent-teal/10" },
  { icon: <Trophy className="w-5 h-5" />, title: "Quiz Yourself", description: "Test pattern recognition skills", color: "text-accent-rose", bg: "bg-accent-rose/10" },
  { icon: <BookOpen className="w-5 h-5" />, title: "System Design", description: "Master distributed systems architecture", color: "text-accent-violet", bg: "bg-accent-violet/10" },
];

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
    <div className="relative min-h-[calc(100vh-3rem)]">
      <div className="absolute inset-0 flex items-end justify-center opacity-15 pointer-events-none overflow-hidden">
        <div className="w-full max-w-5xl px-8 pb-0">
          <SortBarChart
            array={current.array}
            comparing={current.comparing}
            swapping={current.swapping}
            sorted={current.sorted}
            height={350}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] px-4 py-16">
        <div className="text-center max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-amber/30 bg-accent-amber/5 mb-6">
            <Code2 className="w-4 h-4 text-accent-amber" />
            <span className="text-xs font-mono text-accent-amber">173 problems &middot; 26 patterns &middot; 21 topics</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight font-mono mb-4">
            <span className="text-text">DSA</span>
            <span className="gradient-text ml-3">Practice</span>
          </h1>
          <p className="text-lg text-text-muted leading-relaxed max-w-xl mx-auto">
            Track your progress. Visualize algorithms. Ship with confidence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 w-full max-w-2xl">
          {features.map((f) => (
            <div key={f.title} className="p-4 rounded-xl border border-border bg-surface/80 backdrop-blur text-center card-hover">
              <div className={`inline-flex p-2 rounded-lg ${f.bg} ${f.color} mb-2`}>
                {f.icon}
              </div>
              <h3 className="text-sm font-mono font-semibold text-text mb-1">{f.title}</h3>
              <p className="text-[10px] font-mono text-text-muted">{f.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/tracker"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-amber px-8 font-mono text-sm font-bold text-bg transition-all hover:bg-accent-amber/90 hover:scale-105"
          >
            Start Tracking
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/patterns"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-8 font-mono text-sm font-semibold text-text transition-all hover:bg-bg hover:border-accent-teal/40"
          >
            Browse Patterns
          </Link>
          <Link
            href="/system-design"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-8 font-mono text-sm font-semibold text-text transition-all hover:bg-bg hover:border-accent-violet/40"
          >
            System Design
          </Link>
        </div>

        <button
          onClick={() => setIsPaused((p) => !p)}
          className="font-mono text-xs text-text-muted hover:text-text transition-colors"
        >
          {isPaused ? "[ paused — click to resume ]" : "[ running — click to pause ]"}
        </button>
      </div>
    </div>
  );
}
