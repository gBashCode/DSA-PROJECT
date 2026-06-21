"use client";

import { useState } from "react";
import { Code, Copy, Check } from "lucide-react";

interface CodeEditorProps {
  solutions: {
    python?: string;
    java?: string;
    cpp?: string;
    javascript?: string;
    go?: string;
    rust?: string;
  };
}

const LANGUAGES = [
  { key: "python", label: "Python", ext: ".py" },
  { key: "javascript", label: "JavaScript", ext: ".js" },
  { key: "java", label: "Java", ext: ".java" },
  { key: "cpp", label: "C++", ext: ".cpp" },
  { key: "go", label: "Go", ext: ".go" },
  { key: "rust", label: "Rust", ext: ".rs" },
] as const;

export function CodeEditor({ solutions }: CodeEditorProps) {
  const [activeLang, setActiveLang] = useState<string>("python");
  const [copied, setCopied] = useState(false);
  const [customCode, setCustomCode] = useState<Record<string, string>>({});

  const availableLangs = LANGUAGES.filter((l) => solutions[l.key as keyof typeof solutions]);
  const code = customCode[activeLang] || solutions[activeLang as keyof typeof solutions] || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (value: string) => {
    setCustomCode((prev) => ({ ...prev, [activeLang]: value }));
  };

  if (availableLangs.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1">
          <Code className="w-3.5 h-3.5 text-text-muted mr-1" />
          {availableLangs.map((lang) => (
            <button
              key={lang.key}
              onClick={() => setActiveLang(lang.key)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                activeLang === lang.key
                  ? "bg-accent-amber/10 text-accent-amber"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono text-text-muted hover:text-text transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-accent-teal" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => handleCodeChange(e.target.value)}
        className="w-full h-64 p-4 bg-bg text-text font-mono text-sm resize-none focus:outline-none"
        spellCheck={false}
        placeholder={`Write your ${activeLang} solution here...`}
      />
    </div>
  );
}
