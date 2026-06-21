"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw, ChevronDown, ChevronUp,
} from "lucide-react";
import { SortBarChart } from "@/components/sort-bar-chart";
import {
  sortGenerators, ALGORITHM_INFO,
  type SortAlgorithmName, type SortStep,
} from "@/lib/algorithms/sorting";

const ALGORITHMS: SortAlgorithmName[] = ["bubble", "insertion", "selection", "merge", "quick", "heap"];
const SPEED_OPTIONS = [
  { label: "0.25x", ms: 600 },
  { label: "0.5x", ms: 300 },
  { label: "1x", ms: 150 },
  { label: "2x", ms: 75 },
  { label: "4x", ms: 35 },
];

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

function computeSteps(algorithm: SortAlgorithmName, arr: number[]): SortStep[] {
  const gen = sortGenerators[algorithm];
  const allSteps: SortStep[] = [];
  for (const step of gen(arr)) {
    allSteps.push(step);
  }
  return allSteps;
}

function computeStats(steps: SortStep[], upTo: number) {
  let c = 0;
  let s = 0;
  for (let i = 0; i <= upTo && i < steps.length; i++) {
    const step = steps[i];
    if (step.comparing) c++;
    if (step.swapping) s++;
  }
  return { comparisons: c, swaps: s };
}

export default function SortingVisualizerPage() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithmName>("bubble");
  const [arraySize, setArraySize] = useState(30);
  const [customInput, setCustomInput] = useState("");
  const [steps, setSteps] = useState<SortStep[]>(() => computeSteps("bubble", generateRandomArray(30)));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(2);
  const [showInfo, setShowInfo] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const speed = SPEED_OPTIONS[speedIdx].ms;
  const info = ALGORITHM_INFO[algorithm];
  const currentStep = steps[currentIdx] ?? null;
  const maxVal = currentStep ? Math.max(...currentStep.array, 1) : 100;
  const { comparisons, swaps } = useMemo(() => computeStats(steps, currentIdx), [steps, currentIdx]);

  const generateNewSteps = useCallback((alg: SortAlgorithmName, arr: number[]) => {
    setSteps(computeSteps(alg, arr));
    setCurrentIdx(0);
    setIsPlaying(false);
  }, []);

  const handleRandomize = useCallback(() => {
    generateNewSteps(algorithm, generateRandomArray(arraySize));
  }, [algorithm, arraySize, generateNewSteps]);

  const handleCustomInput = useCallback(() => {
    const parsed = customInput
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);
    if (parsed.length >= 2) {
      setArraySize(parsed.length);
      generateNewSteps(algorithm, parsed);
    }
  }, [customInput, algorithm, generateNewSteps]);

  const handleSizeChange = useCallback((newSize: number) => {
    setArraySize(newSize);
    generateNewSteps(algorithm, generateRandomArray(newSize));
  }, [algorithm, generateNewSteps]);

  const handleAlgorithmChange = useCallback((alg: SortAlgorithmName) => {
    setAlgorithm(alg);
    generateNewSteps(alg, generateRandomArray(arraySize));
  }, [arraySize, generateNewSteps]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const stepForward = () => {
    if (currentIdx < steps.length - 1) setCurrentIdx((p) => p + 1);
    else setIsPlaying(false);
  };
  const stepBack = () => {
    setCurrentIdx((p) => Math.max(0, p - 1));
  };
  const togglePlay = () => {
    if (currentIdx >= steps.length - 1) {
      setCurrentIdx(0);
    }
    setIsPlaying((p) => !p);
  };

  const barWidth = currentStep ? Math.max(Math.floor(800 / currentStep.array.length) - 2, 3) : 20;

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      {/* Top control bar */}
      <div className="border-b border-border bg-surface px-4 py-2 flex flex-wrap items-center gap-3 text-sm">
        <div className="flex gap-1">
          {ALGORITHMS.map((alg) => (
            <button
              key={alg}
              onClick={() => handleAlgorithmChange(alg)}
              className={`px-3 py-1 rounded font-mono text-xs font-medium transition-colors ${
                algorithm === alg
                  ? "bg-accent-amber text-bg"
                  : "text-text-muted hover:text-text hover:bg-border/40"
              }`}
            >
              {ALGORITHM_INFO[alg].name.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-text-muted font-mono text-xs">size:</span>
          <input
            type="range"
            min={10}
            max={100}
            value={arraySize}
            onChange={(e) => handleSizeChange(parseInt(e.target.value))}
            className="w-20 accent-accent-amber"
          />
          <span className="font-mono text-xs w-6 text-right">{arraySize}</span>
        </div>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="42,7,19,..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomInput()}
            className="w-32 bg-bg border border-border rounded px-2 py-1 font-mono text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent-amber"
          />
          <button
            onClick={handleCustomInput}
            className="px-2 py-1 rounded bg-border/40 text-text-muted text-xs hover:bg-border/70 transition-colors"
          >
            Set
          </button>
        </div>

        <div className="h-5 w-px bg-border" />

        <button onClick={handleRandomize} className="p-1.5 rounded bg-border/40 text-text-muted hover:text-text hover:bg-border/70 transition-colors">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Visualization */}
        <div className="flex-1 flex flex-col p-4 gap-3 min-w-0">
          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <button onClick={stepBack} className="p-1.5 rounded hover:bg-border/40 text-text-muted hover:text-text transition-colors" title="Step Back">
              <SkipBack className="h-4 w-4" />
            </button>
            <button onClick={togglePlay} className="p-1.5 rounded bg-accent-amber text-bg hover:bg-accent-amber/80 transition-colors" title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={stepForward} className="p-1.5 rounded hover:bg-border/40 text-text-muted hover:text-text transition-colors" title="Step Forward">
              <SkipForward className="h-4 w-4" />
            </button>

            <div className="h-5 w-px bg-border mx-1" />

            <div className="flex items-center gap-1">
              {SPEED_OPTIONS.map((opt, i) => (
                <button
                  key={opt.label}
                  onClick={() => setSpeedIdx(i)}
                  className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                    speedIdx === i
                      ? "bg-accent-amber text-bg"
                      : "text-text-muted hover:text-text hover:bg-border/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="ml-auto font-mono text-xs text-text-muted">
              step {currentIdx + 1}/{steps.length}
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex-1 flex items-end">
            {currentStep && <SortBarChart step={currentStep} maxValue={maxVal} barWidth={barWidth} />}
          </div>

          {/* Counters */}
          <div className="flex items-center gap-6 font-mono text-xs">
            <span className="text-text-muted">
              comparisons: <span className="text-accent-amber">{comparisons}</span>
            </span>
            <span className="text-text-muted">
              swaps: <span className="text-accent-teal">{swaps}</span>
            </span>
            {currentStep?.description && (
              <span className="text-text-muted truncate">{currentStep.description}</span>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-border bg-surface overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="rounded-lg border border-border bg-bg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">{info.name}</h3>
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${info.stable ? "bg-accent-teal/20 text-accent-teal" : "bg-accent-danger/20 text-accent-danger"}`}>
                  {info.stable ? "stable" : "unstable"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-bg border border-border rounded px-2 py-1.5">
                  <span className="text-text-muted">Time </span>
                  <span className="text-accent-amber">{info.time}</span>
                </div>
                <div className="bg-bg border border-border rounded px-2 py-1.5">
                  <span className="text-text-muted">Space </span>
                  <span className="text-accent-teal">{info.space}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-bg">
              <button
                onClick={() => setShowInfo((p) => !p)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-border/20 transition-colors rounded-lg"
              >
                <span>What&apos;s happening</span>
                {showInfo ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
              </button>
              {showInfo && (
                <div className="px-3 pb-3 text-xs text-text-muted leading-relaxed border-t border-border pt-3">
                  {info.description}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border bg-bg p-3 text-xs space-y-1.5">
              <h4 className="font-bold mb-2">Legend</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--accent-amber)" }} />
                <span className="text-text-muted">Comparing / Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--accent-teal)" }} />
                <span className="text-text-muted">Sorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--accent-danger)" }} />
                <span className="text-text-muted">Pivot (Quick Sort)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--border-color)" }} />
                <span className="text-text-muted">Unsorted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
