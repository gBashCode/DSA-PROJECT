"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, ChevronDown, ChevronUp, BookOpen, Zap, Rocket, ExternalLink, CheckCircle2, Circle } from "lucide-react";
import { patterns } from "@/lib/data";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import type { Tier } from "@/lib/types";

interface TierSection {
  tier: Tier;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const tierSections: TierSection[] = [
  {
    tier: "beginner",
    title: "Beginner",
    description: "Master these foundational patterns first. They appear in 80%+ of interviews.",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-accent-teal",
    bgColor: "bg-accent-teal/10",
    borderColor: "border-accent-teal/30",
  },
  {
    tier: "intermediate",
    title: "Intermediate",
    description: "Build on fundamentals with more complex data structures and traversal techniques.",
    icon: <Zap className="w-5 h-5" />,
    color: "text-accent-amber",
    bgColor: "bg-accent-amber/10",
    borderColor: "border-accent-amber/30",
  },
  {
    tier: "advanced",
    title: "Advanced",
    description: "Tackle the hardest patterns that distinguish senior engineers.",
    icon: <Rocket className="w-5 h-5" />,
    color: "text-accent-rose",
    bgColor: "bg-accent-rose/10",
    borderColor: "border-accent-rose/30",
  },
];

interface TrackerState {
  solved: Record<string, boolean>;
  bookmarked: Record<string, boolean>;
}

export default function PatternsPage() {
  const [tracker] = useLocalStorageState<TrackerState>("dsa-tracker:v1", {
    solved: {},
    bookmarked: {},
  });
  const [expandedTier, setExpandedTier] = useState<Tier | null>("beginner");
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  const totalProblems = patterns.reduce((sum, p) => sum + p.problems.length, 0);
  const solvedCount = patterns.reduce(
    (sum, p) => sum + p.problems.filter((prob) => tracker.solved[prob.id]).length,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-accent-amber/10">
            <Layers className="w-6 h-6 text-accent-amber" />
          </div>
          <div>
            <h1 className="text-3xl font-mono font-bold text-text">DSA Patterns</h1>
            <p className="text-sm font-mono text-text-muted">
              {patterns.length} patterns &middot; {solvedCount}/{totalProblems} problems solved
            </p>
          </div>
        </div>
        <p className="text-base font-mono text-text-muted max-w-2xl">
          Learn patterns, not just problems. Each pattern unlocks solving dozens of similar questions.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {tierSections.map((section) => {
          const tierPatterns = patterns.filter((p) => p.tier === section.tier);
          const tierSolved = tierPatterns.reduce(
            (sum, p) => sum + p.problems.filter((prob) => tracker.solved[prob.id]).length,
            0
          );
          const tierTotal = tierPatterns.reduce((sum, p) => sum + p.problems.length, 0);
          const pct = tierTotal > 0 ? Math.round((tierSolved / tierTotal) * 100) : 0;

          return (
            <div key={section.tier} className={`p-4 rounded-xl border ${section.borderColor} ${section.bgColor}`}>
              <div className={`flex items-center gap-2 mb-2 ${section.color}`}>
                {section.icon}
                <span className="text-sm font-mono font-bold">{section.title}</span>
              </div>
              <p className="text-xs font-mono text-text-muted mb-2">{tierPatterns.length} patterns</p>
              <div className="h-1.5 rounded-full bg-bg overflow-hidden">
                <div
                  className={`h-full rounded-full ${section.color.replace("text-", "bg-")}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-text-muted mt-1">{tierSolved}/{tierTotal} ({pct}%)</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {tierSections.map((section) => {
          const tierPatterns = patterns.filter((p) => p.tier === section.tier);
          const isExpanded = expandedTier === section.tier;

          return (
            <div key={section.tier} className={`rounded-xl border border-border bg-surface overflow-hidden`}>
              <button
                onClick={() => setExpandedTier(isExpanded ? null : section.tier)}
                className="w-full flex items-center justify-between p-5 hover:bg-bg/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${section.bgColor} ${section.color}`}>
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-mono font-bold text-text">{section.title}</h2>
                    <p className="text-xs font-mono text-text-muted">{tierPatterns.length} patterns</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4 space-y-3">
                  <p className="text-sm font-mono text-text-muted mb-4">{section.description}</p>
                  {tierPatterns.map((pattern) => {
                    const isPatternExpanded = expandedPattern === pattern.slug;
                    const solvedInPattern = pattern.problems.filter((p) => tracker.solved[p.id]).length;
                    const patternPct = pattern.problems.length > 0 ? Math.round((solvedInPattern / pattern.problems.length) * 100) : 0;

                    return (
                      <div key={pattern.slug} className="rounded-lg border border-border bg-bg overflow-hidden">
                        <button
                          onClick={() => setExpandedPattern(isPatternExpanded ? null : pattern.slug)}
                          className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${section.color.replace("text-", "bg-")}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono font-semibold text-text">{pattern.name}</span>
                                <span className="text-[10px] font-mono text-text-muted">
                                  {solvedInPattern}/{pattern.problems.length}
                                </span>
                              </div>
                              <div className="h-1 rounded-full bg-border mt-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${section.color.replace("text-", "bg-")}`}
                                  style={{ width: `${patternPct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          {isPatternExpanded ? (
                            <ChevronUp className="w-4 h-4 text-text-muted shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                          )}
                        </button>

                        {isPatternExpanded && (
                          <div className="px-4 pb-4 space-y-4">
                            <p className="text-sm font-mono text-text-muted">{pattern.description}</p>

                            {pattern.keyIdea && (
                              <div className="p-3 rounded-lg bg-accent-amber/5 border border-accent-amber/20">
                                <h4 className="text-xs font-mono font-semibold text-accent-amber mb-1">Key Idea</h4>
                                <p className="text-xs font-mono text-text">{pattern.keyIdea}</p>
                              </div>
                            )}

                            <div>
                              <h4 className="text-xs font-mono font-semibold text-text-muted mb-2 uppercase tracking-wider">
                                Problems ({pattern.problems.length})
                              </h4>
                              <div className="space-y-1.5">
                                {pattern.problems.map((prob) => {
                                  const isSolved = tracker.solved[prob.id];
                                  return (
                                    <div
                                      key={prob.id}
                                      className="flex items-center justify-between p-2 rounded hover:bg-surface transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        {isSolved ? (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
                                        ) : (
                                          <Circle className="w-3.5 h-3.5 text-text-muted" />
                                        )}
                                        <span className="text-xs font-mono text-text">{prob.title}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                            prob.difficulty === "Easy"
                                              ? "bg-accent-teal/10 text-accent-teal"
                                              : prob.difficulty === "Medium"
                                              ? "bg-accent-amber/10 text-accent-amber"
                                              : "bg-accent-rose/10 text-accent-rose"
                                          }`}
                                        >
                                          {prob.difficulty}
                                        </span>
                                        <a
                                          href={prob.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1 text-text-muted hover:text-text transition-colors"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <Link
                              href={`/problems?pattern=${pattern.slug}`}
                              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-border text-text text-xs font-mono hover:bg-surface transition-colors"
                            >
                              View all problems
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
