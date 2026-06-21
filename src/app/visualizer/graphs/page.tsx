"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

type TraversalType = "bfs" | "dfs";

interface GraphData {
  nodes: { id: string; x: number; y: number }[];
  adjacency: Record<string, string[]>;
}

const PRESET_GRAPH: GraphData = {
  nodes: [
    { id: "A", x: 100, y: 50 },
    { id: "B", x: 220, y: 50 },
    { id: "C", x: 340, y: 50 },
    { id: "D", x: 60, y: 150 },
    { id: "E", x: 180, y: 150 },
    { id: "F", x: 300, y: 150 },
    { id: "G", x: 140, y: 240 },
    { id: "H", x: 260, y: 240 },
  ],
  adjacency: {
    A: ["B", "D"],
    B: ["A", "C", "E"],
    C: ["B", "F"],
    D: ["A", "E", "G"],
    E: ["B", "D", "F", "H"],
    F: ["C", "E", "H"],
    G: ["D", "H"],
    H: ["E", "G"],
  },
};

function bfsSteps(adj: Record<string, string[]>, start: string): { order: string[]; frontier: string[]; visited: string[] }[] {
  const steps: { order: string[]; frontier: string[]; visited: string[] }[] = [];
  const queue = [start];
  const visited = new Set<string>([start]);
  const order: string[] = [];

  steps.push({ order: [...order], frontier: [...queue], visited: [] });

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    steps.push({ order: [...order], frontier: [...queue], visited: [...visited] });

    for (const neighbor of (adj[node] ?? []).sort()) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
    steps.push({ order: [...order], frontier: [...queue], visited: [...visited] });
  }

  return steps;
}

function dfsSteps(adj: Record<string, string[]>, start: string): { order: string[]; frontier: string[]; visited: string[] }[] {
  const steps: { order: string[]; frontier: string[]; visited: string[] }[] = [];
  const stack = [start];
  const visited = new Set<string>();
  const order: string[] = [];

  steps.push({ order: [...order], frontier: [...stack], visited: [] });

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    steps.push({ order: [...order], frontier: [...stack], visited: [...visited] });

    const neighbors = [...(adj[node] ?? [])].sort().reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
    steps.push({ order: [...order], frontier: [...stack], visited: [...visited] });
  }

  return steps;
}

export default function GraphsVisualizerPage() {
  const [traversalType, setTraversalType] = useState<TraversalType>("bfs");
  const [startNode, setStartNode] = useState("A");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const graph = PRESET_GRAPH;

  const traversalSteps = useMemo(() => {
    const gen = traversalType === "bfs" ? bfsSteps : dfsSteps;
    return gen(graph.adjacency, startNode);
  }, [traversalType, startNode, graph.adjacency]);

  const currentStep = traversalSteps[currentIdx] ?? { order: [], frontier: [], visited: [] };

  const handleTraversalChange = useCallback((type: TraversalType) => {
    setTraversalType(type);
    setCurrentIdx(0);
    setIsPlaying(false);
  }, []);

  const handleStartNodeChange = useCallback((node: string) => {
    setStartNode(node);
    setCurrentIdx(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIdx((prev) => {
          if (prev >= traversalSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, traversalSteps.length]);

  const togglePlay = () => {
    if (currentIdx >= traversalSteps.length - 1) setCurrentIdx(0);
    setIsPlaying((p) => !p);
  };

  const stepForward = () => {
    if (currentIdx < traversalSteps.length - 1) setCurrentIdx((p) => p + 1);
    else setIsPlaying(false);
  };

  const stepBack = () => setCurrentIdx((p) => Math.max(0, p - 1));

  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
  };

  const getNodeColor = (id: string) => {
    if (id === currentStep.order[currentStep.order.length - 1]) return "var(--accent-amber)";
    if (currentStep.order.includes(id)) return "var(--accent-teal)";
    if (currentStep.frontier.includes(id)) return "var(--accent-amber)";
    return "var(--border-color)";
  };

  const getTextColor = (id: string) => {
    if (currentStep.order.includes(id) || currentStep.frontier.includes(id)) return "var(--bg)";
    return "var(--text-color)";
  };

  const getEdgeColor = (from: string, to: string) => {
    const order = currentStep.order;
    const fromIdx = order.indexOf(from);
    const toIdx = order.indexOf(to);
    if (fromIdx !== -1 && toIdx !== -1) return "var(--accent-teal)";
    return "var(--border-color)";
  };

  // Get unique edges
  const edgeSet = new Set<string>();
  const edges: { from: string; to: string }[] = [];
  for (const [node, neighbors] of Object.entries(graph.adjacency)) {
    for (const neighbor of neighbors) {
      const key = [node, neighbor].sort().join("-");
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({ from: node, to: neighbor });
      }
    }
  }

  const descriptions: Record<TraversalType, string> = {
    bfs: "Breadth-First Search explores all neighbors at the current depth before moving to nodes at the next depth level. It uses a queue (FIFO) to track the frontier. BFS finds the shortest path in unweighted graphs.",
    dfs: "Depth-First Search explores as far as possible along each branch before backtracking. It uses a stack (LIFO) to track the frontier. DFS is useful for topological sorting, cycle detection, and maze solving.",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top control bar */}
      <div className="border-b border-border bg-surface px-4 py-2 flex flex-wrap items-center gap-3 text-sm">
        {/* BFS/DFS toggle */}
        <div className="flex gap-1">
          {(["bfs", "dfs"] as TraversalType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTraversalChange(type)}
              className={`px-3 py-1 rounded font-mono text-xs font-bold uppercase transition-colors ${
                traversalType === type
                  ? "bg-accent-amber text-bg"
                  : "text-text-muted hover:text-text hover:bg-border/40"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Start node */}
        <div className="flex items-center gap-1">
          <span className="text-text-muted font-mono text-xs">start:</span>
          <select
            value={startNode}
            onChange={(e) => handleStartNodeChange(e.target.value)}
            className="bg-bg border border-border rounded px-2 py-1 font-mono text-xs text-text focus:outline-none focus:border-accent-amber"
          >
            {graph.nodes.map((n) => (
              <option key={n.id} value={n.id}>{n.id}</option>
            ))}
          </select>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Playback */}
        <div className="flex items-center gap-1">
          <button onClick={stepBack} className="p-1.5 rounded hover:bg-border/40 text-text-muted hover:text-text transition-colors">
            <SkipBack className="h-3.5 w-3.5" />
          </button>
          <button onClick={togglePlay} className="p-1.5 rounded bg-accent-amber text-bg hover:bg-accent-amber/80 transition-colors">
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button onClick={stepForward} className="p-1.5 rounded hover:bg-border/40 text-text-muted hover:text-text transition-colors">
            <SkipForward className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleReset} className="p-1.5 rounded hover:bg-border/40 text-text-muted hover:text-text transition-colors">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="ml-auto font-mono text-xs text-text-muted">
          step {currentIdx + 1}/{traversalSteps.length}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Graph visualization */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto min-w-0">
          <svg width={400} height={290} viewBox="0 0 400 290" className="max-w-full">
            {edges.map((e, i) => {
              const from = graph.nodes.find((n) => n.id === e.from)!;
              const to = graph.nodes.find((n) => n.id === e.to)!;
              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={getEdgeColor(e.from, e.to)}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              );
            })}
            {graph.nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={getNodeColor(node.id)}
                  stroke={node.id === startNode ? "var(--accent-amber)" : "none"}
                  strokeWidth={node.id === startNode ? "3" : "0"}
                  className="transition-all duration-200"
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={getTextColor(node.id)}
                  fontSize="13"
                  fontFamily="var(--font-mono), monospace"
                  fontWeight="bold"
                >
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Side panel */}
        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-surface overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Traversal order */}
            <div className="rounded-lg border border-border bg-bg p-3">
              <h4 className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Traversal Order</h4>
              <div className="flex flex-wrap gap-1 font-mono text-xs min-h-[24px]">
                {currentStep.order.length === 0 ? (
                  <span className="text-text-muted/50">Press play or step forward</span>
                ) : (
                  currentStep.order.map((v, i) => (
                    <span
                      key={`${i}-${v}`}
                      className={`px-1.5 py-0.5 rounded ${
                        i === currentStep.order.length - 1
                          ? "bg-accent-amber text-bg"
                          : "bg-accent-teal/20 text-accent-teal"
                      }`}
                    >
                      {v}
                    </span>
                  ))
                )}
              </div>
              {currentStep.order.length > 0 && (
                <div className="mt-2 font-mono text-xs text-text-muted">
                  [{currentStep.order.join(" → ")}]
                </div>
              )}
            </div>

            {/* Frontier */}
            <div className="rounded-lg border border-border bg-bg p-3">
              <h4 className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Frontier</h4>
              <div className="flex flex-wrap gap-1 font-mono text-xs min-h-[20px]">
                {currentStep.frontier.length === 0 ? (
                  <span className="text-text-muted/50">Empty</span>
                ) : (
                  currentStep.frontier.map((v) => (
                    <span key={v} className="px-1.5 py-0.5 rounded bg-accent-amber/20 text-accent-amber">
                      {v}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Adjacency list */}
            <div className="rounded-lg border border-border bg-bg p-3">
              <h4 className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Adjacency List</h4>
              <div className="font-mono text-xs text-text-muted space-y-0.5">
                {Object.entries(graph.adjacency).map(([node, neighbors]) => (
                  <div key={node}>
                    <span className="text-accent-amber">{node}</span>
                    <span className="text-text-muted"> → </span>
                    <span>{neighbors.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's happening */}
            <div className="rounded-lg border border-border bg-bg">
              <button
                onClick={() => setShowInfo((p) => !p)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-border/20 transition-colors rounded-lg"
              >
                <span>What&apos;s happening</span>
                {showInfo ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
              </button>
              {showInfo && (
                <div className="px-3 pb-3 text-xs text-text-muted leading-relaxed border-t border-border pt-3">
                  {descriptions[traversalType]}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="rounded-lg border border-border bg-bg p-3 text-xs space-y-1.5">
              <h4 className="font-bold mb-2">Legend</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent-amber)" }} />
                <span className="text-text-muted">Current / Frontier</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent-teal)" }} />
                <span className="text-text-muted">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--border-color)" }} />
                <span className="text-text-muted">Untouched</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
