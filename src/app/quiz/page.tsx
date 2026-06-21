"use client";

import { PatternQuiz } from "@/components/pattern-quiz";

export default function QuizPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-mono font-bold text-text mb-2">Pattern Recognition Quiz</h1>
        <p className="text-sm font-mono text-text-muted">
          Test your ability to identify which DSA pattern applies to a problem
        </p>
      </div>
      <PatternQuiz />
    </div>
  );
}
