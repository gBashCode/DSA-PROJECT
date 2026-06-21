"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, GitBranch, Network, Search, Link2 } from "lucide-react";

const cards = [
  {
    href: "/visualizer/sorting",
    title: "Sorting",
    desc: "Watch Bubble, Merge, Quick, and more sort an array step-by-step.",
    icon: BarChart3,
    color: "accent-amber",
    preview: (
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {[35, 22, 48, 15, 40, 28, 52, 18, 42, 30, 55, 25, 38, 12, 45].map((h, i) => (
          <rect key={i} x={i * 13 + 2} y={60 - h} width={10} height={h} rx={1} fill={i < 5 ? "var(--accent-teal)" : i === 6 ? "var(--accent-amber)" : "var(--border-color)"} />
        ))}
      </svg>
    ),
  },
  {
    href: "/visualizer/trees",
    title: "Trees",
    desc: "Build a BST and traverse with Inorder, Preorder, Postorder, and Level-order.",
    icon: GitBranch,
    color: "accent-teal",
    preview: (
      <svg viewBox="0 0 200 80" className="w-full h-full">
        <line x1="100" y1="15" x2="55" y2="40" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="100" y1="15" x2="145" y2="40" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="55" y1="40" x2="35" y2="65" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="55" y1="40" x2="75" y2="65" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="145" y1="40" x2="125" y2="65" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="145" y1="40" x2="165" y2="65" stroke="var(--border-color)" strokeWidth="2" />
        <circle cx="100" cy="15" r="8" fill="var(--accent-amber)" />
        <circle cx="55" cy="40" r="8" fill="var(--accent-teal)" />
        <circle cx="145" cy="40" r="8" fill="var(--accent-teal)" />
        <circle cx="35" cy="65" r="8" fill="var(--border-color)" />
        <circle cx="75" cy="65" r="8" fill="var(--border-color)" />
        <circle cx="125" cy="65" r="8" fill="var(--border-color)" />
        <circle cx="165" cy="65" r="8" fill="var(--border-color)" />
      </svg>
    ),
  },
  {
    href: "/visualizer/graphs",
    title: "Graphs",
    desc: "Visualize BFS and DFS traversals on a graph with animated nodes.",
    icon: Network,
    color: "accent-rose",
    preview: (
      <svg viewBox="0 0 200 80" className="w-full h-full">
        <line x1="40" y1="20" x2="100" y2="20" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="100" y1="20" x2="160" y2="20" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="40" y1="20" x2="70" y2="60" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="60" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="160" y1="20" x2="130" y2="60" stroke="var(--border-color)" strokeWidth="2" />
        <line x1="70" y1="60" x2="130" y2="60" stroke="var(--border-color)" strokeWidth="2" />
        <circle cx="40" cy="20" r="8" fill="var(--accent-amber)" />
        <circle cx="100" cy="20" r="8" fill="var(--accent-teal)" />
        <circle cx="160" cy="20" r="8" fill="var(--accent-teal)" />
        <circle cx="70" cy="60" r="8" fill="var(--border-color)" />
        <circle cx="100" cy="60" r="8" fill="var(--border-color)" />
        <circle cx="130" cy="60" r="8" fill="var(--border-color)" />
      </svg>
    ),
  },
  {
    href: "/visualizer/binary-search",
    title: "Binary Search",
    desc: "Watch binary search find a target in a sorted array step-by-step.",
    icon: Search,
    color: "accent-violet",
    preview: (
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v, i) => (
          <g key={i}>
            <rect x={i * 22 + 2} y={10} width={18} height={40} rx={3} fill={i === 4 ? "var(--accent-amber)" : i >= 2 && i <= 6 ? "var(--accent-violet)" : "var(--border-color)"} />
            <text x={i * 22 + 11} y={35} textAnchor="middle" fill="var(--text-color)" fontSize="10" fontFamily="monospace">{v}</text>
          </g>
        ))}
      </svg>
    ),
  },
  {
    href: "/visualizer/linked-list",
    title: "Linked List",
    desc: "Visualize insert, delete, search, reverse, and traverse operations.",
    icon: Link2,
    color: "accent-amber",
    preview: (
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {[25, 50, 75, 100, 125, 150, 175].map((x, i) => (
          <g key={i}>
            <rect x={x - 12} y={20} width={24} height={24} rx={4} fill={i === 2 ? "var(--accent-amber)" : "var(--border-color)"} />
            {i < 6 && <line x1={x + 12} y1={32} x2={x + 38} y2={32} stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrow)" />}
          </g>
        ))}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="var(--text-muted)" />
          </marker>
        </defs>
      </svg>
    ),
  },
];

export default function VisualizerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="font-mono text-accent-amber">&gt;</span> Visualizer
        </h1>
        <p className="mt-2 text-text-muted">
          Interactive algorithm visualizations. Pick a category below.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className="group rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:border-accent-amber/40 hover:shadow-lg hover:shadow-accent-amber/5 cursor-pointer h-full">
              <div className="h-28 bg-bg p-4 flex items-center justify-center border-b border-border">
                {card.preview}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className={`h-4 w-4 text-${card.color}`} />
                  <h2 className="font-bold text-lg">{card.title}</h2>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{card.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-accent-amber opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
