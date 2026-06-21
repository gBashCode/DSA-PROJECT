"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy, Plus, X, Crown, Shield, Swords,
  LogOut, Activity, UserPlus, LogIn, Mail, CheckCircle2,
  XCircle, Eye, Loader2, Copy, CheckCheck, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { problems } from "@/data/problems";
import { useAuth } from "@/lib/auth";
import {
  createGuild, getGuildByUser, loadGuildData, getGuildActivity,
  toggleSolve, sendInvite, respondToInvite, removeMember,
  disbandGuild, joinGuildByCode,
} from "@/lib/guild";
import type { Guild, GuildMember, GuildInvite, GuildActivity, LeaderboardEntry } from "@/lib/guild";
import { AnimateIn } from "@/components/animations/AnimateIn";

const dc: Record<string, string> = { Easy: "text-accent-teal", Medium: "text-accent-amber", Hard: "text-accent-danger" };
const rankIcons = [Crown, Shield, Swords];

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function GuildPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [guild, setGuild] = useState<Guild | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [invites, setInvites] = useState<GuildInvite[]>([]);
  const [solvesByUser, setSolvesByUser] = useState<Record<string, string[]>>({});
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [guildName, setGuildName] = useState("");
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "activity" | "requests" | "members">("leaderboard");
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [guildMode, setGuildMode] = useState<"choose" | "create" | "join">("choose");
  const [copiedCode, setCopiedCode] = useState(false);

  const isCreator = guild && user ? guild.creator_id === user.id : false;
  const isMember = members.some((m) => m.user_id === user?.id);
  const myInvite = invites.find((inv) => inv.user_id === user?.id && inv.status === "pending");
  const pendingRequests = invites.filter((inv) => inv.status === "pending");

  const refresh = useCallback(async () => {
    if (!guild || !user) return;
    const data = await loadGuildData(guild.id);
    setMembers(data.members);
    setInvites(data.invites);
    setSolvesByUser(data.solvesByUser);
    setLeaderboard(data.leaderboard);
  }, [guild, user]);

  useEffect(() => {
    if (authLoading) return;

    (async () => {
      if (!user) { setLoading(false); return; }

      const g = await getGuildByUser(user.id);
      setGuild(g);
      if (g) {
        const data = await loadGuildData(g.id);
        setMembers(data.members);
        setInvites(data.invites);
        setSolvesByUser(data.solvesByUser);
        setLeaderboard(data.leaderboard);
      }
      setLoading(false);
    })();
  }, [user, authLoading]);

  useEffect(() => {
    function handleNotificationAction() { refresh(); }
    window.addEventListener("guild-notification-action", handleNotificationAction);
    return () => window.removeEventListener("guild-notification-action", handleNotificationAction);
  }, [refresh]);

  async function handleCreateGuild() {
    if (!guildName.trim() || !user) return;
    const g = await createGuild(guildName.trim(), user.id);
    setGuild(g);
    const data = await loadGuildData(g.id);
    setMembers(data.members);
    setInvites(data.invites);
    setSolvesByUser(data.solvesByUser);
    setLeaderboard(data.leaderboard);
  }

  async function handleJoinByCode() {
    if (!joinCode.trim() || !user) return;
    setJoinError("");
    setJoinSuccess(false);
    const result = await joinGuildByCode(joinCode.trim(), user.id);
    if (result.ok) {
      setJoinSuccess(true);
      setJoinCode("");
    } else {
      setJoinError(result.error ?? "Failed to join.");
    }
  }

  async function handleRequestToJoin() {
    if (!user || !guild) return;
    await sendInvite(guild.id, user.id);
    setRequestSent(true);
    refresh();
  }

  async function handleInviteMember() {
    if (!inviteUsername.trim() || !guild) return;
    setInviteError("");
    const { data: profileData } = await import("@/lib/supabase/client").then((m) =>
      m.createClient().from("profiles").select("id").eq("username", inviteUsername.toLowerCase()).single()
    );
    if (!profileData) { setInviteError("User not found."); return; }
    if (members.some((m) => m.user_id === profileData.id)) { setInviteError("Already a member."); return; }

    await sendInvite(guild.id, profileData.id);
    setInviteUsername("");
    refresh();
  }

  async function handleApproveRequest(inviteId: string, userId: string) {
    if (!guild) return;
    await respondToInvite(inviteId, "accepted", guild.id, userId);
    refresh();
  }

  async function handleDeclineInvite(inviteId: string) {
    if (!guild || !user) return;
    await respondToInvite(inviteId, "declined", guild.id, user.id);
    refresh();
  }

  async function handleRemoveMember(userId: string) {
    if (!guild) return;
    await removeMember(guild.id, userId);
    refresh();
  }

  async function handleToggleSolve(problemId: string) {
    if (!guild || !user) return;
    await toggleSolve(guild.id, user.id, problemId);
    refresh();
  }

  async function handleDisband() {
    if (!guild || !confirm("Disband this guild?")) return;
    await disbandGuild(guild.id);
    setGuild(null);
    setMembers([]);
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-[calc(100vh-2.5rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent-amber" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-16 text-center">
        <AnimateIn>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
            <Swords className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Guilds</h1>
          <p className="text-muted-foreground text-lg mb-6">Log in to create or join a guild.</p>
        </AnimateIn>
        <AnimateIn delay={100}>
          <button onClick={() => router.push("/auth")}
            className="rounded-xl border border-accent-amber/30 bg-accent-amber/10 px-6 py-3 font-mono text-sm font-semibold text-accent-amber hover:bg-accent-amber/20 transition-all duration-200 card-press">
            Login / Sign Up
          </button>
        </AnimateIn>
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-10">
        <AnimateIn>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Swords className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Guilds</h1>
            </div>
            <p className="mt-2 text-muted-foreground text-lg">Form a study group or join an existing one.</p>
          </div>
        </AnimateIn>

        {guildMode === "choose" && (
          <div className="space-y-3">
            <AnimateIn delay={100}>
              <button onClick={() => setGuildMode("create")}
                className="w-full flex items-center gap-4 rounded-xl border border-border bg-card p-6 text-left transition-all duration-200 hover:border-primary/20 hover:bg-accent/50 card-interactive group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-200">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-mono text-sm font-bold text-text group-hover:text-primary transition-colors">Create a Guild</div>
                  <div className="font-mono text-xs text-text-muted">Start your own study group</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
              </button>
            </AnimateIn>
            <AnimateIn delay={200}>
              <button onClick={() => setGuildMode("join")}
                className="w-full flex items-center gap-4 rounded-xl border border-border bg-card p-6 text-left transition-all duration-200 hover:border-primary/20 hover:bg-accent/50 card-interactive group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-teal/10 text-accent-teal group-hover:bg-accent-teal group-hover:text-bg group-hover:scale-110 transition-all duration-200">
                  <LogIn className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-mono text-sm font-bold text-text group-hover:text-accent-teal transition-colors">Join a Guild</div>
                  <div className="font-mono text-xs text-text-muted">Enter a guild code from your admin</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-accent-teal group-hover:translate-x-1 transition-all duration-200" />
              </button>
            </AnimateIn>
          </div>
        )}

        {guildMode === "create" && (
          <AnimateIn>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <button onClick={() => setGuildMode("choose")} className="font-mono text-xs text-text-muted hover:text-text transition-colors">&larr; Back</button>
              <div>
                <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-muted">Guild Name</label>
                <input value={guildName} onChange={(e) => setGuildName(e.target.value)} placeholder="e.g. Binary Bandits"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none" />
              </div>
              <button onClick={handleCreateGuild} disabled={!guildName.trim()}
                className={cn("w-full rounded-xl border px-4 py-2.5 font-mono text-sm font-semibold transition-all duration-200",
                  guildName.trim() ? "border-accent-amber/30 bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20 card-press" : "border-border bg-bg text-text-muted cursor-not-allowed opacity-50")}>
                Create Guild
              </button>
            </div>
          </AnimateIn>
        )}

        {guildMode === "join" && (
          <AnimateIn>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <button onClick={() => setGuildMode("choose")} className="font-mono text-xs text-text-muted hover:text-text transition-colors">&larr; Back</button>
              <div>
                <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-muted">Guild Code</label>
                <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="#12345"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none" />
              </div>
              {joinError && <p className="font-mono text-xs text-accent-danger">{joinError}</p>}
              {joinSuccess && (
                <div className="rounded-lg border border-accent-teal/30 bg-accent-teal/10 p-3 font-mono text-xs text-accent-teal">
                  Request sent! Waiting for admin approval.
                </div>
              )}
              <button onClick={handleJoinByCode} disabled={!joinCode.trim()}
                className={cn("w-full rounded-xl border px-4 py-2.5 font-mono text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                  joinCode.trim() ? "border-accent-teal/30 bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20 card-press" : "border-border bg-bg text-text-muted cursor-not-allowed opacity-50")}>
                <LogIn className="h-4 w-4" /> Join Guild
              </button>
            </div>
          </AnimateIn>
        )}
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <AnimateIn>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Swords className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{guild.name}</h1>
            </div>
            <p className="mt-2 text-muted-foreground text-lg">{members.length} members</p>
          </div>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div className="rounded-xl border border-border bg-card p-6 text-center mb-8">
            <Eye className="h-8 w-8 text-text-muted mx-auto mb-3" />
            <p className="font-mono text-sm text-text-muted mb-4">Request to join or ask the creator to invite you.</p>
            {myInvite || requestSent ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/5 px-4 py-2 font-mono text-sm text-accent-amber">
                <Mail className="h-4 w-4" /> Request pending
              </div>
            ) : (
              <button onClick={handleRequestToJoin}
                className="rounded-xl border border-accent-amber/30 bg-accent-amber/10 px-4 py-2 font-mono text-sm font-semibold text-accent-amber hover:bg-accent-amber/20 transition-all duration-200 card-press">
                <UserPlus className="mr-2 inline h-4 w-4" /> Request to Join
              </button>
            )}
          </div>
        </AnimateIn>

        <AnimateIn delay={200}>
          <LeaderboardBoard leaderboard={leaderboard} currentUserId={user.id} onSelectMember={(uid) => { setActiveMember(uid); setActiveTab("leaderboard"); }} />
        </AnimateIn>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-2.5rem)] overflow-hidden">
      <aside className="flex w-52 shrink-0 flex-col border-r border-border bg-card">
        <div className="border-b border-border px-3 py-3">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-accent-amber" />
            <span className="font-mono text-sm font-bold text-text truncate">{guild.name}</span>
          </div>
          <div className="mt-1 font-mono text-xs text-text-muted">{members.length} members</div>
          <button
            onClick={() => { navigator.clipboard.writeText(guild.guild_code); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }}
            className="mt-2 flex w-full items-center gap-1.5 rounded-lg border border-border bg-bg px-2 py-1 font-mono text-[11px] text-text-muted hover:text-accent-amber hover:border-accent-amber/50 transition-colors"
            title="Click to copy guild code"
          >
            {copiedCode ? <CheckCheck className="h-3 w-3 text-accent-teal shrink-0" /> : <Copy className="h-3 w-3 shrink-0" />}
            <span className="truncate">{guild.guild_code}</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <button onClick={() => { setActiveMember(null); setActiveTab("leaderboard"); }}
            className={cn("w-full px-3 py-1.5 text-left font-mono text-xs transition-colors",
              activeMember === null && activeTab === "leaderboard" ? "bg-accent-amber/15 text-accent-amber" : "text-text-muted hover:text-text hover:bg-border/50")}>
            {activeMember === null && activeTab === "leaderboard" ? "> " : ""} Leaderboard
          </button>
          <button onClick={() => { setActiveMember(null); setActiveTab("activity"); }}
            className={cn("w-full px-3 py-1.5 text-left font-mono text-xs transition-colors",
              activeTab === "activity" && activeMember === null ? "bg-accent-amber/15 text-accent-amber" : "text-text-muted hover:text-text hover:bg-border/50")}>
            {activeTab === "activity" && activeMember === null ? "> " : ""} Activity
          </button>
          {isCreator && (
            <button onClick={() => { setActiveMember(null); setActiveTab("requests"); }}
              className={cn("w-full px-3 py-1.5 text-left font-mono text-xs transition-colors",
                activeTab === "requests" ? "bg-accent-amber/15 text-accent-amber" : "text-text-muted hover:text-text hover:bg-border/50")}>
              {activeTab === "requests" ? "> " : ""} Requests
              {pendingRequests.length > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-amber px-1 text-[10px] font-bold text-bg">{pendingRequests.length}</span>
              )}
            </button>
          )}
          {isCreator && (
            <button onClick={() => { setActiveMember(null); setActiveTab("members"); }}
              className={cn("w-full px-3 py-1.5 text-left font-mono text-xs transition-colors",
                activeTab === "members" ? "bg-accent-amber/15 text-accent-amber" : "text-text-muted hover:text-text hover:bg-border/50")}>
              {activeTab === "members" ? "> " : ""} Manage
            </button>
          )}
        </div>
        {isCreator && (
          <div className="border-t border-border p-2">
            <button onClick={handleDisband} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-mono text-xs text-text-muted transition-colors hover:text-accent-danger hover:bg-accent-danger/10">
              <LogOut className="h-3.5 w-3.5" /> Disband
            </button>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            {activeMember !== null ? members.find((m) => m.user_id === activeMember)?.profiles?.display_name
              : activeTab === "activity" ? "Activity" : activeTab === "requests" ? "Requests" : activeTab === "members" ? "Manage" : "Leaderboard"}
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeMember !== null ? (
            <MemberSolves solves={solvesByUser[activeMember] ?? []} isYou={activeMember === user.id} onToggleSolve={handleToggleSolve} memberName={members.find((m) => m.user_id === activeMember)?.profiles?.display_name ?? "Member"} />
          ) : activeTab === "activity" ? (
            <ActivityView guildId={guild.id} />
          ) : activeTab === "requests" && isCreator ? (
            <RequestsView invites={invites} onApprove={handleApproveRequest} onDecline={handleDeclineInvite} />
          ) : activeTab === "members" && isCreator ? (
            <ManageMembersView members={members} currentUserId={user.id} onInvite={handleInviteMember} inviteUsername={inviteUsername} setInviteUsername={setInviteUsername} inviteError={inviteError} onRemove={handleRemoveMember} />
          ) : (
            <LeaderboardBoard leaderboard={leaderboard} currentUserId={user.id} onSelectMember={(uid) => { setActiveMember(uid); setActiveTab("leaderboard"); }} />
          )}
        </div>
      </div>
    </div>
  );
}

function LeaderboardBoard({ leaderboard, currentUserId, onSelectMember }: { leaderboard: LeaderboardEntry[]; currentUserId: string; onSelectMember: (userId: string) => void }) {
  if (leaderboard.length === 0) return <p className="py-8 text-center font-mono text-xs text-text-muted">No members yet.</p>;
  return (
    <div className="space-y-2">
      {leaderboard.map((e, i) => {
        const Icon = rankIcons[e.rank - 1] ?? Trophy;
        return (
          <AnimateIn key={e.userId} delay={i * 60}>
            <button onClick={() => onSelectMember(e.userId)}
              className={cn("w-full flex items-center gap-4 rounded-xl border bg-card px-4 py-3 text-left transition-all duration-200 hover:border-primary/20 hover:bg-accent/50 card-interactive group", e.rank === 1 ? "border-accent-amber/30 bg-accent-amber/5" : "border-border")}>
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                e.rank === 1 ? "bg-accent-amber/15 text-accent-amber" : e.rank === 2 ? "bg-text-muted/10 text-text-muted" : "bg-border/50 text-text-muted")}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-bold text-text group-hover:text-primary transition-colors">{e.userId === currentUserId ? "you" : e.displayName}</span>
                  <span className="font-mono text-xs text-text-muted">#{e.rank}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 font-mono text-xs">
                  <span className="text-accent-teal">{e.easy}E</span>
                  <span className="text-accent-amber">{e.medium}M</span>
                  <span className="text-accent-danger">{e.hard}H</span>
                  <span className="text-text-muted">{e.solved} solved</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold text-accent-amber">{e.total}</div>
                <div className="font-mono text-[10px] text-text-muted uppercase">pts</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
            </button>
          </AnimateIn>
        );
      })}
    </div>
  );
}

function MemberSolves({ solves, isYou, onToggleSolve, memberName }: { solves: string[]; isYou: boolean; onToggleSolve: (pid: string) => void; memberName: string }) {
  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState("all");

  const filtered = problems.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (diff !== "all" && p.difficulty !== diff) return false;
    return true;
  });

  const solvedCount = problems.filter((p) => solves.includes(p.id)).length;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-text">
            {isYou ? "Your" : `${memberName}'s`} Progress
          </h2>
          <span className="font-mono text-xs text-text-muted">
            {solvedCount}/{problems.length} solved
          </span>
        </div>
        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent-teal transition-all"
            style={{ width: `${problems.length > 0 ? (solvedCount / problems.length) * 100 : 0}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-48 rounded-lg border border-border bg-bg px-3 py-1.5 font-mono text-xs text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <select
            value={diff}
            onChange={(e) => setDiff(e.target.value)}
            className="rounded-lg border border-border bg-bg px-3 py-1.5 font-mono text-xs text-text focus:border-primary focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-mono text-sm text-text-muted">No problems match those filters</p>
          </div>
        ) : (
          filtered.map((p, i) => {
            const solved = solves.includes(p.id);
            return (
              <div
                key={p.id}
                className={cn(
                  "group border-b border-border transition-colors",
                  solved && "bg-accent-teal/5"
                )}
              >
                <div className="flex items-center gap-3 px-3 py-2 text-sm">
                  <span className="w-8 shrink-0 text-right font-mono text-xs text-text-muted">
                    {i + 1}
                  </span>

                  <button
                    onClick={() => isYou && onToggleSolve(p.id)}
                    className={cn(
                      "h-4 w-4 shrink-0 rounded-sm border transition-colors",
                      solved
                        ? "border-accent-teal bg-accent-teal"
                        : "border-border hover:border-text-muted"
                    )}
                    aria-label={solved ? "Mark unsolved" : "Mark solved"}
                  >
                    {solved && (
                      <svg viewBox="0 0 12 12" className="h-full w-full p-0.5 text-bg" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </button>

                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "min-w-0 flex-1 truncate transition-colors hover:text-accent-amber",
                      solved ? "text-text-muted line-through" : "text-text"
                    )}
                  >
                    {p.title}
                  </a>

                  <span className={cn("shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider", dc[p.difficulty])}>
                    [{p.difficulty.toUpperCase()}]
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ActivityView({ guildId }: { guildId: string }) {
  const [activity, setActivity] = useState<GuildActivity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      setLoading(true);
      const data = await getGuildActivity(guildId);
      setActivity(data);
      setLoading(false);
    })();
  }, [guildId, loaded]);

  if (!loaded) {
    return (
      <button onClick={() => setLoaded(true)}
        className="rounded-xl border border-border bg-card px-6 py-8 text-center w-full transition-all duration-200 hover:border-primary/20 hover:bg-accent/50 card-interactive group">
        <Activity className="h-6 w-6 text-text-muted mx-auto mb-2 group-hover:text-primary transition-colors" />
        <p className="font-mono text-xs text-text-muted group-hover:text-primary/70 transition-colors">Click to load activity</p>
      </button>
    );
  }

  if (loading) {
    return <div className="flex py-8 justify-center"><Loader2 className="h-5 w-5 animate-spin text-accent-amber" /></div>;
  }

  if (activity.length === 0) {
    return (
      <div className="py-12 text-center">
        <Activity className="h-8 w-8 text-text-muted/30 mx-auto mb-3" />
        <p className="font-mono text-xs text-text-muted">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activity.map((a, i) => {
        const p = problems.find((x) => x.id === a.problem_id);
        return (
          <AnimateIn key={a.id} delay={i * 40}>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-primary/20 hover:bg-accent/50">
              <span className="text-lg">{a.profiles?.avatar ?? "🧑‍💻"}</span>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-xs text-text font-semibold">{a.profiles?.display_name ?? "?"}</span>
                <span className="font-mono text-xs text-text-muted"> {a.action === "solved" ? "solved" : "unsolved"} </span>
                <span className={cn("font-mono text-xs", dc[p?.difficulty ?? "Easy"])}>{p?.title ?? a.problem_id}</span>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-text-muted">{timeAgo(a.created_at)}</span>
            </div>
          </AnimateIn>
        );
      })}
    </div>
  );
}

function RequestsView({ invites, onApprove, onDecline }: { invites: GuildInvite[]; onApprove: (id: string, uid: string) => void; onDecline: (id: string) => void }) {
  const pending = invites.filter((i) => i.status === "pending");
  const processed = invites.filter((i) => i.status !== "pending");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">Pending ({pending.length})</h2>
        {pending.length === 0 ? <p className="py-6 text-center font-mono text-xs text-text-muted">No pending requests.</p> : (
          <div className="space-y-2">
            {pending.map((inv, i) => (
              <AnimateIn key={inv.id} delay={i * 60}>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-primary/20 hover:bg-accent/50">
                  <div className="flex-1">
                    <span className="font-mono text-sm font-bold text-text">{inv.profiles?.display_name ?? "?"}</span>
                    <span className="ml-2 font-mono text-xs text-text-muted">@{inv.profiles?.username ?? "?"}</span>
                    <div className="mt-0.5 font-mono text-[10px] text-text-muted">Requested {timeAgo(inv.created_at)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onApprove(inv.id, inv.user_id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-teal/30 bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20 transition-all duration-200 card-press" title="Approve">
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDecline(inv.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-danger/30 bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/20 transition-all duration-200 card-press" title="Decline">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
      {processed.length > 0 && (
        <div>
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">Processed</h2>
          <div className="space-y-1">
            {processed.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-3 py-2 opacity-60">
                <span className="flex-1 font-mono text-xs text-text">{inv.profiles?.display_name ?? "?"} (@{inv.profiles?.username ?? "?"})</span>
                <span className={cn("font-mono text-[10px] font-semibold uppercase", inv.status === "accepted" ? "text-accent-teal" : "text-accent-danger")}>{inv.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ManageMembersView({ members, currentUserId, onInvite, inviteUsername, setInviteUsername, inviteError, onRemove }: {
  members: GuildMember[]; currentUserId: string; onInvite: () => void; inviteUsername: string; setInviteUsername: (v: string) => void; inviteError: string; onRemove: (uid: string) => void;
}) {
  return (
    <div className="space-y-6">
      <AnimateIn>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">Invite Member</h2>
          <div className="flex gap-2">
            <input value={inviteUsername} onChange={(e) => setInviteUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onInvite()}
              placeholder="Enter username" className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none" />
            <button onClick={onInvite}
              className="rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-4 py-2 font-mono text-sm font-semibold text-accent-amber hover:bg-accent-amber/20 transition-all duration-200 card-press">
              <UserPlus className="h-4 w-4" />
            </button>
          </div>
          {inviteError && <p className="mt-2 font-mono text-xs text-accent-danger">{inviteError}</p>}
        </div>
      </AnimateIn>

      <div>
        <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">Members ({members.length})</h2>
        <div className="space-y-2">
          {members.map((m, i) => {
            const isYou = m.user_id === currentUserId;
            const isCreatorMember = m.role === "creator";
            return (
              <AnimateIn key={m.user_id} delay={i * 60}>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-primary/20 hover:bg-accent/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-text">{isYou ? "you" : m.profiles?.display_name ?? "?"}</span>
                      {isCreatorMember && <Crown className="h-3.5 w-3.5 text-accent-amber" />}
                    </div>
                  </div>
                  {!isYou && !isCreatorMember && (
                    <button onClick={() => onRemove(m.user_id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-danger/30 bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/20 transition-all duration-200 card-press" title="Remove">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
