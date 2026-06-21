"use client";
import companies from "@/data/companies.json";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ExternalLink, ChevronDown, Building2 } from "lucide-react";
import { useState } from "react";

const companyColors: Record<string, string> = {
  Google: "text-blue-600 dark:text-blue-400",
  Amazon: "text-amber-600 dark:text-amber-400",
  Meta: "text-blue-600 dark:text-blue-400",
  Microsoft: "text-sky-600 dark:text-sky-400",
  Apple: "text-zinc-600 dark:text-zinc-400",
};

export default function CompaniesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const data = companies as Array<{ company: string; topProblems: Array<{ title: string; leetcode: number; difficulty: string }> }>;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <AnimateIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Company Problems</h1>
          </div>
          <p className="mt-2 text-muted-foreground text-lg">
            Top problems asked at leading tech companies — practice with purpose
          </p>
        </div>
      </AnimateIn>

      {/* Company ticker */}
      <AnimateIn delay={100}>
        <div className="mb-8">
          <InfiniteSlider speed={15} gap={12}>
            {data.map((entry) => (
              <div
                key={entry.company}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-black ${companyColors[entry.company] || "text-foreground"}`}>
                  {entry.company[0]}
                </div>
                {entry.company}
                <span className="text-xs text-muted-foreground">({entry.topProblems.length})</span>
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </AnimateIn>

      <div className="space-y-2">
        {data.map((entry, i) => {
          const isOpen = expanded === entry.company;
          const letterColor = companyColors[entry.company] || "text-foreground";
          return (
            <AnimateIn key={entry.company} delay={i * 80}>
              <div>
                <button
                  onClick={() => setExpanded(isOpen ? null : entry.company)}
                  className="w-full text-left rounded-xl border border-border p-5 hover:bg-accent/50 transition-all duration-200 card-interactive group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-lg font-black transition-all duration-300 group-hover:scale-110 ${letterColor}`}>
                        {entry.company[0]}
                      </div>
                      <div>
                        <h3 className="font-bold group-hover:text-primary transition-colors">{entry.company}</h3>
                        <span className="text-xs text-muted-foreground font-medium">{entry.topProblems.length} problems</span>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground/30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="ml-6 mt-1 pl-5 border-l-2 border-border space-y-0.5 py-1">
                    {entry.topProblems.map((problem, pi) => (
                      <a
                        key={problem.title}
                        href={`https://leetcode.com/problems/${problem.leetcode}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-accent/50 transition-all duration-150 stagger-item"
                        style={{ animationDelay: `${pi * 30}ms` }}
                      >
                        <span className="flex-1 text-sm font-medium truncate group-hover:text-primary transition-colors">{problem.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                          problem.difficulty === "Easy" ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" :
                          problem.difficulty === "Medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" :
                          "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        }`}>{problem.difficulty}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>
          );
        })}
      </div>
    </div>
  );
}
