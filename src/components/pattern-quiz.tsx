"use client";

import { useState } from "react";
import { patterns } from "@/lib/data";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";

interface QuizQuestion {
  problemTitle: string;
  difficulty: string;
  correctPattern: string;
  options: string[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuiz(count: number = 10): QuizQuestion[] {
  const allProblems = patterns.flatMap((p) =>
    p.problems.map((prob) => ({
      title: prob.title,
      difficulty: prob.difficulty,
      pattern: p.name,
    }))
  );

  const shuffled = shuffleArray(allProblems).slice(0, count);
  const patternNames = [...new Set(patterns.map((p) => p.name))];

  return shuffled.map((prob) => {
    const wrongPatterns = shuffleArray(patternNames.filter((n) => n !== prob.pattern)).slice(0, 3);
    const options = shuffleArray([prob.pattern, ...wrongPatterns]);

    return {
      problemTitle: prob.title,
      difficulty: prob.difficulty,
      correctPattern: prob.pattern,
      options,
    };
  });
}

export function PatternQuiz() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>(() => generateQuiz());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ correct: boolean; pattern: string }[]>([]);
  const [showResult, setShowResult] = useState(false);

  const current = quiz[currentIndex];
  const isAnswered = selected !== null;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelected(option);
    setAnswers((prev) => [
      ...prev,
      { correct: option === current.correctPattern, pattern: current.correctPattern },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setQuiz(generateQuiz());
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
  };

  const score = answers.filter((a) => a.correct).length;

  if (showResult) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-accent-amber" />
        <h2 className="text-2xl font-mono font-bold text-text mb-2">Quiz Complete!</h2>
        <p className="text-lg font-mono text-text-muted mb-1">
          {score}/{quiz.length} correct
        </p>
        <p className="text-sm font-mono text-text-muted mb-6">
          {Math.round((score / quiz.length) * 100)}% accuracy
        </p>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {answers.map((a, i) => (
            <div
              key={i}
              className={`h-8 rounded flex items-center justify-center text-xs font-mono ${
                a.correct ? "bg-accent-teal/20 text-accent-teal" : "bg-accent-rose/20 text-accent-rose"
              }`}
            >
              {a.correct ? "✓" : "✗"}
            </div>
          ))}
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent-amber/40 bg-accent-amber/10 text-accent-amber font-mono text-sm hover:bg-accent-amber/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono text-text-muted">
          Question {currentIndex + 1}/{quiz.length}
        </span>
        <span className="text-xs font-mono text-accent-amber">
          Score: {score}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-bg mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-accent-amber transition-all"
          style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }}
        />
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface mb-6">
        <p className="text-xs font-mono text-text-muted mb-1">{current.difficulty}</p>
        <h3 className="text-lg font-mono font-bold text-text">{current.problemTitle}</h3>
        <p className="text-sm font-mono text-text-muted mt-2">Which pattern applies?</p>
      </div>

      <div className="space-y-2 mb-6">
        {current.options.map((option) => {
          const isSelected = selected === option;
          const isCorrectOption = option === current.correctPattern;
          const showCorrect = isAnswered && isCorrectOption;
          const showWrong = isAnswered && isSelected && !isCorrectOption;

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`w-full p-3 rounded-lg border text-left font-mono text-sm transition-all ${
                showCorrect
                  ? "border-accent-teal/40 bg-accent-teal/10 text-accent-teal"
                  : showWrong
                  ? "border-accent-rose/40 bg-accent-rose/10 text-accent-rose"
                  : isSelected
                  ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber"
                  : "border-border bg-surface text-text hover:border-border/80"
              }`}
            >
              <div className="flex items-center gap-2">
                {showCorrect && <CheckCircle2 className="w-4 h-4" />}
                {showWrong && <XCircle className="w-4 h-4" />}
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-2.5 rounded-lg bg-accent-amber text-bg font-mono text-sm font-semibold hover:bg-accent-amber/90 transition-colors"
        >
          {currentIndex < quiz.length - 1 ? "Next Question" : "See Results"}
        </button>
      )}
    </div>
  );
}
