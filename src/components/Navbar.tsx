"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Code2, Layers, Menu, X, BookOpen, Clock, Building2, FileText, BarChart3, Brain, Trophy, Terminal, Settings, Info, Timer, Code } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/tracker", label: "Tracker", icon: Code2 },
  { href: "/ide", label: "IDE", icon: Code },
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

export default function Navbar() {
  const pathname = usePathname();
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
        ? "border-border bg-background/95 backdrop-blur-xl shadow-sm"
        : "border-transparent bg-background"
    }`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105 group-hover:rotate-[-2deg]">
            <Code2 className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="hidden text-sm font-bold tracking-tight sm:inline-block">
            DSA Practice
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 btn-press ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 btn-press"
          >
            <div className="relative h-4 w-4">
              <Menu className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${mobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
              <X className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
        mobileOpen ? "max-h-96 border-t border-border" : "max-h-0"
      }`}>
        <nav className="mx-auto max-w-6xl px-4 py-3 space-y-1 bg-background">
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
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
