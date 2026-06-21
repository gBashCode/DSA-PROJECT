"use client";

import { useState, useCallback } from "react";
import { ideProblems, type IDEProblem } from "@/data/problems-with-tests";
import { Play, CheckCircle2, XCircle, ChevronDown, ChevronRight, Lightbulb, Terminal, Code, RotateCcw, Send } from "lucide-react";

type Language = "javascript" | "python";

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

function executeCode(code: string, input: string, language: Language): { output: string; error?: string } {
  try {
    if (language === "javascript") {
      const fn = new Function(`${code}\nreturn typeof twoSum === 'function' ? twoSum : typeof reverseString === 'function' ? reverseString : typeof maxSubArray === 'function' ? maxSubArray : typeof isValid === 'function' ? isValid : typeof mergeSorted === 'function' ? mergeSorted : typeof fibonacci === 'function' ? fibonacci : typeof search === 'function' ? search : typeof numIslands === 'function' ? numIslands : typeof longestPalindrome === 'function' ? longestPalindrome : typeof coinChange === 'function' ? coinChange : null;`);
      const func = fn();
      if (!func) return { output: "", error: "No function found" };

      const args = JSON.parse(`[${input}]`);
      const result = func(...args);
      return { output: JSON.stringify(result) };
    }
    return { output: "Python execution not supported in browser" };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export default function IDEPage() {
  const [selectedProblem, setSelectedProblem] = useState<IDEProblem | null>(null);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showTestCases, setShowTestCases] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">("description");
  const [submissions, setSubmissions] = useState<{ problem: string; passed: boolean; date: string }[]>([]);

  const selectProblem = (problem: IDEProblem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode[language] || problem.starterCode.javascript);
    setTestResults([]);
  };

  const runTests = useCallback(() => {
    if (!selectedProblem) return;
    setIsRunning(true);
    setTestResults([]);

    const results: TestResult[] = [];

    selectedProblem.testCases.forEach((tc) => {
      const { output, error } = executeCode(code, tc.input, language);
      results.push({
        passed: error ? false : output === tc.expected,
        input: tc.input,
        expected: tc.expected,
        actual: error ? `Error: ${error}` : output,
      });
    });

    setTimeout(() => {
      setTestResults(results);
      setIsRunning(false);
    }, 500);
  }, [selectedProblem, code, language]);

  const submitSolution = useCallback(() => {
    if (!selectedProblem) return;
    setIsRunning(true);

    const results: TestResult[] = [];
    selectedProblem.testCases.forEach((tc) => {
      const { output, error } = executeCode(code, tc.input, language);
      results.push({
        passed: error ? false : output === tc.expected,
        input: tc.input,
        expected: tc.expected,
        actual: error ? `Error: ${error}` : output,
      });
    });

    const allPassed = results.every((r) => r.passed);
    setTimeout(() => {
      setTestResults(results);
      setSubmissions((prev) => [
        { problem: selectedProblem.title, passed: allPassed, date: new Date().toLocaleString() },
        ...prev,
      ]);
      setIsRunning(false);
    }, 1000);
  }, [selectedProblem, code, language]);

  const passedCount = testResults.filter((r) => r.passed).length;

  return (
    <div className="h-[calc(100vh-3rem)] flex">
      <div className="w-72 border-r border-border bg-surface flex flex-col">
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-mono font-bold text-text">Problems</h2>
          <p className="text-[10px] font-mono text-text-muted">{ideProblems.length} problems</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {ideProblems.map((p) => (
            <button
              key={p.id}
              onClick={() => selectProblem(p)}
              className={`w-full text-left px-3 py-2 border-b border-border transition-colors ${
                selectedProblem?.id === p.id ? "bg-accent-amber/10" : "hover:bg-bg"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  p.difficulty === "Easy" ? "bg-accent-teal" : p.difficulty === "Medium" ? "bg-accent-amber" : "bg-accent-rose"
                }`} />
                <span className="text-xs font-mono text-text truncate">{p.title}</span>
              </div>
              <p className="text-[10px] font-mono text-text-muted ml-4">{p.topic}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedProblem ? (
          <>
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 border-r border-border flex flex-col">
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-4 py-2 text-xs font-mono transition-colors ${
                      activeTab === "description" ? "text-accent-amber border-b-2 border-accent-amber" : "text-text-muted hover:text-text"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={`px-4 py-2 text-xs font-mono transition-colors ${
                      activeTab === "submissions" ? "text-accent-amber border-b-2 border-accent-amber" : "text-text-muted hover:text-text"
                    }`}
                  >
                    Submissions
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {activeTab === "description" ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <h1 className="text-lg font-mono font-bold text-text">{selectedProblem.title}</h1>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          selectedProblem.difficulty === "Easy" ? "bg-accent-teal/10 text-accent-teal" :
                          selectedProblem.difficulty === "Medium" ? "bg-accent-amber/10 text-accent-amber" :
                          "bg-accent-rose/10 text-accent-rose"
                        }`}>
                          {selectedProblem.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-bg text-[10px] font-mono text-text-muted">
                          {selectedProblem.topic}
                        </span>
                      </div>

                      <p className="text-sm font-mono text-text-muted mb-4 whitespace-pre-wrap">{selectedProblem.description}</p>

                      <h3 className="text-xs font-mono font-semibold text-text mb-2">Examples</h3>
                      {selectedProblem.examples.map((ex, i) => (
                        <div key={i} className="mb-3 p-3 rounded-lg bg-bg border border-border">
                          <p className="text-xs font-mono text-text-muted">Input: <span className="text-text">{ex.input}</span></p>
                          <p className="text-xs font-mono text-text-muted">Output: <span className="text-accent-teal">{ex.output}</span></p>
                          {ex.explanation && <p className="text-[10px] font-mono text-text-muted mt-1">{ex.explanation}</p>}
                        </div>
                      ))}

                      <h3 className="text-xs font-mono font-semibold text-text mb-2 mt-4">Constraints</h3>
                      <ul className="list-disc list-inside text-xs font-mono text-text-muted space-y-1">
                        {selectedProblem.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>

                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-1 mt-4 text-xs font-mono text-accent-amber hover:text-accent-amber/80"
                      >
                        <Lightbulb className="w-3 h-3" />
                        {showHints ? "Hide Hints" : "Show Hints"}
                      </button>
                      {showHints && (
                        <div className="mt-2 space-y-2">
                          {selectedProblem.hints.map((h, i) => (
                            <div key={i} className="p-2 rounded-lg bg-accent-amber/5 border border-accent-amber/20 text-xs font-mono text-text">
                              Hint {i + 1}: {h}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      {submissions.length === 0 ? (
                        <p className="text-xs font-mono text-text-muted">No submissions yet</p>
                      ) : (
                        submissions.map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-bg border border-border">
                            <div className="flex items-center gap-2">
                              {s.passed ? <CheckCircle2 className="w-4 h-4 text-accent-teal" /> : <XCircle className="w-4 h-4 text-accent-rose" />}
                              <span className="text-xs font-mono text-text">{s.problem}</span>
                            </div>
                            <span className="text-[10px] font-mono text-text-muted">{s.date}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-1/2 flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-text-muted" />
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value as Language);
                        if (selectedProblem) setCode(selectedProblem.starterCode[e.target.value as Language] || "");
                      }}
                      className="px-2 py-1 rounded border border-border bg-bg text-text text-xs font-mono"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCode(selectedProblem.starterCode[language] || "")}
                      className="p-1.5 rounded border border-border text-text-muted hover:text-text"
                      title="Reset code"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 p-4 bg-bg text-text font-mono text-sm resize-none focus:outline-none"
                  spellCheck={false}
                />

                <div className="border-t border-border">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={runTests}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-accent-teal/40 bg-accent-teal/10 text-accent-teal text-xs font-mono font-bold hover:bg-accent-teal/20 disabled:opacity-50"
                      >
                        <Play className="w-3 h-3" />
                        Run Tests
                      </button>
                      <button
                        onClick={submitSolution}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent-amber text-bg text-xs font-mono font-bold hover:bg-accent-amber/90 disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        Submit
                      </button>
                    </div>
                    {testResults.length > 0 && (
                      <span className={`text-xs font-mono ${passedCount === testResults.length ? "text-accent-teal" : "text-accent-rose"}`}>
                        {passedCount}/{testResults.length} passed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {testResults.length > 0 && (
              <div className="h-48 border-t border-border bg-surface overflow-y-auto">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                  <Terminal className="w-4 h-4 text-text-muted" />
                  <span className="text-xs font-mono font-semibold text-text">Test Results</span>
                </div>
                <div className="p-2 space-y-1">
                  {testResults.map((r, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded text-xs font-mono ${r.passed ? "bg-accent-teal/5" : "bg-accent-rose/5"}`}>
                      {r.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal mt-0.5" /> : <XCircle className="w-3.5 h-3.5 text-accent-rose mt-0.5" />}
                      <div>
                        <p className="text-text-muted">Input: {r.input}</p>
                        <p className="text-text-muted">Expected: {r.expected}</p>
                        {!r.passed && <p className="text-accent-rose">Actual: {r.actual}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Code className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <h2 className="text-lg font-mono font-bold text-text mb-2">Select a Problem</h2>
              <p className="text-sm font-mono text-text-muted">Choose a problem from the sidebar to start coding</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
