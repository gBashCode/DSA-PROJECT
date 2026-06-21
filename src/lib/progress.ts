"use client";
import { useState, useCallback } from "react";
import type { Progress } from "@/lib/types";

const STORAGE_KEY = "dsa-progress";

const defaultProgress: Progress = {
  solved: [],
  bookmarked: [],
  notes: {},
};

function loadProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultProgress;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [loaded] = useState(true);

  const save = useCallback((p: Progress) => {
    setProgress(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }, []);

  const toggleSolved = useCallback(
    (id: string) => {
      const next = { ...progress };
      if (next.solved.includes(id)) {
        next.solved = next.solved.filter((x) => x !== id);
      } else {
        next.solved = [...next.solved, id];
      }
      save(next);
    },
    [progress, save]
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      const next = { ...progress };
      if (next.bookmarked.includes(id)) {
        next.bookmarked = next.bookmarked.filter((x) => x !== id);
      } else {
        next.bookmarked = [...next.bookmarked, id];
      }
      save(next);
    },
    [progress, save]
  );

  const setNote = useCallback(
    (id: string, note: string) => {
      const next = { ...progress };
      next.notes = { ...next.notes, [id]: note };
      save(next);
    },
    [progress, save]
  );

  const isSolved = useCallback(
    (id: string) => progress.solved.includes(id),
    [progress.solved]
  );

  const isBookmarked = useCallback(
    (id: string) => progress.bookmarked.includes(id),
    [progress.bookmarked]
  );

  return {
    progress,
    loaded,
    toggleSolved,
    toggleBookmark,
    setNote,
    isSolved,
    isBookmarked,
  };
}
