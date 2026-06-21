"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export interface TimerState {
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    seconds: 0,
    isRunning: false,
    isPaused: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setState({ seconds: 0, isRunning: true, isPaused: false });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ seconds: 0, isRunning: false, isPaused: false });
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => {
      if (prev.isRunning) return { ...prev, isRunning: false, isPaused: true };
      if (prev.isPaused) return { ...prev, isRunning: true, isPaused: false };
      return { seconds: 0, isRunning: true, isPaused: false };
    });
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning]);

  const formatTime = useCallback((totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    ...state,
    formatted: formatTime(state.seconds),
    start,
    pause,
    resume,
    reset,
    toggle,
  };
}

export interface DailyStats {
  date: string;
  problemsSolved: number;
  timeSpentSeconds: number;
  streak: number;
}

const STATS_KEY = "dsa-daily-stats";

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDailyStats(): DailyStats[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveDailyStats(stats: DailyStats[]) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateTodayStats(problemSolved: boolean, timeSeconds: number) {
  const stats = getDailyStats();
  const today = getTodayKey();
  const existing = stats.find((s) => s.date === today);

  if (existing) {
    existing.timeSpentSeconds += timeSeconds;
    if (problemSolved) existing.problemsSolved += 1;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];
    const prevStreak = stats.find((s) => s.date === yesterdayKey)?.streak || 0;

    stats.push({
      date: today,
      problemsSolved: problemSolved ? 1 : 0,
      timeSpentSeconds: timeSeconds,
      streak: prevStreak + 1,
    });
  }

  saveDailyStats(stats);
}

export function getStreak(): number {
  const stats = getDailyStats();
  if (stats.length === 0) return 0;
  const sorted = [...stats].sort((a, b) => b.date.localeCompare(a.date));
  return sorted[0].streak;
}

export function getWeeklyStats(): { day: string; problems: number; minutes: number }[] {
  const stats = getDailyStats();
  const result = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayStats = stats.find((s) => s.date === key);
    result.push({
      day: days[d.getDay()],
      problems: dayStats?.problemsSolved || 0,
      minutes: Math.round((dayStats?.timeSpentSeconds || 0) / 60),
    });
  }

  return result;
}
