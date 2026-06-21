"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProblemById } from "@/lib/data";
import { useProgress } from "@/lib/progress";
import { patternVideos, problemVideos } from "@/lib/youtube";
import { AnimateIn } from "@/components/animations/AnimateIn";
import {
  ArrowLeft, ExternalLink, CheckCircle2, Circle, Bookmark, BookmarkCheck,
  Lightbulb, Play
} from "lucide-react";

export default function ProblemPage() {
  const params = useParams();
  const id = params.id as string;
  const result = getProblemById(id);
  const problem = result?.problem;
  const pattern = result?.pattern;
  const { progress, toggleSolved, toggleBookmark } = useProgress();
  const [showHint, setShowHint] = useState<number>(-1);

  if (!problem) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center animate-fade-in">
        <h1 className="text-2xl font-bold mb-3">Problem Not Found</h1>
        <Link href="/problems" className="text-sm text-primary hover:underline">Back to Problems</Link>
      </div>
    );
  }

  const solved = progress.solved.includes(problem.id);
  const bookmarked = progress.bookmarked.includes(problem.id);
  const video = problemVideos[problem.id];
  const patternVids = pattern ? patternVideos[pattern.slug] || [] : [];

  const diffStyles: Record<string, string> = {
    Easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <AnimateIn>
        <Link href="/problems" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          All Problems
        </Link>
      </AnimateIn>

      {/* Header */}
      <AnimateIn delay={50}>
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{problem.title}</h1>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${diffStyles[problem.difficulty] || ""}`}>
                  {problem.difficulty}
                </span>
              </div>
              {pattern && (
                <Link href={`/patterns/${pattern.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors hover-underline">
                  {pattern.name}
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSolved(problem.id)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-4 text-xs font-semibold transition-all duration-200 btn-press ${
                  solved
                    ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm shadow-green-500/10"
                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {solved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                {solved ? "Solved" : "Mark Solved"}
              </button>
              <button
                onClick={() => toggleBookmark(problem.id)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 btn-press ${
                  bookmarked
                    ? "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/10"
                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
              </button>
              {problem.leetcode && (
                <a
                  href={`https://leetcode.com/problems/${problem.leetcode}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-4 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 btn-press"
                >
                  LeetCode <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Video */}
      {video && (
        <AnimateIn delay={100}>
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Video Explanation</h2>
            <a href={video.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-accent/50 transition-all duration-200 card-interactive">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/20 shrink-0 transition-transform duration-200 group-hover:scale-110">
                <Play className="h-5 w-5 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{video.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{video.channel}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
            </a>
          </section>
        </AnimateIn>
      )}

      {/* Description */}
      <AnimateIn delay={150}>
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Description</h2>
          <div className="rounded-xl border border-border p-6 bg-card">
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{problem.description}</p>
          </div>
        </section>
      </AnimateIn>

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <AnimateIn delay={200}>
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Examples</h2>
            <div className="space-y-2">
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs stagger-item" style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className="mb-2"><span className="font-bold text-primary">Input:</span> <span className="text-foreground">{ex.input}</span></div>
                  <div><span className="font-bold text-primary">Output:</span> <span className="text-foreground">{ex.output}</span></div>
                </div>
              ))}
            </div>
          </section>
        </AnimateIn>
      )}

      {/* Hints */}
      {problem.hints && problem.hints.length > 0 && (
        <AnimateIn delay={250}>
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              Hints
            </h2>
            <div className="space-y-2">
              {problem.hints.map((hint, idx) => (
                <div key={idx}>
                  {showHint >= idx ? (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm animate-scale-in">
                      <span className="font-bold text-amber-600 dark:text-amber-400">Hint {idx + 1}: </span>
                      <span className="text-foreground">{hint}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowHint(idx)}
                      className="w-full text-left rounded-xl border border-border p-4 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-amber-500/20 transition-all duration-200 btn-press"
                    >
                      <Lightbulb className="h-4 w-4 inline mr-2 text-amber-500" />
                      Reveal Hint {idx + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </AnimateIn>
      )}

      {/* Complexity */}
      <AnimateIn delay={300}>
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Complexity</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-5 bg-card">
              <div className="text-xs text-muted-foreground mb-1.5">Time</div>
              <div className="font-mono text-sm font-bold gradient-text">{problem.timeComplexity}</div>
            </div>
            <div className="rounded-xl border border-border p-5 bg-card">
              <div className="text-xs text-muted-foreground mb-1.5">Space</div>
              <div className="font-mono text-sm font-bold gradient-text">{problem.spaceComplexity}</div>
            </div>
          </div>
        </section>
      </AnimateIn>

      {/* Pattern Videos */}
      {patternVids.length > 0 && (
        <AnimateIn delay={400}>
          <section className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Learn the Pattern</h2>
            <div className="space-y-2">
              {patternVids.map((vid, idx) => (
                <a key={idx} href={vid.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-accent/50 transition-all duration-200 card-interactive stagger-item"
                  style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md shadow-red-500/20 shrink-0 transition-transform duration-200 group-hover:scale-110">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{vid.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{vid.channel}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </section>
        </AnimateIn>
      )}
    </div>
  );
}
