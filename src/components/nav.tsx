"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Code2, Layers, Menu, X, BookOpen, Clock, Building2,
  FileText, BarChart3, Brain, Trophy, Terminal, Settings,
  Info, Timer, LogIn, Swords, ChevronDown, Home,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import NotificationBell from "@/components/notification-bell";
import ThemeToggle from "./ThemeToggle";

const primaryLinks = [
  { href: "/tracker", label: "Tracker", icon: Code2 },
  { href: "/patterns", label: "Patterns", icon: Layers },
  { href: "/problems", label: "Problems", icon: Terminal },
  { href: "/interview", label: "Interview", icon: Timer },
  { href: "/quiz", label: "Quiz", icon: Trophy },
];

const moreLinks = [
  { href: "/guild", label: "Guild", icon: Swords },
  { href: "/visualizer", label: "Visualizer", icon: Brain },
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? "border-b border-border bg-surface/95 backdrop-blur-xl shadow-sm"
        : "border-b border-border/50 bg-surface"
    }`}>
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="mr-4 flex items-center gap-2 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-amber text-bg transition-transform duration-200 group-hover:scale-105">
            <Code2 className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight font-mono hidden sm:block">
            DSA Practice
          </span>
        </Link>

        {/* Primary Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 ${
                  active
                    ? "text-accent-amber bg-accent-amber/10"
                    : "text-text-muted hover:text-text hover:bg-border/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 ${
                moreOpen || moreLinks.some((l) => isActive(l.href))
                  ? "text-accent-amber bg-accent-amber/10"
                  : "text-text-muted hover:text-text hover:bg-border/50"
              }`}
            >
              More
              <ChevronDown className={`h-3 w-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 py-1 rounded-xl border border-border bg-surface shadow-xl z-50">
                {moreLinks.map((link) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 text-xs font-mono transition-colors ${
                        active
                          ? "text-accent-amber bg-accent-amber/10"
                          : "text-text-muted hover:text-text hover:bg-border/50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          {user && <NotificationBell />}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-mono text-xs text-text-muted transition-colors hover:text-text hover:bg-border/50"
            >
              <span className="text-base">{profile?.avatar ?? "🧑‍💻"}</span>
              <span className="hidden sm:inline">{profile?.display_name ?? "user"}</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-accent-amber hover:bg-accent-amber/10 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">login</span>
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:text-text hover:bg-border/50 transition-all"
          >
            <div className="relative h-4 w-4">
              <Menu className={`absolute inset-0 h-4 w-4 transition-all ${mobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
              <X className={`absolute inset-0 h-4 w-4 transition-all ${mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
        mobileOpen ? "max-h-[80vh] border-t border-border" : "max-h-0"
      }`}>
        <nav className="px-4 py-3 space-y-1 bg-surface max-h-[70vh] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${
              pathname === "/" ? "bg-accent-amber/10 text-accent-amber" : "text-text-muted hover:text-text hover:bg-border/50"
            }`}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <div className="border-t border-border my-2" />

          <p className="px-3 py-1 text-[10px] font-mono text-text-muted uppercase tracking-wider">Main</p>
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${
                  isActive(link.href) ? "bg-accent-amber/10 text-accent-amber" : "text-text-muted hover:text-text hover:bg-border/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}

          <div className="border-t border-border my-2" />

          <p className="px-3 py-1 text-[10px] font-mono text-text-muted uppercase tracking-wider">More</p>
          {moreLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${
                  isActive(link.href) ? "bg-accent-amber/10 text-accent-amber" : "text-text-muted hover:text-text hover:bg-border/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}

          <div className="border-t border-border mt-2 pt-2">
            {user ? (
              <Link href="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-text-muted hover:text-text hover:bg-border/50 transition-all">
                <span className="text-base">{profile?.avatar ?? "🧑‍💻"}</span>
                <span>{profile?.display_name ?? "Profile"}</span>
              </Link>
            ) : (
              <Link href="/auth" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-accent-amber hover:bg-accent-amber/10 transition-all">
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
