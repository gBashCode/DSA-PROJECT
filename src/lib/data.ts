import type { Pattern, Problem, Tier } from "./types";
import patternsMeta from "@/data/patterns.json";

import hashing from "@/data/problems/hashing.json";
import twoPointers from "@/data/problems/two-pointers.json";
import slidingWindow from "@/data/problems/sliding-window.json";
import prefixSum from "@/data/problems/prefix-sum.json";
import binarySearch from "@/data/problems/binary-search.json";
import sortingComparators from "@/data/problems/sorting-comparators.json";
import stack from "@/data/problems/stack.json";
import recursion from "@/data/problems/recursion.json";
import linkedList from "@/data/problems/linked-list.json";
import fastSlowPointers from "@/data/problems/fast-slow-pointers.json";
import monotonicStack from "@/data/problems/monotonic-stack.json";
import queueDeque from "@/data/problems/queue-deque.json";
import heap from "@/data/problems/heap.json";
import mergeIntervals from "@/data/problems/merge-intervals.json";
import trie from "@/data/problems/trie.json";
import binaryTreeDfs from "@/data/problems/binary-tree-dfs.json";
import binaryTreeBfs from "@/data/problems/binary-tree-bfs.json";
import graphDfs from "@/data/problems/graph-dfs.json";
import graphBfs from "@/data/problems/graph-bfs.json";
import backtracking from "@/data/problems/backtracking.json";
import dp1d from "@/data/problems/dp-1d.json";
import dp2d from "@/data/problems/dp-2d.json";
import greedy from "@/data/problems/greedy.json";
import unionFind from "@/data/problems/union-find.json";
import topologicalSort from "@/data/problems/topological-sort.json";
import bitManipulation from "@/data/problems/bit-manipulation.json";

let globalProblemCounter = 0;

interface SectionData {
  section: string;
  problems: Record<string, unknown>[];
}

function isSectionFormat(data: unknown[]): data is SectionData[] {
  const first = data[0] as Record<string, unknown>;
  return data.length > 0 && "section" in first && "problems" in first;
}

function extractProblems(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    if (isSectionFormat(data)) {
      return data.flatMap((section) => section.problems || []);
    }
    return data as Record<string, unknown>[];
  }
  return [];
}

function normalizeProblems(data: unknown, slug: string): Problem[] {
  const raw = extractProblems(data);
  return raw.map((p) => {
    globalProblemCounter++;
    const problem: Problem = {
      id: `${slug}-${globalProblemCounter}`,
      title: (p.title as string) || "Untitled",
      difficulty: (p.difficulty as Problem["difficulty"]) || "Medium",
      link: (p.link as string) || `https://leetcode.com/problems/${((p.title as string) || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}/`,
    };
    if (p.leetcode) problem.leetcode = p.leetcode as number;
    if (p.description) problem.description = p.description as string;
    if (p.examples) problem.examples = p.examples as { input: string; output: string }[];
    if (p.hints) problem.hints = p.hints as string[];
    if (p.timeComplexity) problem.timeComplexity = p.timeComplexity as string;
    if (p.spaceComplexity) problem.spaceComplexity = p.spaceComplexity as string;
    return problem;
  });
}

const problemMap: Record<string, Problem[]> = {
  hashing: normalizeProblems(hashing, "hashing"),
  "two-pointers": normalizeProblems(twoPointers, "two-pointers"),
  "sliding-window": normalizeProblems(slidingWindow, "sliding-window"),
  "prefix-sum": normalizeProblems(prefixSum, "prefix-sum"),
  "binary-search": normalizeProblems(binarySearch, "binary-search"),
  "sorting-comparators": normalizeProblems(sortingComparators, "sorting-comparators"),
  stack: normalizeProblems(stack, "stack"),
  recursion: normalizeProblems(recursion, "recursion"),
  "linked-list": normalizeProblems(linkedList, "linked-list"),
  "fast-slow-pointers": normalizeProblems(fastSlowPointers, "fast-slow-pointers"),
  "monotonic-stack": normalizeProblems(monotonicStack, "monotonic-stack"),
  "queue-deque": normalizeProblems(queueDeque, "queue-deque"),
  heap: normalizeProblems(heap, "heap"),
  "merge-intervals": normalizeProblems(mergeIntervals, "merge-intervals"),
  trie: normalizeProblems(trie, "trie"),
  "binary-tree-dfs": normalizeProblems(binaryTreeDfs, "binary-tree-dfs"),
  "binary-tree-bfs": normalizeProblems(binaryTreeBfs, "binary-tree-bfs"),
  "graph-dfs": normalizeProblems(graphDfs, "graph-dfs"),
  "graph-bfs": normalizeProblems(graphBfs, "graph-bfs"),
  backtracking: normalizeProblems(backtracking, "backtracking"),
  "dp-1d": normalizeProblems(dp1d, "dp-1d"),
  "dp-2d": normalizeProblems(dp2d, "dp-2d"),
  greedy: normalizeProblems(greedy, "greedy"),
  "union-find": normalizeProblems(unionFind, "union-find"),
  "topological-sort": normalizeProblems(topologicalSort, "topological-sort"),
  "bit-manipulation": normalizeProblems(bitManipulation, "bit-manipulation"),
};

export const patterns: Pattern[] = patternsMeta.map((p) => ({
  ...p,
  tier: p.tier as Tier,
  problems: problemMap[p.slug] || [],
}));

export function getAllProblems() {
  return patterns.flatMap((p) =>
    p.problems.map((prob) => ({
      ...prob,
      patternSlug: p.slug,
      patternName: p.name,
      patternTier: p.tier,
    }))
  );
}

export function getAllPatterns() {
  return patterns;
}

export function getProblemById(id: string) {
  for (const p of patterns) {
    const found = p.problems.find((prob) => prob.id === id);
    if (found) return { pattern: p, problem: found };
  }
  return null;
}

export function getPatternBySlug(slug: string) {
  return patterns.find((p) => p.slug === slug);
}
