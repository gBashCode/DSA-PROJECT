"use client";
import { useState } from "react";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Copy, Check, FileText } from "lucide-react";

const templates = [
  { name: "Two Pointers", desc: "Use two indices moving toward each other or in the same direction", code: `def two_pointers(arr):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        current = arr[left] + arr[right]\n        if current == target:\n            return [left, right]\n        elif current < target:\n            left += 1\n        else:\n            right -= 1\n    return [-1, -1]` },
  { name: "Sliding Window", desc: "Maintain a window of elements and slide it across the array", code: `def sliding_window(arr, k):\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n    for i in range(k, len(arr)):\n        window_sum += arr[i] - arr[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum` },
  { name: "Binary Search", desc: "Search a sorted array by repeatedly halving the search space", code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1` },
  { name: "BFS", desc: "Explore all neighbors at the current depth before moving deeper", code: `from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)` },
  { name: "DFS", desc: "Explore as far as possible along each branch before backtracking", code: `def dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    return visited` },
  { name: "Backtracking", desc: "Try all options, undo choices that don't lead to a solution", code: `def backtrack(candidates, path, result):\n    if not candidates:\n        result.append(path[:])\n        return\n    for i in range(len(candidates)):\n        path.append(candidates[i])\n        backtrack(candidates[i+1:], path, result)\n        path.pop()` },
  { name: "Topological Sort", desc: "Linear ordering of vertices in a directed acyclic graph", code: `from collections import deque\n\ndef topological_sort(graph, in_degree):\n    queue = deque([n for n in in_degree if in_degree[n] == 0])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph[node]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n    return order` },
  { name: "Union Find", desc: "Disjoint set data structure for tracking connected components", code: `class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, x, y):\n        px, py = self.find(x), self.find(y)\n        if px == py: return\n        if self.rank[px] < self.rank[py]:\n            px, py = py, px\n        self.parent[py] = px\n        if self.rank[px] == self.rank[py]:\n            self.rank[px] += 1` },
  { name: "Monotonic Stack", desc: "Stack that maintains elements in sorted order for efficient lookups", code: `def next_greater(arr):\n    n = len(arr)\n    result = [-1] * n\n    stack = []\n    for i in range(n):\n        while stack and arr[stack[-1]] < arr[i]:\n            result[stack.pop()] = arr[i]\n        stack.append(i)\n    return result` },
  { name: "Trie", desc: "Tree-like data structure for efficient string prefix operations", code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end = True\n\n    def search(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                return False\n            node = node.children[char]\n        return node.is_end` },
];

export default function CheatSheetPage() {
  const [copied, setCopied] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <AnimateIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Cheat Sheet</h1>
          </div>
          <p className="mt-2 text-muted-foreground text-lg">
            Quick-reference templates for the most common DSA patterns — copy, paste, and adapt
          </p>
        </div>
      </AnimateIn>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((template, idx) => (
          <AnimateIn key={template.name} delay={idx * 60}>
            <ProgressiveBlur intensity="light">
              <div className="rounded-xl border border-border overflow-hidden bg-card card-interactive group">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{template.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{template.desc}</p>
                    </div>
                    <button
                      onClick={() => copyCode(template.code, idx)}
                      className="p-2 rounded-lg border border-border hover:bg-accent transition-all duration-200 btn-press shrink-0"
                      title="Copy code"
                    >
                      {copied === idx ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mx-5 mb-5 rounded-lg border border-border bg-muted/30 p-4 overflow-x-auto">
                  <pre className="text-xs leading-relaxed">
                    <code className="font-mono text-muted-foreground">{template.code}</code>
                  </pre>
                </div>
              </div>
            </ProgressiveBlur>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
