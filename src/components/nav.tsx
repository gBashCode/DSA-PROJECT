"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const links = [
  { href: "/", label: "home" },
  { href: "/tracker", label: "tracker" },
  { href: "/visualizer", label: "visualizer" },
];

export default function Nav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

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

        <div className="ml-auto">
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
        </div>
      </div>
    </header>
  );
}
