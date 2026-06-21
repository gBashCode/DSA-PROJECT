"use client";

import Link from "next/link";
import { Code2, Heart, BookOpen, Brain, Timer, Trophy, Download, Keyboard } from "lucide-react";

const features = [
  { icon: <Timer className="w-5 h-5" />, title: "Timer & Tracking", description: "Track time spent on problems, daily streaks, and weekly stats" },
  { icon: <Brain className="w-5 h-5" />, title: "Algorithm Visualizer", description: "Interactive visualizations for sorting, trees, and graphs" },
  { icon: <Trophy className="w-5 h-5" />, title: "Pattern Quiz", description: "Test your ability to identify which DSA pattern applies" },
  { icon: <BookOpen className="w-5 h-5" />, title: "12-Week Roadmap", description: "Structured study plan with weekly goals and tips" },
  { icon: <Download className="w-5 h-5" />, title: "Export Progress", description: "Download your progress as JSON or Markdown reports" },
  { icon: <Keyboard className="w-5 h-5" />, title: "Keyboard Shortcuts", description: "Navigate and interact with keyboard shortcuts" },
];

const stats = [
  { value: "173+", label: "LeetCode Problems" },
  { value: "26", label: "DSA Patterns" },
  { value: "21", label: "Topic Categories" },
  { value: "5", label: "Company Roadmaps" },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-amber/10 mb-4">
          <Code2 className="w-8 h-8 text-accent-amber" />
        </div>
        <h1 className="text-4xl font-mono font-bold text-text mb-3">DSA Practice</h1>
        <p className="text-lg font-mono text-text-muted max-w-md mx-auto">
          Track your progress. Visualize algorithms. Ship with confidence.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-4 rounded-xl border border-border bg-surface">
            <p className="text-2xl font-mono font-bold text-accent-amber">{stat.value}</p>
            <p className="text-xs font-mono text-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-mono font-bold text-text mb-6 text-center">Features</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {features.map((f) => (
          <div key={f.title} className="flex gap-4 p-4 rounded-xl border border-border bg-surface">
            <div className="p-2 rounded-lg bg-accent-amber/10 text-accent-amber h-fit">{f.icon}</div>
            <div>
              <h3 className="text-sm font-mono font-semibold text-text">{f.title}</h3>
              <p className="text-xs font-mono text-text-muted mt-1">{f.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-mono font-bold text-text mb-6 text-center">Topics Covered</h2>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {[
          "Arrays", "Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search",
          "Linked Lists", "Trees", "Tries", "Heap", "Backtracking", "Graphs",
          "Dynamic Programming", "Greedy", "Intervals", "Bit Manipulation", "Union Find",
          "Topological Sort", "Matrix", "Math & Geometry",
        ].map((topic) => (
          <span key={topic} className="px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-mono text-text-muted">
            {topic}
          </span>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm font-mono text-text-muted mb-4 flex items-center justify-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-accent-rose" /> using Next.js, React, and Tailwind CSS
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/tracker"
            className="px-4 py-2 rounded-lg bg-accent-amber text-bg font-mono text-sm font-semibold hover:bg-accent-amber/90 transition-colors"
          >
            Start Practicing
          </Link>
          <Link
            href="/roadmap"
            className="px-4 py-2 rounded-lg border border-border text-text font-mono text-sm hover:bg-surface transition-colors"
          >
            View Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
