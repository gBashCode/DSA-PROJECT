"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllProblems } from "@/lib/data";
import { useProgress } from "@/lib/progress";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { AnimatedGlowingSearchBar } from "@/components/ui/animated-glowing-search-bar";
import { CheckCircle2, Circle, Bookmark, BookmarkCheck, Code2, ChevronRight } from "lucide-react";
import type { Difficulty, Tier } from "@/lib/types";

const allProblems = getAllProblems();
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
const tiers: Tier[] = ["beginner", "intermediate", "advanced"];

export default function ProblemsPage() {
  const { progress, toggleSolved, toggleBookmark } = useProgress();
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<Difficulty | "all">("all");
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "solved" | "bookmarked" | "unsolved">("all");

  const filtered = useMemo(() => {
    return allProblems.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.patternName?.toLowerCase().includes(q)) return false;
      }
      if (diffFilter !== "all" && p.difficulty !== diffFilter) return false;
      if (tierFilter !== "all" && p.patternTier !== tierFilter) return false;
      if (statusFilter === "solved" && !progress.solved.includes(p.id)) return false;
      if (statusFilter === "bookmarked" && !progress.bookmarked.includes(p.id)) return false;
      if (statusFilter === "unsolved" && progress.solved.includes(p.id)) return false;
      return true;
    });
  }, [search, diffFilter, tierFilter, statusFilter, progress.solved, progress.bookmarked]);

  const diffStyles: Record<Difficulty, string> = {
    Easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <AnimateIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Code2 className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">All Problems</h1>
          </div>
          <p className="mt-2 text-muted-foreground text-lg">
            Search, filter, and track your progress across every problem.
          </p>
        </div>
      </AnimateIn>

      {/* Search + Filters */}
      <AnimateIn delay={100}>
        <div className="mb-6 space-y-3">
          <AnimatedGlowingSearchBar
            placeholder="Search by problem or pattern..."
            onSearch={setSearch}
            className="max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            {[
              { value: diffFilter, onChange: setDiffFilter, options: ["all", ...difficulties], label: "Difficulty" },
              { value: tierFilter, onChange: setTierFilter, options: ["all", ...tiers], label: "Tier" },
              { value: statusFilter, onChange: setStatusFilter, options: ["all", "solved", "bookmarked", "unsolved"], label: "Status" },
            ].map((filter) => (
              <select
                key={filter.label}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value as never)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all duration-200 cursor-pointer hover:bg-accent"
              >
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "all" ? `All ${filter.label}s` : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </AnimateIn>

      <div className="mb-4 text-xs text-muted-foreground font-medium">
        {filtered.length} problem{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Problem list */}
      <div className="space-y-0.5">
        {filtered.map((problem, i) => {
          const solved = progress.solved.includes(problem.id);
          const bookmarked = progress.bookmarked.includes(problem.id);
          return (
            <div
              key={problem.id}
              className="group flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-accent/60 transition-all duration-150 stagger-item"
              style={{ animationDelay: `${Math.min(i * 20, 400)}ms` }}
            >
              <button
                onClick={() => toggleSolved(problem.id)}
                className="shrink-0 transition-all duration-200 hover:scale-110 active:scale-95"
                title={solved ? "Mark unsolved" : "Mark solved"}
              >
                {solved ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/30 hover:text-muted-foreground transition-colors" />
                )}
              </button>

              <Link href={`/problems/${problem.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-150">
                    {problem.title}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${diffStyles[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  {problem.patternName && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground hidden sm:inline-block">
                      {problem.patternName}
                    </span>
                  )}
                </div>
              </Link>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleBookmark(problem.id)}
                  className="p-1.5 rounded-lg hover:bg-accent transition-all duration-150 hover:scale-110 active:scale-95"
                  title={bookmarked ? "Remove bookmark" : "Bookmark"}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-muted-foreground/30 hover:text-muted-foreground transition-colors" />
                  )}
                </button>
                <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 hidden sm:block" />
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center animate-fade-in">
            <Code2 className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
            <p className="font-semibold text-lg">No problems found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
