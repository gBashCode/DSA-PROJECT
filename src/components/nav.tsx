"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";
import NotificationBell from "@/components/notification-bell";

const links = [
  { href: "/", label: "home" },
  { href: "/tracker", label: "tracker" },
  { href: "/guild", label: "guild" },
  { href: "/visualizer", label: "visualizer" },
];

export default function Nav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-5xl items-center px-4">
        <Link
          href="/"
          className="mr-8 font-mono text-base font-bold tracking-tight text-text"
        >
          DSA
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded px-3 py-1 font-mono text-sm transition-colors ${
                  active
                    ? "bg-accent-amber/15 text-accent-amber"
                    : "text-text-muted hover:text-text hover:bg-border/50"
                }`}
              >
                {active ? "> " : ""}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-border text-text-muted transition-colors hover:text-text hover:bg-border/50"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>

          {user ? (
            <>
              <NotificationBell />
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-sm text-text-muted transition-colors hover:text-text hover:bg-border/50"
              >
                <span className="text-base">{profile?.avatar ?? "🧑‍💻"}</span>
                <span className="hidden sm:inline">{profile?.display_name ?? "user"}</span>
              </Link>
            </>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-sm text-text-muted transition-colors hover:text-accent-amber hover:bg-accent-amber/10"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
