"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield, Swords, Calendar, Edit3, Save, X, LogOut, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, AVATARS } from "@/lib/auth";
import { getGuildByUser } from "@/lib/guild";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { problems } from "@/data/problems";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, logout, updateProfile, changePassword } = useAuth();
  const [tracker] = useLocalStorageState("dsa-tracker:v1", {
    solved: {} as Record<string, boolean>,
    bookmarked: {} as Record<string, boolean>,
    notes: {} as Record<string, string>,
  });

  const [guildName, setGuildName] = useState<string | null>(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    getGuildByUser(user.id).then((g) => setGuildName(g?.name ?? null));
  }, [user]);

  if (!user || !profile) {
    return (
      <div className="flex h-[calc(100vh-2.5rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent-amber" />
      </div>
    );
  }

  const totalSolved = Object.values(tracker.solved).filter(Boolean).length;
  const easySolved = problems.filter((p) => p.difficulty === "Easy" && tracker.solved[p.id]).length;
  const mediumSolved = problems.filter((p) => p.difficulty === "Medium" && tracker.solved[p.id]).length;
  const hardSolved = problems.filter((p) => p.difficulty === "Hard" && tracker.solved[p.id]).length;
  const totalPoints = easySolved * 1 + mediumSolved * 2 + hardSolved * 3;

  function handleSaveBio() {
    updateProfile({ bio: bioDraft });
    setEditingBio(false);
  }

  function handleSaveName() {
    if (nameDraft.trim()) {
      updateProfile({ display_name: nameDraft.trim() });
    }
    setEditingName(false);
  }

  function handleSaveAvatar(a: string) {
    updateProfile({ avatar: a });
    setEditingAvatar(false);
  }

  async function handleChangePassword() {
    setPwError("");
    setPwSuccess("");
    const result = await changePassword(currentPw, newPw);
    if (result.ok) {
      setPwSuccess("Password changed.");
      setCurrentPw("");
      setNewPw("");
      setTimeout(() => { setShowPasswordChange(false); setPwSuccess(""); }, 1500);
    } else {
      setPwError(result.error ?? "Failed.");
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-xl border border-border bg-surface p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <button onClick={() => setEditingAvatar(!editingAvatar)}
              className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-border bg-bg text-4xl transition-all hover:border-accent-amber/50"
              title="Change avatar">
              {profile.avatar}
            </button>
          </div>

          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  className="rounded border border-border bg-bg px-2 py-1 font-mono text-lg font-bold text-text focus:border-accent-amber focus:outline-none" autoFocus />
                <button onClick={handleSaveName} className="text-accent-teal hover:text-accent-teal/80"><Save className="h-4 w-4" /></button>
                <button onClick={() => setEditingName(false)} className="text-text-muted hover:text-text"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button onClick={() => { setNameDraft(profile.display_name ?? ""); setEditingName(true); }} className="group flex items-center gap-2 text-left">
                <span className="text-lg font-bold text-text group-hover:text-accent-amber transition-colors">{profile.display_name}</span>
                <Edit3 className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            <div className="mt-0.5 font-mono text-xs text-text-muted">@{profile.username}</div>

            <div className="mt-2">
              {editingBio ? (
                <div className="flex items-center gap-2">
                  <input value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveBio()}
                    placeholder="Write something about yourself..."
                    className="flex-1 rounded border border-border bg-bg px-2 py-1 font-mono text-xs text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none" autoFocus />
                  <button onClick={handleSaveBio} className="text-accent-teal hover:text-accent-teal/80"><Save className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setEditingBio(false)} className="text-text-muted hover:text-text"><X className="h-3.5 w-3.5" /></button>
                </div>
              ) : (
                <button onClick={() => { setBioDraft(profile.bio ?? ""); setEditingBio(true); }} className="group flex items-center gap-2 text-left">
                  <span className={cn("text-xs", profile.bio ? "text-text-muted" : "text-text-muted/50 italic")}>{profile.bio || "Add a bio..."}</span>
                  <Edit3 className="h-3 w-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>
          </div>
        </div>

        {editingAvatar && (
          <div className="mt-4 rounded-lg border border-border bg-bg p-3">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-muted">Pick an avatar</div>
            <div className="grid grid-cols-10 gap-1.5">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => handleSaveAvatar(a)}
                  className={cn("flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-all",
                    profile.avatar === a ? "border-accent-amber bg-accent-amber/15 scale-110" : "border-border bg-surface hover:border-text-muted/50")}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Points", value: totalPoints, color: "text-accent-amber" },
          { label: "Solved", value: totalSolved, color: "text-text" },
          { label: "Easy", value: easySolved, color: "text-accent-teal" },
          { label: "Medium", value: mediumSolved, color: "text-accent-amber" },
          { label: "Hard", value: hardSolved, color: "text-accent-danger" },
          { label: "Bookmarked", value: Object.values(tracker.bookmarked).filter(Boolean).length, color: "text-text-muted" },
        ].slice(0, 4).map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
            <div className={cn("font-mono text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {!guildName && (
        <div className="rounded-xl border border-border bg-surface p-4 mb-6 text-center">
          <Swords className="h-6 w-6 text-text-muted mx-auto mb-2" />
          <p className="font-mono text-xs text-text-muted">
            Not in a guild yet.{" "}
            <button onClick={() => router.push("/guild")} className="text-accent-amber hover:underline">Create or join one</button>
          </p>
        </div>
      )}

      {guildName && (
        <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 p-4 mb-6">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-accent-amber" />
            <span className="font-mono text-sm font-bold text-accent-amber">{guildName}</span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">Account</h3>

        <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
          <Calendar className="h-3.5 w-3.5" />
          <span>Joined {new Date(user.created_at ?? "").toLocaleDateString()}</span>
        </div>

        {showPasswordChange ? (
          <div className="space-y-2 rounded-lg border border-border bg-bg p-3">
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Current password"
              className="w-full rounded border border-border bg-surface px-2 py-1.5 font-mono text-xs text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none" />
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password (min 6 chars)"
              className="w-full rounded border border-border bg-surface px-2 py-1.5 font-mono text-xs text-text placeholder:text-text-muted focus:border-accent-amber focus:outline-none" />
            {pwError && <p className="font-mono text-[10px] text-accent-danger">{pwError}</p>}
            {pwSuccess && <p className="font-mono text-[10px] text-accent-teal">{pwSuccess}</p>}
            <div className="flex gap-2">
              <button onClick={handleChangePassword} className="rounded border border-accent-amber/50 bg-accent-amber/10 px-3 py-1 font-mono text-xs text-accent-amber hover:bg-accent-amber/20">
                <Save className="mr-1 inline h-3 w-3" /> Save
              </button>
              <button onClick={() => { setShowPasswordChange(false); setPwError(""); setPwSuccess(""); }}
                className="rounded border border-border px-3 py-1 font-mono text-xs text-text-muted hover:text-text">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowPasswordChange(true)} className="flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-text">
            <Shield className="h-3.5 w-3.5" /> Change password
          </button>
        )}

        <button onClick={handleLogout} className="flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-accent-danger">
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>
    </div>
  );
}
