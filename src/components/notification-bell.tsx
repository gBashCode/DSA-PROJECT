"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Check, X, Swords, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  approveJoinRequest,
  rejectJoinRequest,
  acceptInviteFromNotification,
  declineInviteFromNotification,
} from "@/lib/guild";
import type { Notification } from "@/lib/guild";

interface NotificationBellProps {
  onAction?: () => void;
}

export default function NotificationBell({ onAction }: NotificationBellProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [notifs, count] = await Promise.all([
      getNotifications(user.id),
      getUnreadCount(user.id),
    ]);
    setNotifications(notifs);
    setUnreadCount(count);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => { await refresh(); })();
    const interval = setInterval(() => { refresh(); }, 15000);
    return () => clearInterval(interval);
  }, [user, refresh]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleMarkAllRead() {
    if (!user) return;
    await markAllNotificationsRead(user.id);
    refresh();
  }

  async function handleApprove(notif: Notification) {
    setLoading(true);
    const { data: invite } = await import("@/lib/supabase/client").then((m) =>
      m.createClient()
        .from("guild_invites")
        .select("id")
        .eq("guild_id", notif.guild_id)
        .eq("user_id", notif.from_user_id)
        .eq("status", "pending")
        .single()
    );
    if (invite) {
      await approveJoinRequest(notif.id, invite.id, notif.guild_id!, notif.from_user_id!);
    }
    await refresh();
    onAction?.();
    window.dispatchEvent(new CustomEvent("guild-notification-action"));
    setLoading(false);
  }

  async function handleReject(notif: Notification) {
    setLoading(true);
    const { data: invite } = await import("@/lib/supabase/client").then((m) =>
      m.createClient()
        .from("guild_invites")
        .select("id")
        .eq("guild_id", notif.guild_id)
        .eq("user_id", notif.from_user_id)
        .eq("status", "pending")
        .single()
    );
    if (invite) {
      await rejectJoinRequest(notif.id, invite.id, notif.guild_id!, notif.from_user_id!);
    }
    await refresh();
    onAction?.();
    window.dispatchEvent(new CustomEvent("guild-notification-action"));
    setLoading(false);
  }

  async function handleAcceptInvite(notif: Notification) {
    setLoading(true);
    await acceptInviteFromNotification(notif.id, notif.guild_id!, notif.from_user_id!);
    await refresh();
    onAction?.();
    window.dispatchEvent(new CustomEvent("guild-notification-action"));
    setLoading(false);
  }

  async function handleDeclineInvite(notif: Notification) {
    setLoading(true);
    await declineInviteFromNotification(notif.id, notif.guild_id!, notif.from_user_id!);
    await refresh();
    onAction?.();
    window.dispatchEvent(new CustomEvent("guild-notification-action"));
    setLoading(false);
  }

  async function handleDismiss(notif: Notification) {
    await markNotificationRead(notif.id);
    refresh();
  }

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative inline-flex h-7 w-7 items-center justify-center rounded border border-border transition-colors",
          open ? "border-accent-amber/50 bg-accent-amber/10 text-accent-amber" : "text-text-muted hover:text-text hover:bg-border/50"
        )}
      >
        <Bell className="h-3.5 w-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-danger px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-surface shadow-2xl z-50">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="font-mono text-[10px] text-accent-amber hover:text-accent-amber/80 transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="h-6 w-6 text-text-muted/30 mx-auto mb-2" />
                <p className="font-mono text-xs text-text-muted">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "border-b border-border/50 px-3 py-2.5 transition-colors",
                    !notif.read && "bg-accent-amber/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 shrink-0">
                      {notif.type === "guild_join_request" ? (
                        <Swords className="h-3.5 w-3.5 text-accent-amber" />
                      ) : notif.type === "guild_invite" ? (
                        <UserPlus className="h-3.5 w-3.5 text-accent-teal" />
                      ) : (
                        <Bell className="h-3.5 w-3.5 text-text-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs font-semibold text-text">{notif.title}</div>
                      <div className="mt-0.5 font-mono text-[11px] text-text-muted leading-relaxed">{notif.body}</div>
                      <div className="mt-1 font-mono text-[10px] text-text-muted/60">
                        {new Date(notif.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {notif.type === "guild_join_request" && !notif.read && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleApprove(notif)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-accent-teal/50 bg-accent-teal/10 px-2 py-1.5 font-mono text-[11px] font-semibold text-accent-teal hover:bg-accent-teal/20 transition-all disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(notif)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-accent-danger/50 bg-accent-danger/10 px-2 py-1.5 font-mono text-[11px] font-semibold text-accent-danger hover:bg-accent-danger/20 transition-all disabled:opacity-50"
                      >
                        <X className="h-3 w-3" /> Reject
                      </button>
                    </div>
                  )}

                  {notif.type === "guild_invite" && !notif.read && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleAcceptInvite(notif)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-accent-teal/50 bg-accent-teal/10 px-2 py-1.5 font-mono text-[11px] font-semibold text-accent-teal hover:bg-accent-teal/20 transition-all disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" /> Join
                      </button>
                      <button
                        onClick={() => handleDeclineInvite(notif)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-accent-danger/50 bg-accent-danger/10 px-2 py-1.5 font-mono text-[11px] font-semibold text-accent-danger hover:bg-accent-danger/20 transition-all disabled:opacity-50"
                      >
                        <X className="h-3 w-3" /> Decline
                      </button>
                    </div>
                  )}

                  {notif.read && (
                    <button
                      onClick={() => handleDismiss(notif)}
                      className="mt-1.5 font-mono text-[10px] text-text-muted/50 hover:text-text-muted transition-colors"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
