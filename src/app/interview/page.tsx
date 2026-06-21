"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { problems } from "@/data/problems";
import { saveInterviewSession, getInterviewHistory, getInterviewStats, generateSessionId, type InterviewSession } from "@/lib/interview";
import { Timer, Play, Pause, RotateCcw, CheckCircle2, Circle, Trophy, BarChart3, ArrowLeft, ExternalLink, Clock, Target } from "lucide-react";

type InterviewState = "setup" | "running" | "completed";
type Difficulty = "Easy" | "Medium" | "Hard" | "Mixed";

interface InterviewProblem {
  id: string;
  title: string;
  difficulty: string;
  link: string;
  solved: boolean;
  timeSpent: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selectProblems(difficulty: Difficulty, count: number): InterviewProblem[] {
  let filtered = problems;
  if (difficulty !== "Mixed") {
    filtered = problems.filter((p) => p.difficulty === difficulty);
  }
  return shuffleArray(filtered)
    .slice(0, count)
    .map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      link: p.link,
      solved: false,
      timeSpent: 0,
    }));
}

export default function InterviewPage() {
  const [state, setState] = useState<InterviewState>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("Mixed");
  const [problemCount, setProblemCount] = useState(5);
  const [duration, setDuration] = useState(30);
  const [interviewProblems, setInterviewProblems] = useState<InterviewProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [problemStartTime, setProblemStartTime] = useState(() => Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stats = getInterviewStats();
  const history = getInterviewHistory();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startInterview = () => {
    const selected = selectProblems(difficulty, problemCount);
    setInterviewProblems(selected);
    setCurrentProblemIndex(0);
    setTimeRemaining(duration * 60);
    setIsPaused(false);
    setProblemStartTime(Date.now());
    setState("running");
  };

  const toggleSolved = (index: number) => {
    setInterviewProblems((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, solved: !p.solved, timeSpent: p.timeSpent + Math.floor((Date.now() - problemStartTime) / 1000) } : p
      )
    );
  };

  const endInterview = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const solvedCount = interviewProblems.filter((p) => p.solved).length;
    const score = Math.round((solvedCount / interviewProblems.length) * 100);

    const session: InterviewSession = {
      id: generateSessionId(),
      date: new Date().toISOString(),
      duration: duration * 60 - timeRemaining,
      totalProblems: interviewProblems.length,
      solvedProblems: solvedCount,
      problems: interviewProblems,
      score,
      difficulty,
    };

    saveInterviewSession(session);
    setState("completed");
  }, [interviewProblems, duration, timeRemaining, difficulty]);

  useEffect(() => {
    if (state !== "running" || isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, isPaused, endInterview]);

  const currentProblem = interviewProblems[currentProblemIndex];
  const solvedCount = interviewProblems.filter((p) => p.solved).length;
  const score = interviewProblems.length > 0 ? Math.round((solvedCount / interviewProblems.length) * 100) : 0;

  if (state === "setup") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-accent-amber/10">
            <Timer className="w-6 h-6 text-accent-amber" />
          </div>
          <div>
            <h1 className="text-3xl font-mono font-bold text-text">Mock Interview</h1>
            <p className="text-sm font-mono text-text-muted">Practice under timed conditions</p>
          </div>
        </div>

        {stats.totalSessions > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-8">
            <div className="p-3 rounded-xl border border-border bg-surface text-center">
              <p className="text-2xl font-mono font-bold text-accent-amber">{stats.totalSessions}</p>
              <p className="text-[10px] font-mono text-text-muted">Sessions</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-surface text-center">
              <p className="text-2xl font-mono font-bold text-accent-teal">{stats.avgScore}%</p>
              <p className="text-[10px] font-mono text-text-muted">Avg Score</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-surface text-center">
              <p className="text-2xl font-mono font-bold text-accent-rose">{stats.bestScore}%</p>
              <p className="text-[10px] font-mono text-text-muted">Best Score</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-surface text-center">
              <p className="text-2xl font-mono font-bold text-accent-violet">{stats.totalSolved}</p>
              <p className="text-[10px] font-mono text-text-muted">Total Solved</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono font-semibold text-text-muted mb-2 uppercase tracking-wider">Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {(["Easy", "Medium", "Hard", "Mixed"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2 rounded-lg border font-mono text-sm transition-colors ${
                    difficulty === d
                      ? d === "Easy"
                        ? "border-accent-teal/40 bg-accent-teal/10 text-accent-teal"
                        : d === "Medium"
                        ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber"
                        : d === "Hard"
                        ? "border-accent-rose/40 bg-accent-rose/10 text-accent-rose"
                        : "border-accent-violet/40 bg-accent-violet/10 text-accent-violet"
                      : "border-border bg-surface text-text-muted hover:text-text"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-text-muted mb-2 uppercase tracking-wider">Problems</label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 8, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setProblemCount(n)}
                  className={`py-2 rounded-lg border font-mono text-sm transition-colors ${
                    problemCount === n
                      ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber"
                      : "border-border bg-surface text-text-muted hover:text-text"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-text-muted mb-2 uppercase tracking-wider">Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  className={`py-2 rounded-lg border font-mono text-sm transition-colors ${
                    duration === m
                      ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber"
                      : "border-border bg-surface text-text-muted hover:text-text"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            className="w-full py-3 rounded-xl bg-accent-amber text-bg font-mono text-sm font-bold hover:bg-accent-amber/90 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Interview
          </button>
        </div>

        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-mono font-semibold text-text-muted mb-3 uppercase tracking-wider">Recent Sessions</h2>
            <div className="space-y-2">
              {history.slice(0, 5).map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      h.score >= 80 ? "bg-accent-teal/10 text-accent-teal" : h.score >= 50 ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-rose/10 text-accent-rose"
                    }`}>
                      {h.score}%
                    </div>
                    <div>
                      <p className="text-sm font-mono text-text">{h.difficulty} - {h.totalProblems} problems</p>
                      <p className="text-[10px] font-mono text-text-muted">{new Date(h.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-text">{h.solvedProblems}/{h.totalProblems} solved</p>
                    <p className="text-[10px] font-mono text-text-muted">{Math.round(h.duration / 60)}m</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (state === "completed") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-accent-amber" />
          <h1 className="text-3xl font-mono font-bold text-text mb-2">Interview Complete!</h1>
          <p className="text-lg font-mono text-text-muted">Great effort!</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-border bg-surface text-center">
            <p className={`text-3xl font-mono font-bold ${score >= 80 ? "text-accent-teal" : score >= 50 ? "text-accent-amber" : "text-accent-rose"}`}>{score}%</p>
            <p className="text-xs font-mono text-text-muted mt-1">Score</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-surface text-center">
            <p className="text-3xl font-mono font-bold text-accent-amber">{solvedCount}/{interviewProblems.length}</p>
            <p className="text-xs font-mono text-text-muted mt-1">Solved</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-surface text-center">
            <p className="text-3xl font-mono font-bold text-accent-teal">{formatTime(duration * 60 - timeRemaining)}</p>
            <p className="text-xs font-mono text-text-muted mt-1">Time</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          {interviewProblems.map((p, i) => (
            <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border ${p.solved ? "border-accent-teal/30 bg-accent-teal/5" : "border-border bg-surface"}`}>
              <div className="flex items-center gap-3">
                {p.solved ? <CheckCircle2 className="w-4 h-4 text-accent-teal" /> : <Circle className="w-4 h-4 text-text-muted" />}
                <span className="text-sm font-mono text-text">{p.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  p.difficulty === "Easy" ? "bg-accent-teal/10 text-accent-teal" : p.difficulty === "Medium" ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-rose/10 text-accent-rose"
                }`}>
                  {p.difficulty}
                </span>
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="p-1 text-text-muted hover:text-text">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setState("setup")} className="flex-1 py-2.5 rounded-xl border border-border bg-surface text-text font-mono text-sm hover:bg-bg transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" />
            New Interview
          </button>
          <Link href="/tracker" className="flex-1 py-2.5 rounded-xl bg-accent-amber text-bg font-mono text-sm font-bold hover:bg-accent-amber/90 transition-colors flex items-center justify-center gap-2">
            Go to Tracker
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={endInterview} className="p-2 rounded-lg border border-border text-text-muted hover:text-text">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-mono font-bold text-text">Mock Interview</h1>
            <p className="text-xs font-mono text-text-muted">{difficulty} &middot; {problemCount} problems</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface">
            <Target className="w-4 h-4 text-accent-amber" />
            <span className="font-mono text-sm text-text">{solvedCount}/{interviewProblems.length}</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            timeRemaining < 300 ? "border-accent-rose/40 bg-accent-rose/10" : "border-border bg-surface"
          }`}>
            <Clock className={`w-4 h-4 ${timeRemaining < 300 ? "text-accent-rose" : "text-text-muted"}`} />
            <span className={`font-mono text-sm ${timeRemaining < 300 ? "text-accent-rose" : "text-text"}`}>{formatTime(timeRemaining)}</span>
          </div>
          <button onClick={() => setIsPaused(!isPaused)} className={`p-2 rounded-lg border transition-colors ${
            isPaused ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber" : "border-border text-text-muted hover:text-text"
          }`}>
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="h-2 rounded-full bg-border mb-6 overflow-hidden">
        <div className="h-full bg-accent-amber transition-all" style={{ width: `${((currentProblemIndex + 1) / interviewProblems.length) * 100}%` }} />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {interviewProblems.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              setInterviewProblems((prev) =>
                prev.map((prob, idx) =>
                  idx === currentProblemIndex ? { ...prob, timeSpent: prob.timeSpent + Math.floor((Date.now() - problemStartTime) / 1000) } : prob
                )
              );
              setCurrentProblemIndex(i);
              setProblemStartTime(Date.now());
            }}
            className={`py-2 rounded-lg border font-mono text-xs transition-colors ${
              i === currentProblemIndex
                ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber"
                : p.solved
                ? "border-accent-teal/30 bg-accent-teal/5 text-accent-teal"
                : "border-border bg-surface text-text-muted hover:text-text"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {currentProblem && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-mono font-bold text-text">{currentProblem.title}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                currentProblem.difficulty === "Easy" ? "bg-accent-teal/10 text-accent-teal" : currentProblem.difficulty === "Medium" ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-rose/10 text-accent-rose"
              }`}>
                {currentProblem.difficulty}
              </span>
            </div>
            <a href={currentProblem.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-muted text-xs font-mono hover:text-text hover:border-accent-amber/40 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              LeetCode
            </a>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => toggleSolved(currentProblemIndex)}
              className={`flex-1 py-3 rounded-xl font-mono text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                currentProblem.solved
                  ? "bg-accent-teal/20 text-accent-teal border border-accent-teal/40"
                  : "border border-border bg-surface text-text hover:border-accent-teal/40"
              }`}
            >
              {currentProblem.solved ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              {currentProblem.solved ? "Solved" : "Mark as Solved"}
            </button>
            <button
              onClick={() => {
                if (currentProblemIndex < interviewProblems.length - 1) {
                  setInterviewProblems((prev) =>
                    prev.map((prob, idx) =>
                      idx === currentProblemIndex ? { ...prob, timeSpent: prob.timeSpent + Math.floor((Date.now() - problemStartTime) / 1000) } : prob
                    )
                  );
                  setCurrentProblemIndex((i) => i + 1);
                  setProblemStartTime(Date.now());
                }
              }}
              className="px-6 py-3 rounded-xl border border-border bg-surface text-text font-mono text-sm hover:bg-bg transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="mt-4 text-center">
            <button onClick={endInterview} className="text-xs font-mono text-text-muted hover:text-accent-rose transition-colors">
              End Interview Early
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
