"use client";

import { createClient } from "@/lib/supabase/client";
import { problems } from "@/data/problems";

export interface Guild {
  id: string;
  name: string;
  creator_id: string;
  guild_code: string;
  created_at: string;
}

export interface GuildMember {
  id: string;
  guild_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: {
    id: string;
    username: string;
    display_name: string;
    avatar: string;
  };
}

export interface GuildInvite {
  id: string;
  guild_id: string;
  user_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    display_name: string;
    avatar: string;
  };
}

export interface GuildSolve {
  id: string;
  guild_id: string;
  user_id: string;
  problem_id: string;
  solved: boolean;
  created_at: string;
}

export interface GuildActivity {
  id: string;
  guild_id: string;
  user_id: string;
  problem_id: string;
  action: "solved" | "unsolved";
  created_at: string;
  profiles?: {
    id: string;
    display_name: string;
    avatar: string;
  };
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatar: string;
  rank: number;
  total: number;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  guild_id: string | null;
  from_user_id: string | null;
  read: boolean;
  created_at: string;
}

export interface GuildData {
  members: GuildMember[];
  invites: GuildInvite[];
  solvesByUser: Record<string, string[]>;
  leaderboard: LeaderboardEntry[];
}

const POINTS: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };

export function getPointsForDifficulty(difficulty: string): number {
  return POINTS[difficulty] ?? 0;
}

function calcPoints(solves: string[]): { total: number; easy: number; medium: number; hard: number; solved: number } {
  let easy = 0, medium = 0, hard = 0;
  for (const pid of solves) {
    const p = problems.find((x) => x.id === pid);
    if (!p) continue;
    if (p.difficulty === "Easy") easy++;
    else if (p.difficulty === "Medium") medium++;
    else if (p.difficulty === "Hard") hard++;
  }
  return { total: easy * 1 + medium * 2 + hard * 3, easy, medium, hard, solved: solves.length };
}

function buildLeaderboard(members: GuildMember[], solvesByUser: Record<string, string[]>): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = members.map((m) => {
    const userSolves = solvesByUser[m.user_id] ?? [];
    const stats = calcPoints(userSolves);
    return {
      userId: m.user_id,
      displayName: m.profiles?.display_name ?? "Unknown",
      avatar: m.profiles?.avatar ?? "🧑‍💻",
      rank: 0,
      ...stats,
    };
  });

  entries.sort((a, b) => b.total - a.total || b.solved - a.solved);
  entries.forEach((e, i) => { e.rank = i + 1; });

  return entries;
}

const supabase = createClient();

// ── Guild CRUD ─────────────────────────────────────────

function generateGuildCode(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `#${num}`;
}

export async function createGuild(name: string, creatorId: string): Promise<Guild> {
  const guild_code = generateGuildCode();

  const { data, error } = await supabase
    .from("guilds")
    .insert({ name, creator_id: creatorId, guild_code })
    .select()
    .single();

  if (error) throw error;

  await supabase.from("guild_members").insert({
    guild_id: data.id,
    user_id: creatorId,
    role: "creator",
  });

  return data;
}

export async function getGuildByCode(code: string): Promise<Guild | null> {
  const { data } = await supabase
    .from("guilds")
    .select("*")
    .eq("guild_code", code.trim())
    .single();

  return data ?? null;
}

export async function joinGuildByCode(code: string, userId: string): Promise<{ ok: boolean; error?: string }> {
  const guild = await getGuildByCode(code);
  if (!guild) return { ok: false, error: "Guild not found." };

  const { data: existingMember } = await supabase
    .from("guild_members")
    .select("id")
    .eq("guild_id", guild.id)
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (existingMember) return { ok: false, error: "Already a member." };

  const { data: existingInvite } = await supabase
    .from("guild_invites")
    .select("id, status")
    .eq("guild_id", guild.id)
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (existingInvite?.status === "pending") return { ok: false, error: "Request already pending." };
  if (existingInvite?.status === "accepted") return { ok: false, error: "Already a member." };

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  await supabase.from("guild_invites").insert({
    guild_id: guild.id,
    user_id: userId,
    status: "pending",
  });

  await supabase.from("notifications").insert({
    user_id: guild.creator_id,
    type: "guild_join_request",
    title: "Join Request",
    body: `${userProfile?.display_name ?? "Someone"} wants to join ${guild.name}`,
    guild_id: guild.id,
    from_user_id: userId,
  });

  return { ok: true };
}

export async function getGuildByUser(userId: string): Promise<Guild | null> {
  const { data: member } = await supabase
    .from("guild_members")
    .select("guild_id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!member) return null;

  const { data } = await supabase
    .from("guilds")
    .select("*")
    .eq("id", member.guild_id)
    .single();

  return data;
}

// ── Single combined fetch ──────────────────────────────

export async function loadGuildData(guildId: string): Promise<GuildData> {
  const [membersResult, solvesResult, invitesResult] = await Promise.all([
    supabase
      .from("guild_members")
      .select("*, profiles(id, username, display_name, avatar)")
      .eq("guild_id", guildId),
    supabase
      .from("guild_solves")
      .select("user_id, problem_id, solved")
      .eq("guild_id", guildId),
    supabase
      .from("guild_invites")
      .select("*, profiles(id, username, display_name, avatar)")
      .eq("guild_id", guildId),
  ]);

  const members = membersResult.data ?? [];
  const rawSolves = solvesResult.data ?? [];
  const invites = invitesResult.data ?? [];

  const solvesByUser: Record<string, string[]> = {};
  for (const s of rawSolves) {
    if (!s.solved) continue;
    if (!solvesByUser[s.user_id]) solvesByUser[s.user_id] = [];
    solvesByUser[s.user_id].push(s.problem_id);
  }

  const leaderboard = buildLeaderboard(members, solvesByUser);

  return {
    members,
    invites,
    solvesByUser,
    leaderboard,
  };
}

// ── Mutations ──────────────────────────────────────────

export async function toggleSolve(
  guildId: string,
  userId: string,
  problemId: string
): Promise<boolean> {
  const { data: existing } = await supabase
    .from("guild_solves")
    .select("id, solved")
    .eq("guild_id", guildId)
    .eq("user_id", userId)
    .eq("problem_id", problemId)
    .single();

  const newSolved = !existing?.solved;

  if (existing) {
    await supabase.from("guild_solves").update({ solved: newSolved }).eq("id", existing.id);
  } else {
    await supabase.from("guild_solves").insert({
      guild_id: guildId,
      user_id: userId,
      problem_id: problemId,
      solved: true,
    });
  }

  await supabase.from("guild_activity").insert({
    guild_id: guildId,
    user_id: userId,
    problem_id: problemId,
    action: newSolved ? "solved" : "unsolved",
  });

  syncGuildSolveToTracker(problemId, newSolved);

  return newSolved;
}

export async function sendInvite(guildId: string, userId: string): Promise<void> {
  await supabase.from("guild_invites").insert({
    guild_id: guildId,
    user_id: userId,
    status: "pending",
  });

  const { data: guild } = await supabase.from("guilds").select("name").eq("id", guildId).single();
  const { data: adminProfile } = await supabase.from("profiles").select("display_name").eq("id", (await supabase.auth.getUser()).data.user?.id).single();

  await supabase.from("notifications").insert({
    user_id: userId,
    type: "guild_invite",
    title: "Guild Invitation",
    body: `${adminProfile?.display_name ?? "Admin"} invited you to join ${guild?.name ?? "a guild"}`,
    guild_id: guildId,
    from_user_id: (await supabase.auth.getUser()).data.user?.id,
  });
}

export async function respondToInvite(
  inviteId: string,
  status: "accepted" | "declined",
  guildId: string,
  userId: string
): Promise<void> {
  await supabase.from("guild_invites").update({ status }).eq("id", inviteId);

  await supabase.from("notifications")
    .delete()
    .eq("guild_id", guildId)
    .eq("from_user_id", userId)
    .in("type", ["guild_join_request", "guild_invite"]);

  if (status === "accepted") {
    await supabase.from("guild_members").insert({
      guild_id: guildId,
      user_id: userId,
      role: "member",
    });
  }
}

export async function removeMember(guildId: string, userId: string): Promise<void> {
  await supabase.from("guild_members").delete().eq("guild_id", guildId).eq("user_id", userId);
}

export async function disbandGuild(guildId: string): Promise<void> {
  await supabase.from("guilds").delete().eq("id", guildId);
}

// ── Tracker sync ───────────────────────────────────────

function syncGuildSolveToTracker(problemId: string, solved: boolean): void {
  try {
    const raw = localStorage.getItem("dsa-tracker:v1");
    if (!raw) return;
    const tracker = JSON.parse(raw) as {
      solved: Record<string, boolean>;
      bookmarked: Record<string, boolean>;
      notes: Record<string, string>;
    };
    tracker.solved[problemId] = solved;
    localStorage.setItem("dsa-tracker:v1", JSON.stringify(tracker));
  } catch {
    // ignore
  }
}

// ── Notifications ──────────────────────────────────────

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  return count ?? 0;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await supabase.from("notifications").update({ read: true }).eq("id", notificationId);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await supabase.from("notifications").delete().eq("id", notificationId);
}

export async function approveJoinRequest(
  notificationId: string,
  inviteId: string,
  guildId: string,
  userId: string
): Promise<void> {
  await respondToInvite(inviteId, "accepted", guildId, userId);
  await supabase.from("notifications").delete().eq("id", notificationId);
}

export async function rejectJoinRequest(
  notificationId: string,
  inviteId: string,
  guildId: string,
  userId: string
): Promise<void> {
  await respondToInvite(inviteId, "declined", guildId, userId);
  await supabase.from("notifications").delete().eq("id", notificationId);
}

export async function acceptInviteFromNotification(
  notificationId: string,
  guildId: string,
  userId: string
): Promise<void> {
  const { data: invite } = await supabase
    .from("guild_invites")
    .select("id")
    .eq("guild_id", guildId)
    .eq("user_id", userId)
    .eq("status", "pending")
    .limit(1)
    .single();

  if (invite) {
    await respondToInvite(invite.id, "accepted", guildId, userId);
  }
  await supabase.from("notifications").delete().eq("id", notificationId);
}

export async function declineInviteFromNotification(
  notificationId: string,
  guildId: string,
  userId: string
): Promise<void> {
  const { data: invite } = await supabase
    .from("guild_invites")
    .select("id")
    .eq("guild_id", guildId)
    .eq("user_id", userId)
    .eq("status", "pending")
    .limit(1)
    .single();

  if (invite) {
    await respondToInvite(invite.id, "declined", guildId, userId);
  }
  await supabase.from("notifications").delete().eq("id", notificationId);
}

// ── Activity (lazy) ────────────────────────────────────

export async function getGuildActivity(guildId: string): Promise<GuildActivity[]> {
  const { data, error } = await supabase
    .from("guild_activity")
    .select("*, profiles(id, display_name, avatar)")
    .eq("guild_id", guildId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}
