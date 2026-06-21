"use client";
import Link from "next/link";
import { Network, Layers, Box, ChevronRight } from "lucide-react";
import fundamentals from "@/data/system-design/fundamentals.json";
import components from "@/data/system-design/components.json";
import caseStudies from "@/data/system-design/case-studies.json";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { BackgroundPaths } from "@/components/ui/background-paths";
import type { SystemDesignTopic } from "@/lib/types";

const sections = [
  { key: "fundamentals", title: "Fundamentals", desc: "Core concepts every engineer must know for system design interviews.", icon: Network, count: (fundamentals as SystemDesignTopic[]).length },
  { key: "components", title: "Components", desc: "Building blocks of distributed systems — databases, caches, queues, and more.", icon: Layers, count: (components as SystemDesignTopic[]).length },
  { key: "case-studies", title: "Case Studies", desc: "Real-world system design walkthroughs for popular applications.", icon: Box, count: (caseStudies as SystemDesignTopic[]).length },
];

export default function SystemDesignPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 relative">
      <BackgroundPaths className="opacity-10" />
      <div className="relative z-10">
        <AnimateIn>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Network className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">System Design</h1>
            </div>
            <p className="mt-2 text-muted-foreground text-lg">
              Master the architecture behind scalable, reliable distributed systems
            </p>
          </div>
        </AnimateIn>

        <div className="space-y-3 mb-12">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <AnimateIn key={section.key} delay={i * 100}>
                <Link
                  href={`/system-design/${section.key}`}
                  className="group flex items-center gap-5 rounded-xl border border-border bg-card p-6 hover:bg-accent/50 hover:border-primary/20 transition-all duration-200 card-interactive"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-[-3deg]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-lg group-hover:text-primary transition-colors">{section.title}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{section.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{section.count} topics</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </Link>
              </AnimateIn>
            );
          })}
        </div>

        <AnimateIn delay={300}>
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h3 className="text-lg font-bold mb-2">Suggested Learning Path</h3>
            <p className="text-sm text-muted-foreground">
              Start with <span className="font-bold text-foreground">Fundamentals</span> → move to <span className="font-bold text-foreground">Components</span> → practice <span className="font-bold text-foreground">Case Studies</span>
            </p>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
