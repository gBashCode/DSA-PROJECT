"use client";

import { X } from "lucide-react";
import { DEFAULT_SHORTCUTS } from "@/lib/use-keyboard-shortcuts";

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono font-bold text-text">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {DEFAULT_SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-text-muted">{s.description}</span>
              <kbd className="px-2 py-1 rounded bg-bg border border-border text-xs font-mono text-text">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
