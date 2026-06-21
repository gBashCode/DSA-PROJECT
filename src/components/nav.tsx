"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Code2, Layers, Menu, X, BookOpen, Clock, Building2,
  FileText, BarChart3, Brain, Trophy, Terminal, Settings,
  Info, Timer, LogIn, Swords,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import NotificationBell from "@/components/notification-bell";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/tracker", label: "Tracker", icon: Code2 },
  { href: "/guild", label: "Guild", icon: Swords },
  { href: "/interview", label: "Interview", icon: Timer },
  { href: "/patterns", label: "Patterns", icon: Layers },
  { href: "/problems", label: "Problems", icon: Terminal },
  { href: "/visualizer", label: "Visualizer", icon: Brain },
  { href: "/quiz", label: "Quiz", icon: Trophy },
  { href: "/roadmap", label: "Roadmap", icon: Clock },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/system-design", label: "System Design", icon: BookOpen },
  { href: "/cheat-sheet", label: "Cheat Sheet", icon: FileText },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "About", icon: Info },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      scrolled
        ? "border-border bg-surface/95 backdrop-blur-xl shadow-sm"
        : "border-transparent bg-surface"
    }`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-amber text-bg transition-transform duration-200 group-hover:scale-105 group-hover:rotate-[-2deg]">
            <Code2 className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="hidden text-sm font-bold tracking-tight sm:inline-block font-mono">
            DSA Practice
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 btn-press ${
                  active
                    ? "text-accent-amber bg-accent-amber/10"
                    : "text-text-muted hover:text-text hover:bg-border/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-amber rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user && <NotificationBell />}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-sm text-text-muted transition-colors hover:text-text hover:bg-border/50"
            >
              <span className="text-base">{profile?.avatar ?? "🧑‍💻"}</span>
              <span className="hidden sm:inline">{profile?.display_name ?? "user"}</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-sm text-text-muted transition-colors hover:text-accent-amber hover:bg-accent-amber/10"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">login</span>
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:text-text hover:bg-border/50 transition-all duration-200 btn-press"
          >
            <div className="relative h-4 w-4">
              <Menu className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${mobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
              <X className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
            </div>
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
        mobileOpen ? "max-h-[80vh] border-t border-border" : "max-h-0"
      }`}>
        <nav className="mx-auto max-w-6xl px-4 py-3 space-y-1 bg-surface">
          {navLinks.map((link, i) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-accent-amber/10 text-accent-amber"
                    : "text-text-muted hover:text-text hover:bg-border/50"
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-border mt-2 pt-2">
            {user ? (
              <Link href="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-border/50 transition-all duration-200">
                <span className="text-base">{profile?.avatar ?? "🧑‍💻"}</span>
                <span>{profile?.display_name ?? "Profile"}</span>
              </Link>
            ) : (
              <Link href="/auth" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-accent-amber hover:bg-accent-amber/10 transition-all duration-200">
                <LogIn className="h-4 w-4" />
                Login / Sign Up
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
