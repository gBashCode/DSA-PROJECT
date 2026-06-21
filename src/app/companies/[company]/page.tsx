"use client";

import { use } from "react";
import Link from "next/link";
import companies from "@/data/companies.json";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { ArrowLeft, CheckCircle2, Circle, ExternalLink } from "lucide-react";

interface TrackerState {
  solved: Record<string, boolean>;
  bookmarked: Record<string, boolean>;
}

export default function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company: slug } = use(params);
  const company = companies.find((c) => c.company.toLowerCase() === slug.toLowerCase());

  const [tracker] = useLocalStorageState<TrackerState>("dsa-tracker:v1", {
    solved: {},
    bookmarked: {},
  });

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)]">
        <p className="font-mono text-sm text-text-muted">Company not found</p>
        <Link href="/companies" className="mt-4 text-accent-amber text-sm font-mono hover:underline">
          Back to companies
        </Link>
      </div>
    );
  }

  const solvedCount = company.topProblems.filter((p) => {
    const id = `leetcode-${p.leetcode}`;
    return tracker.solved[id];
  }).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/companies"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All Companies
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-mono font-bold text-lg"
          style={{ backgroundColor: company.color }}
        >
          {company.company[0]}
        </div>
        <div>
          <h1 className="text-2xl font-mono font-bold text-text">{company.company}</h1>
          <p className="text-sm font-mono text-text-muted">{company.totalAsked} problems asked</p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface mb-6">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted mb-2">Focus Areas</h2>
        <p className="text-sm font-mono text-text">{company.focus}</p>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">Progress</h2>
          <span className="text-xs font-mono text-accent-amber">{solvedCount}/{company.topProblems.length}</span>
        </div>
        <div className="h-2 rounded-full bg-bg overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-amber transition-all duration-500"
            style={{ width: `${company.topProblems.length > 0 ? (solvedCount / company.topProblems.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted mb-4">Top Problems</h2>
      <div className="space-y-2">
        {company.topProblems.map((p) => {
          const id = `leetcode-${p.leetcode}`;
          const isSolved = tracker.solved[id];

          return (
            <div
              key={p.leetcode}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isSolved ? "border-accent-teal/30 bg-accent-teal/5" : "border-border bg-surface hover:border-border/80"
              }`}
            >
              <div className="flex items-center gap-3">
                {isSolved ? (
                  <CheckCircle2 className="w-4 h-4 text-accent-teal" />
                ) : (
                  <Circle className="w-4 h-4 text-text-muted" />
                )}
                <div>
                  <p className="text-sm font-mono text-text">{p.title}</p>
                  <p className="text-xs font-mono text-text-muted">#{p.leetcode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    p.difficulty === "Easy"
                      ? "bg-accent-teal/10 text-accent-teal"
                      : p.difficulty === "Medium"
                      ? "bg-accent-amber/10 text-accent-amber"
                      : "bg-accent-rose/10 text-accent-rose"
                  }`}
                >
                  {p.difficulty}
                </span>
                <a
                  href={`https://leetcode.com/problems/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-text-muted hover:text-text transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
