"use client";

import { useState, useCallback } from "react";

interface ListNode {
  value: number;
  highlighted: boolean;
  removed: boolean;
}

function generateList(): ListNode[] {
  return Array.from({ length: 8 }, (_, i) => ({
    value: Math.floor(Math.random() * 50) + 1,
    highlighted: false,
    removed: false,
  }));
}

export default function LinkedListVisualizer() {
  const [list, setList] = useState<ListNode[]>(() => generateList());
  const [operation, setOperation] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [position, setPosition] = useState(0);

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const traverse = useCallback(async () => {
    setIsRunning(true);
    setOperation("Traversing...");
    for (let i = 0; i < list.length; i++) {
      setList(prev => prev.map((n, idx) => ({ ...n, highlighted: idx === i })));
      await delay(400);
    }
    setList(prev => prev.map(n => ({ ...n, highlighted: false })));
    setOperation("Traversal complete!");
    setIsRunning(false);
  }, [list]);

  const search = useCallback(async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setIsRunning(true);
    setOperation(`Searching for ${val}...`);
    for (let i = 0; i < list.length; i++) {
      setList(prev => prev.map((n, idx) => ({ ...n, highlighted: idx === i })));
      await delay(400);
      if (list[i].value === val) {
        setOperation(`Found ${val} at position ${i}!`);
        setList(prev => prev.map((n, idx) => ({ ...n, highlighted: idx === i, removed: false })));
        setIsRunning(false);
        return;
      }
    }
    setList(prev => prev.map(n => ({ ...n, highlighted: false })));
    setOperation(`${val} not found`);
    setIsRunning(false);
  }, [list, inputValue]);

  const insertAt = useCallback(async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const pos = Math.min(position, list.length);
    setIsRunning(true);
    setOperation(`Inserting ${val} at position ${pos}...`);

    const newList = [...list];
    for (let i = 0; i < pos; i++) {
      setList(prev => prev.map((n, idx) => ({ ...n, highlighted: idx === i })));
      await delay(300);
    }

    newList.splice(pos, 0, { value: val, highlighted: true, removed: false });
    setList(newList);
    await delay(500);
    setList(prev => prev.map(n => ({ ...n, highlighted: false })));
    setOperation(`Inserted ${val} at position ${pos}`);
    setIsRunning(false);
  }, [list, inputValue, position]);

  const deleteAt = useCallback(async () => {
    const pos = Math.min(position, list.length - 1);
    setIsRunning(true);
    setOperation(`Deleting at position ${pos}...`);

    for (let i = 0; i <= pos; i++) {
      setList(prev => prev.map((n, idx) => ({ ...n, highlighted: idx === i })));
      await delay(300);
    }

    setList(prev => prev.map((n, idx) => idx === pos ? { ...n, removed: true, highlighted: false } : n));
    await delay(500);

    setList(prev => prev.filter((_, idx) => idx !== pos));
    setOperation(`Deleted node at position ${pos}`);
    setIsRunning(false);
  }, [list, position]);

  const reverse = useCallback(async () => {
    setIsRunning(true);
    setOperation("Reversing list...");
    const reversed = [...list].reverse();
    for (let i = 0; i < reversed.length; i++) {
      setList(reversed.map((n, idx) => ({ ...n, highlighted: idx <= i })));
      await delay(300);
    }
    setList(reversed.map(n => ({ ...n, highlighted: false })));
    setOperation("List reversed!");
    setIsRunning(false);
  }, [list]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-mono font-bold text-text">Linked List</h1>
        <p className="text-sm font-mono text-text-muted">Visualize linked list operations</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max pb-2">
          <div className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text-muted text-xs font-mono">
            HEAD
          </div>
          {list.map((node, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`px-4 py-2 rounded-lg border font-mono text-sm font-bold transition-all ${
                  node.removed
                    ? "border-accent-rose/40 bg-accent-rose/10 text-accent-rose line-through"
                    : node.highlighted
                    ? "border-accent-amber bg-accent-amber text-bg"
                    : "border-border bg-bg text-text"
                }`}
              >
                {node.value}
              </div>
              {i < list.length - 1 && (
                <div className="text-text-muted">→</div>
              )}
            </div>
          ))}
          <div className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text-muted text-xs font-mono">
            NULL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-border bg-surface">
          <h3 className="text-sm font-mono font-semibold text-text mb-3">Operations</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={traverse} disabled={isRunning} className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono hover:border-accent-amber/40 disabled:opacity-50">
              Traverse
            </button>
            <button onClick={search} disabled={isRunning} className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono hover:border-accent-teal/40 disabled:opacity-50">
              Search
            </button>
            <button onClick={insertAt} disabled={isRunning} className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono hover:border-accent-amber/40 disabled:opacity-50">
              Insert
            </button>
            <button onClick={deleteAt} disabled={isRunning} className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono hover:border-accent-rose/40 disabled:opacity-50">
              Delete
            </button>
            <button onClick={reverse} disabled={isRunning} className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono hover:border-accent-violet/40 disabled:opacity-50">
              Reverse
            </button>
            <button onClick={() => setList(generateList())} disabled={isRunning} className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono hover:border-border/60 disabled:opacity-50">
              New List
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface">
          <h3 className="text-sm font-mono font-semibold text-text mb-3">Input</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono"
            />
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              placeholder="Position"
              className="w-20 px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {operation && (
        <div className="p-4 rounded-xl border border-accent-amber/30 bg-accent-amber/5">
          <p className="text-sm font-mono text-accent-amber">{operation}</p>
        </div>
      )}
    </div>
  );
}
