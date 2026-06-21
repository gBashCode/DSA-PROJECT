"use client";
import { useState } from "react";
import Link from "next/link";
import { getAllPatterns } from "@/lib/data";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { AnimatedGlowingSearchBar } from "@/components/ui/animated-glowing-search-bar";
import { ChevronRight, Layers } from "lucide-react";
import type { Tier } from "@/lib/types";

const tierStyles: Record<Tier, { label: string; dot: string; text: string }> = {
  beginner: { label: "Beginner", dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  intermediate: { label: "Intermediate", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  advanced: { label: "Advanced", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

export default function PatternsPage() {
  const patterns = getAllPatterns();
  const tiers: Tier[] = ["beginner", "intermediate", "advanced"];
  const [search, setSearch] = useState("");

  const filtered = patterns.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <AnimateIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">DSA Patterns</h1>
          </div>
          <p className="mt-2 text-muted-foreground text-lg">
            Master these patterns and you&apos;ll be able to solve any problem in an interview
          </p>
        </div>
      </AnimateIn>

      <AnimateIn delay={100}>
        <div className="mb-8">
          <AnimatedGlowingSearchBar
            placeholder="Search patterns..."
            onSearch={setSearch}
            className="max-w-sm"
          />
        </div>
      </AnimateIn>

      {tiers.map((tier, ti) => {
        const tierPatterns = filtered.filter((p) => p.tier === tier);
        if (tierPatterns.length === 0) return null;
        const config = tierStyles[tier];

        return (
          <div key={tier} className="mb-12">
            <AnimateIn delay={ti * 100}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                <h2 className={`text-sm font-bold uppercase tracking-wider ${config.text}`}>{config.label}</h2>
                <span className="text-xs text-muted-foreground font-medium">({tierPatterns.length})</span>
              </div>
            </AnimateIn>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tierPatterns.map((pattern, i) => (
                <AnimateIn key={pattern.slug} delay={ti * 100 + i * 60}>
                  <Link
                    href={`/patterns/${pattern.slug}`}
                    className="group block rounded-2xl border border-border bg-card p-6 card-interactive hover:border-primary/20 hover:bg-primary/[0.02]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-200">{pattern.name}</h3>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-0.5" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{pattern.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">{pattern.problems.length} problems</span>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="py-20 text-center animate-fade-in">
          <Layers className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
          <p className="font-semibold text-lg">No patterns found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
