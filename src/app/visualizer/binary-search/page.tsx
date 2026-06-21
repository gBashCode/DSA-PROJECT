"use client";

import { useState, useCallback } from "react";

interface Step {
  left: number;
  right: number;
  mid: number;
  found: boolean;
  array: number[];
}

function generateSortedArray(): number[] {
  const arr = Array.from({ length: 20 }, (_, i) => i * 3 + Math.floor(Math.random() * 3));
  return [...new Set(arr)].sort((a, b) => a - b).slice(0, 15);
}

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>(() => generateSortedArray());
  const [target, setTarget] = useState<number>(() => Math.floor(Math.random() * 45));
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);

  const binarySearch = useCallback(async () => {
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;
    const allSteps: Step[] = [];
    setFoundIndex(null);

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      allSteps.push({ left, right, mid, found: arr[mid] === target, array: [...arr] });

      if (arr[mid] === target) {
        setFoundIndex(mid);
        break;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setSteps(allSteps);
    setIsRunning(true);

    for (let i = 0; i < allSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 800));
    }
    setIsRunning(false);
  }, [array, target]);

  const reset = () => {
    const newArr = generateSortedArray();
    setArray(newArr);
    setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setFoundIndex(null);
  };

  const current = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-text">Binary Search</h1>
          <p className="text-sm font-mono text-text-muted">O(log n) search in sorted array</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={binarySearch}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-lg bg-accent-amber text-bg text-sm font-mono font-bold disabled:opacity-50"
          >
            Search
          </button>
          <button
            onClick={reset}
            className="px-4 py-1.5 rounded-lg border border-border bg-surface text-text text-sm font-mono"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface mb-6">
        <p className="text-sm font-mono text-text-muted mb-2">Target: <span className="text-accent-amber font-bold">{target}</span></p>
        <div className="flex items-center gap-1 flex-wrap">
          {array.map((val, i) => {
            let bg = "bg-bg border-border";
            let textColor = "text-text";
            if (current && i >= current.left && i <= current.right) {
              bg = "bg-accent-violet/20 border-accent-violet/40";
            }
            if (current && i === current.mid) {
              bg = "bg-accent-amber border-accent-amber";
              textColor = "text-bg";
            }
            if (foundIndex === i) {
              bg = "bg-accent-teal border-accent-teal";
              textColor = "text-bg";
            }
            return (
              <div
                key={i}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border font-mono text-sm font-bold transition-all ${bg} ${textColor}`}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>

      {current && (
        <div className="p-4 rounded-xl border border-accent-amber/30 bg-accent-amber/5 mb-6">
          <p className="text-sm font-mono text-text">
            <span className="text-accent-amber">Step {currentStep + 1}:</span> Left={current.left}, Right={current.right}, Mid={current.mid}
            {current.found ? <span className="text-accent-teal ml-2">Found!</span> : array[current.mid] < target ? <span className="text-text-muted ml-2">→ Search right</span> : <span className="text-text-muted ml-2">→ Search left</span>}
          </p>
        </div>
      )}

      <div className="p-4 rounded-xl border border-border bg-surface">
        <h3 className="text-sm font-mono font-semibold text-text mb-2">Algorithm</h3>
        <div className="text-xs font-mono text-text-muted space-y-1">
          <p>1. Compare target with middle element</p>
          <p>2. If target equals middle → return index</p>
          <p>3. If target greater → search right half</p>
          <p>4. If target smaller → search left half</p>
          <p>5. Time: O(log n) | Space: O(1)</p>
        </div>
      </div>
    </div>
  );
}
