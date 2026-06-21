"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  visited: boolean;
  current: boolean;
  inQueue: boolean;
  neighbors: number[];
}

function generateGraph(): Node[] {
  const nodes: Node[] = [];
  const size = 12;
  const cols = 4;
  const spacing = 100;

  for (let i = 0; i < size; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    nodes.push({
      id: i,
      x: col * spacing + 80,
      y: row * spacing + 80,
      visited: false,
      current: false,
      inQueue: false,
      neighbors: [],
    });
  }

  const edges: [number, number][] = [
    [0, 1], [0, 4], [1, 2], [1, 5], [2, 3], [2, 6],
    [4, 5], [4, 8], [5, 6], [5, 9], [6, 7], [6, 10],
    [7, 11], [8, 9], [9, 10], [10, 11],
  ];

  edges.forEach(([a, b]) => {
    nodes[a].neighbors.push(b);
    nodes[b].neighbors.push(a);
  });

  return nodes;
}

type Algorithm = "bfs" | "dfs";

export default function GraphVisualizer() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("bfs");
  const [nodes, setNodes] = useState<Node[]>(generateGraph);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [step, setStep] = useState(0);
  const [visitedOrder, setVisitedOrder] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setNodes(generateGraph());
    setVisitedOrder([]);
    setStep(0);
    setIsRunning(false);
  }, []);

  const bfs = useCallback(async (startNode: number = 0) => {
    const graph = nodes.map(n => ({ ...n }));
    const queue: number[] = [startNode];
    const visited = new Set<number>();
    const order: number[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      order.push(current);

      graph[current].visited = true;
      graph[current].current = true;
      graph[current].inQueue = false;
      setNodes([...graph]);
      setVisitedOrder([...order]);
      setStep(order.length);
      await new Promise(r => setTimeout(r, speed));

      for (const neighbor of graph[current].neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          graph[neighbor].inQueue = true;
          queue.push(neighbor);
        }
      }
      graph[current].current = false;
      setNodes([...graph]);
    }
  }, [nodes, speed]);

  const dfs = useCallback(async (startNode: number = 0) => {
    const graph = nodes.map(n => ({ ...n }));
    const visited = new Set<number>();
    const order: number[] = [];

    const dfsVisit = async (nodeId: number): Promise<void> => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      order.push(nodeId);

      graph[nodeId].visited = true;
      graph[nodeId].current = true;
      setNodes([...graph]);
      setVisitedOrder([...order]);
      setStep(order.length);
      await new Promise(r => setTimeout(r, speed));

      for (const neighbor of graph[nodeId].neighbors) {
        if (!visited.has(neighbor)) {
          graph[neighbor].inQueue = true;
          setNodes([...graph]);
          await dfsVisit(neighbor);
        }
      }
      graph[nodeId].current = false;
      setNodes([...graph]);
    };

    await dfsVisit(startNode);
  }, [nodes, speed]);

  const start = useCallback(() => {
    reset();
    setIsRunning(true);
    setTimeout(() => {
      if (algorithm === "bfs") bfs();
      else dfs();
    }, 100);
  }, [algorithm, bfs, dfs, reset]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-text">Graph Visualization</h1>
          <p className="text-sm font-mono text-text-muted">BFS and DFS traversal algorithms</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text text-sm font-mono"
          >
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
          </select>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text text-sm font-mono"
          >
            <option value={500}>Slow</option>
            <option value={300}>Medium</option>
            <option value={100}>Fast</option>
          </select>
          <button
            onClick={start}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-lg bg-accent-amber text-bg text-sm font-mono font-bold disabled:opacity-50"
          >
            Start
          </button>
          <button
            onClick={reset}
            className="px-4 py-1.5 rounded-lg border border-border bg-surface text-text text-sm font-mono"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 mb-6">
        <svg width="480" height="350" viewBox="0 0 480 350">
          {nodes.map((node) =>
            node.neighbors.map((neighborId) => {
              const neighbor = nodes[neighborId];
              return (
                <line
                  key={`${node.id}-${neighborId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={neighbor.x}
                  y2={neighbor.y}
                  stroke="#232B3D"
                  strokeWidth="2"
                />
              );
            })
          )}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="24"
                fill={
                  node.current
                    ? "#F2A33C"
                    : node.visited
                    ? "#3FBFAD"
                    : node.inQueue
                    ? "#A78BFA"
                    : "#131A27"
                }
                stroke={
                  node.current
                    ? "#F2A33C"
                    : node.visited
                    ? "#3FBFAD"
                    : node.inQueue
                    ? "#A78BFA"
                    : "#232B3D"
                }
                strokeWidth="2"
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill={node.visited || node.current ? "#0A0E16" : "#8A93A6"}
                fontSize="12"
                fontFamily="monospace"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent-amber" />
          <span className="text-xs font-mono text-text-muted">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent-teal" />
          <span className="text-xs font-mono text-text-muted">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent-violet" />
          <span className="text-xs font-mono text-text-muted">In Queue</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface">
        <h3 className="text-sm font-mono font-semibold text-text mb-2">Visit Order ({visitedOrder.length} nodes)</h3>
        <div className="flex flex-wrap gap-2">
          {visitedOrder.map((id, i) => (
            <span key={i} className="px-2 py-1 rounded bg-accent-teal/10 text-accent-teal text-xs font-mono">
              {id}
            </span>
          ))}
          {visitedOrder.length === 0 && (
            <span className="text-xs font-mono text-text-muted">Click Start to begin</span>
          )}
        </div>
      </div>
    </div>
  );
}
