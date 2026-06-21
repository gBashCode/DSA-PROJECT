"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Settings, Moon, Sun, Trash2, Download, Upload, Bell, Keyboard, Clock } from "lucide-react";

interface SettingsState {
  notifications: boolean;
  autoStartTimer: boolean;
  showKeyboardHints: boolean;
  problemsPerPage: number;
}

const defaultSettings: SettingsState = {
  notifications: false,
  autoStartTimer: false,
  showKeyboardHints: true,
  problemsPerPage: 50,
};

function loadSettings(): SettingsState {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem("dsa-settings");
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: SettingsState) {
  localStorage.setItem("dsa-settings", JSON.stringify(settings));
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  };

  const handleExportAll = () => {
    const data = {
      tracker: localStorage.getItem("dsa-tracker:v1"),
      progress: localStorage.getItem("dsa-progress"),
      srs: localStorage.getItem("dsa-srs"),
      stats: localStorage.getItem("dsa-daily-stats"),
      settings: localStorage.getItem("dsa-settings"),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsa-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.tracker) localStorage.setItem("dsa-tracker:v1", data.tracker);
        if (data.progress) localStorage.setItem("dsa-progress", data.progress);
        if (data.srs) localStorage.setItem("dsa-srs", data.srs);
        if (data.stats) localStorage.setItem("dsa-daily-stats", data.stats);
        if (data.settings) localStorage.setItem("dsa-settings", data.settings);
        window.location.reload();
      } catch {
        alert("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    localStorage.removeItem("dsa-tracker:v1");
    localStorage.removeItem("dsa-progress");
    localStorage.removeItem("dsa-srs");
    localStorage.removeItem("dsa-daily-stats");
    localStorage.removeItem("dsa-daily-challenge");
    localStorage.removeItem("dsa-progression");
    localStorage.removeItem("dsa-settings");
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-6 h-6 text-accent-amber" />
        <h1 className="text-2xl font-mono font-bold text-text">Settings</h1>
      </div>

      <div className="space-y-6">
        <SettingsSection title="Appearance">
          <SettingsRow
            icon={theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            label="Theme"
            description="Choose your preferred theme"
          >
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-bg text-text text-xs font-mono focus:outline-none focus:border-accent-amber/50"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Behavior">
          <SettingsRow
            icon={<Bell className="w-4 h-4" />}
            label="Daily Reminders"
            description="Get reminded to practice daily"
          >
            <ToggleSwitch
              checked={settings.notifications}
              onChange={(v) => updateSetting("notifications", v)}
            />
          </SettingsRow>
          <SettingsRow
            icon={<Clock className="w-4 h-4" />}
            label="Auto-start Timer"
            description="Start timer when viewing a problem"
          >
            <ToggleSwitch
              checked={settings.autoStartTimer}
              onChange={(v) => updateSetting("autoStartTimer", v)}
            />
          </SettingsRow>
          <SettingsRow
            icon={<Keyboard className="w-4 h-4" />}
            label="Keyboard Hints"
            description="Show keyboard shortcut hints"
          >
            <ToggleSwitch
              checked={settings.showKeyboardHints}
              onChange={(v) => updateSetting("showKeyboardHints", v)}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Data">
          <SettingsRow
            icon={<Download className="w-4 h-4" />}
            label="Export All Data"
            description="Download a complete backup of your progress"
          >
            <button
              onClick={handleExportAll}
              className="px-3 py-1.5 rounded-lg border border-accent-teal/40 bg-accent-teal/10 text-accent-teal text-xs font-mono hover:bg-accent-teal/20 transition-colors"
            >
              Export
            </button>
          </SettingsRow>
          <SettingsRow
            icon={<Upload className="w-4 h-4" />}
            label="Import Data"
            description="Restore from a backup file"
          >
            <label className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text text-xs font-mono cursor-pointer hover:border-accent-amber/40 transition-colors">
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </SettingsRow>
          <SettingsRow
            icon={<Trash2 className="w-4 h-4 text-accent-rose" />}
            label="Reset All Data"
            description="Delete all progress and settings"
          >
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 rounded-lg border border-accent-rose/40 bg-accent-rose/10 text-accent-rose text-xs font-mono hover:bg-accent-rose/20 transition-colors"
            >
              Reset
            </button>
          </SettingsRow>
        </SettingsSection>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowResetConfirm(false)}>
          <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-mono font-bold text-text mb-2">Reset All Data?</h3>
            <p className="text-sm font-mono text-text-muted mb-4">
              This will delete all your progress, bookmarks, notes, and settings. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-border text-text text-sm font-mono hover:bg-bg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-lg bg-accent-rose text-white text-sm font-mono hover:bg-accent-rose/90 transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">{title}</h2>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-text-muted">{icon}</div>
        <div>
          <p className="text-sm font-mono text-text">{label}</p>
          <p className="text-xs font-mono text-text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-accent-amber" : "bg-border"}`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}
