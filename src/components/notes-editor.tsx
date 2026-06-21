"use client";

import { useState } from "react";
import { Edit3, Eye, Bold, Italic, Code, List, Link as LinkIcon } from "lucide-react";

interface NotesEditorProps {
  problemId: string;
  notes: string;
  onSave: (notes: string) => void;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-text">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-text">$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-bg text-accent-amber font-mono text-xs">$1</code>')
    .replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold text-text mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-base font-bold text-text mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-lg font-bold text-text mt-4 mb-2">$1</h1>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 text-text-muted">• $1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 text-text-muted">$1</li>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-accent-amber hover:underline">$1</a>')
    .replace(/\n/g, '<br/>');
}

export function NotesEditor({ problemId, notes, onSave }: NotesEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById(`notes-${problemId}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localNotes.substring(start, end);
    const newText = localNotes.substring(0, start) + prefix + selectedText + suffix + localNotes.substring(end);
    setLocalNotes(newText);
  };

  const handleSave = () => {
    onSave(localNotes);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-border bg-bg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-mono text-text-muted">Notes</span>
        <div className="flex items-center gap-1">
          {isEditing && (
            <>
              <button onClick={() => insertMarkdown("**", "**")} className="p-1 rounded text-text-muted hover:text-text hover:bg-surface" title="Bold">
                <Bold className="w-3 h-3" />
              </button>
              <button onClick={() => insertMarkdown("*", "*")} className="p-1 rounded text-text-muted hover:text-text hover:bg-surface" title="Italic">
                <Italic className="w-3 h-3" />
              </button>
              <button onClick={() => insertMarkdown("`", "`")} className="p-1 rounded text-text-muted hover:text-text hover:bg-surface" title="Code">
                <Code className="w-3 h-3" />
              </button>
              <button onClick={() => insertMarkdown("- ")} className="p-1 rounded text-text-muted hover:text-text hover:bg-surface" title="List">
                <List className="w-3 h-3" />
              </button>
              <button onClick={() => insertMarkdown("[", "](url)")} className="p-1 rounded text-text-muted hover:text-text hover:bg-surface" title="Link">
                <LinkIcon className="w-3 h-3" />
              </button>
              <div className="w-px h-3 bg-border mx-1" />
            </>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-1 rounded transition-colors ${isEditing ? "text-accent-amber bg-accent-amber/10" : "text-text-muted hover:text-text hover:bg-surface"}`}
            title={isEditing ? "Preview" : "Edit"}
          >
            {isEditing ? <Eye className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          id={`notes-${problemId}`}
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={handleSave}
          placeholder="Add notes (supports markdown)..."
          className="w-full h-32 p-3 bg-transparent text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none"
        />
      ) : (
        <div
          className="p-3 min-h-[80px] text-sm font-mono text-text-muted cursor-pointer hover:bg-surface/50"
          onClick={() => setIsEditing(true)}
          dangerouslySetInnerHTML={{ __html: notes ? renderMarkdown(notes) : '<span class="text-text-muted">Click to add notes...</span>' }}
        />
      )}
    </div>
  );
}
