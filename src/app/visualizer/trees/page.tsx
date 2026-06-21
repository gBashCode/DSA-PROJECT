"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Play, Pause, SkipForward, RotateCcw } from "lucide-react";

type TraversalMode = "inorder" | "preorder" | "postorder" | "levelorder";

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface LayoutNode {
  node: TreeNode;
  x: number;
  y: number;
  id: number;
}

function insertBST(root: TreeNode | null, val: number): TreeNode {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}

function buildBST(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of values) root = insertBST(root, v);
  return root;
}

function layoutTree(root: TreeNode | null): LayoutNode[] {
  if (!root) return [];
  const nodes: LayoutNode[] = [];
  let id = 0;

  function getDepth(n: TreeNode | null): number {
    if (!n) return 0;
    return 1 + Math.max(getDepth(n.left), getDepth(n.right));
  }

  const depth = getDepth(root);
  const svgW = Math.max(depth * 90, 300);

  function walk(node: TreeNode | null, x: number, y: number, spread: number) {
    if (!node) return;
    const nodeId = id++;
    nodes.push({ node, x, y, id: nodeId });
    walk(node.left, x - spread, y + 60, spread * 0.55);
    walk(node.right, x + spread, y + 60, spread * 0.55);
  }

  walk(root, svgW / 2, 35, svgW * 0.28);
  return nodes;
}

function getEdges(nodes: LayoutNode[]): { from: LayoutNode; to: LayoutNode }[] {
  const edges: { from: LayoutNode; to: LayoutNode }[] = [];
  const map = new Map<number, LayoutNode>();
  for (const n of nodes) map.set(n.node.val, n);

  for (const n of nodes) {
    if (n.node.left) {
      const child = map.get(n.node.left.val);
      if (child) edges.push({ from: n, to: child });
    }
    if (n.node.right) {
      const child = map.get(n.node.right.val);
      if (child) edges.push({ from: n, to: child });
    }
  }
  return edges;
}

function* traverseInorder(node: TreeNode | null): Generator<number> {
  if (!node) return;
  yield* traverseInorder(node.left);
  yield node.val;
  yield* traverseInorder(node.right);
}

function* traversePreorder(node: TreeNode | null): Generator<number> {
  if (!node) return;
  yield node.val;
  yield* traversePreorder(node.left);
  yield* traversePreorder(node.right);
}

function* traversePostorder(node: TreeNode | null): Generator<number> {
  if (!node) return;
  yield* traversePostorder(node.left);
  yield* traversePostorder(node.right);
  yield node.val;
}

function* traverseLevelorder(root: TreeNode | null): Generator<number> {
  if (!root) return;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    yield node.val;
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}

const TRAVERSAL_FNS: Record<TraversalMode, (root: TreeNode | null) => Generator<number>> = {
  inorder: traverseInorder,
  preorder: traversePreorder,
  postorder: traversePostorder,
  levelorder: traverseLevelorder,
};

export default function TreesVisualizerPage() {
  const [values, setValues] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);
  const [inputVal, setInputVal] = useState("");
  const [traversalMode, setTraversalMode] = useState<TraversalMode>("inorder");
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set());
  const [currentVal, setCurrentVal] = useState<number | null>(null);
  const [traversalSeq, setTraversalSeq] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const traversalRef = useRef<Generator<number> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const root = buildBST(values);
  const layoutNodes = layoutTree(root);
  const edges = getEdges(layoutNodes);

  const svgW = layoutNodes.length > 0
    ? Math.max(...layoutNodes.map((n) => n.x)) + 60
    : 300;
  const svgH = layoutNodes.length > 0
    ? Math.max(...layoutNodes.map((n) => n.y)) + 50
    : 200;

  const addValue = () => {
    const v = parseInt(inputVal.trim(), 10);
    if (!isNaN(v) && v >= 0 && v <= 999 && !values.includes(v)) {
      setValues((prev) => [...prev, v]);
      setInputVal("");
      resetTraversal();
    }
  };

  const resetTraversal = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    traversalRef.current = null;
    setVisitedSet(new Set());
    setCurrentVal(null);
    setTraversalSeq([]);
  };

  const handleReset = () => {
    setValues([]);
    resetTraversal();
  };

  const startTraversal = useCallback(() => {
    resetTraversal();
    const gen = TRAVERSAL_FNS[traversalMode](root);
    traversalRef.current = gen;
  }, [traversalMode, root]);

  const stepForward = useCallback(() => {
    if (!traversalRef.current) {
      startTraversal();
    }
    const gen = traversalRef.current!;
    const result = gen.next();
    if (!result.done) {
      const val = result.value;
      setCurrentVal(val);
      setVisitedSet((prev) => new Set([...prev, val]));
      setTraversalSeq((prev) => [...prev, val]);
    } else {
      setIsPlaying(false);
    }
  }, [startTraversal]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(stepForward, 400);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stepForward]);

  const togglePlay = () => {
    if (!traversalRef.current) startTraversal();
    setIsPlaying((p) => !p);
  };

  const getNodeColor = (val: number) => {
    if (val === currentVal) return "var(--accent-amber)";
    if (visitedSet.has(val)) return "var(--accent-teal)";
    return "var(--border-color)";
  };

  const traversalDescriptions: Record<TraversalMode, string> = {
    inorder: "Visit left subtree, then current node, then right subtree. For BSTs, this produces values in sorted ascending order.",
    preorder: "Visit current node first, then traverse left subtree, then right subtree. Useful for creating a copy of the tree.",
    postorder: "Traverse left subtree, then right subtree, then visit current node. Useful for deleting a tree or evaluating expressions.",
    levelorder: "Visit nodes level by level from left to right using a queue. Also known as Breadth-First Search (BFS).",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top control bar */}
      <div className="border-b border-border bg-surface px-4 py-2 flex flex-wrap items-center gap-3 text-sm">
        {/* Input */}
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={999}
            placeholder="value"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addValue()}
            className="w-20 bg-bg border border-border rounded px-2 py-1 font-mono text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent-amber"
          />
          <button
            onClick={addValue}
            className="px-2 py-1 rounded bg-accent-amber text-bg text-xs font-semibold hover:bg-accent-amber/80 transition-colors"
          >
            Insert
          </button>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Traversal mode */}
        <div className="flex gap-1">
          {(["inorder", "preorder", "postorder", "levelorder"] as TraversalMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => { setTraversalMode(mode); resetTraversal(); }}
              className={`px-2 py-1 rounded font-mono text-xs transition-colors ${
                traversalMode === mode
                  ? "bg-accent-amber text-bg"
                  : "text-text-muted hover:text-text hover:bg-border/40"
              }`}
            >
              {mode.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Playback */}
        <div className="flex items-center gap-1">
          <button onClick={togglePlay} className="p-1.5 rounded bg-accent-amber text-bg hover:bg-accent-amber/80 transition-colors">
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button onClick={stepForward} className="p-1.5 rounded hover:bg-border/40 text-text-muted hover:text-text transition-colors">
            <SkipForward className="h-3.5 w-3.5" />
          </button>
          <button onClick={resetTraversal} className="p-1.5 rounded hover:bg-border/40 text-text-muted hover:text-text transition-colors">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-border" />

        <button onClick={handleReset} className="px-2 py-1 rounded text-accent-danger text-xs hover:bg-accent-danger/10 transition-colors">
          Clear Tree
        </button>

        <div className="ml-auto font-mono text-xs text-text-muted">
          {values.length} nodes
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Tree visualization */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto min-w-0">
          {layoutNodes.length === 0 ? (
            <div className="text-text-muted text-sm">Insert values to build the tree</div>
          ) : (
            <svg
              width={svgW}
              height={svgH}
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="max-w-full"
            >
              {edges.map((e, i) => (
                <line
                  key={i}
                  x1={e.from.x}
                  y1={e.from.y}
                  x2={e.to.x}
                  y2={e.to.y}
                  stroke="var(--border-color)"
                  strokeWidth="2"
                />
              ))}
              {layoutNodes.map((n) => (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="18"
                    fill={getNodeColor(n.node.val)}
                    className="transition-all duration-200"
                  />
                  <text
                    x={n.x}
                    y={n.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={n.node.val === currentVal || visitedSet.has(n.node.val) ? "var(--bg)" : "var(--text-color)"}
                    fontSize="11"
                    fontFamily="var(--font-mono), monospace"
                    fontWeight="bold"
                  >
                    {n.node.val}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>

        {/* Side panel */}
        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-surface overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Traversal sequence */}
            <div className="rounded-lg border border-border bg-bg p-3">
              <h4 className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Traversal Sequence</h4>
              <div className="flex flex-wrap gap-1 font-mono text-xs min-h-[24px]">
                {traversalSeq.length === 0 ? (
                  <span className="text-text-muted/50">Press play or step forward</span>
                ) : (
                  traversalSeq.map((v, i) => (
                    <span
                      key={`${i}-${v}`}
                      className={`px-1.5 py-0.5 rounded ${
                        v === currentVal
                          ? "bg-accent-amber text-bg"
                          : "bg-border/40 text-text-muted"
                      }`}
                    >
                      {v}
                    </span>
                  ))
                )}
              </div>
              {traversalSeq.length > 0 && (
                <div className="mt-2 font-mono text-xs text-text-muted">
                  [{traversalSeq.join(", ")}]
                </div>
              )}
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
                  {traversalDescriptions[traversalMode]}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="rounded-lg border border-border bg-bg p-3 text-xs space-y-1.5">
              <h4 className="font-bold mb-2">Legend</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent-amber)" }} />
                <span className="text-text-muted">Current node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent-teal)" }} />
                <span className="text-text-muted">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--border-color)" }} />
                <span className="text-text-muted">Unvisited</span>
              </div>
            </div>

            {/* Current values */}
            <div className="rounded-lg border border-border bg-bg p-3">
              <h4 className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Tree Values</h4>
              <div className="font-mono text-xs text-text-muted">
                [{values.sort((a, b) => a - b).join(", ")}]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
