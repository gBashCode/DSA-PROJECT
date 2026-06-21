"use client";

import { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import type { Problem, Difficulty, Tier } from "@/lib/types";

export interface FilterState {
  query: string;
  difficulty: Difficulty | "All";
  tier: Tier | "All";
  status: "All" | "Solved" | "Unsolved" | "Bookmarked";
  topic: string;
}

interface SearchFilterProps {
  onChange: (filters: FilterState) => void;
  topics: string[];
}

const defaultFilters: FilterState = {
  query: "",
  difficulty: "All",
  tier: "All",
  status: "All",
  topic: "All",
};

export function useProblemFilters(
  problems: (Problem & { patternSlug: string; patternName: string; patternTier: Tier })[],
  solvedIds: string[],
  bookmarkedIds: string[]
) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (filters.query && !p.title.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.difficulty !== "All" && p.difficulty !== filters.difficulty) return false;
      if (filters.tier !== "All" && p.patternTier !== filters.tier) return false;
      if (filters.topic !== "All" && p.patternSlug !== filters.topic) return false;
      if (filters.status === "Solved" && !solvedIds.includes(p.id)) return false;
      if (filters.status === "Unsolved" && solvedIds.includes(p.id)) return false;
      if (filters.status === "Bookmarked" && !bookmarkedIds.includes(p.id)) return false;
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problems, filters]);

  return { filters, setFilters, filtered };
}

export function SearchFilter({ onChange, topics }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const update = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    setFilters(next);
    onChange(next);
  };

  const activeCount = [
    filters.difficulty !== "All",
    filters.tier !== "All",
    filters.status !== "All",
    filters.topic !== "All",
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search problems..."
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            className="w-full h-10 pl-10 pr-10 rounded-lg border border-border bg-surface text-text text-sm font-mono placeholder:text-text-muted focus:outline-none focus:border-accent-amber/50"
          />
          {filters.query && (
            <button
              onClick={() => update({ query: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 px-3 rounded-lg border font-mono text-sm flex items-center gap-2 transition-colors ${
            showFilters || activeCount > 0
              ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber"
              : "border-border bg-surface text-text-muted hover:text-text"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-accent-amber text-bg text-xs flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 rounded-lg border border-border bg-surface">
          <FilterSelect
            label="Difficulty"
            value={filters.difficulty}
            options={["All", "Easy", "Medium", "Hard"]}
            onChange={(v) => update({ difficulty: v as FilterState["difficulty"] })}
          />
          <FilterSelect
            label="Tier"
            value={filters.tier}
            options={["All", "beginner", "intermediate", "advanced"]}
            onChange={(v) => update({ tier: v as FilterState["tier"] })}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            options={["All", "Solved", "Unsolved", "Bookmarked"]}
            onChange={(v) => update({ status: v as FilterState["status"] })}
          />
          <FilterSelect
            label="Topic"
            value={filters.topic}
            options={["All", ...topics]}
            onChange={(v) => update({ topic: v })}
          />
          {activeCount > 0 && (
            <button
              onClick={() => {
                setFilters(defaultFilters);
                onChange(defaultFilters);
              }}
              className="h-8 px-3 rounded-lg border border-border text-text-muted text-xs font-mono hover:text-text hover:border-accent-rose/40 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-text-muted">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 px-2 rounded border border-border bg-bg text-text text-xs font-mono focus:outline-none focus:border-accent-amber/50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
