import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatternBySlug } from "@/lib/data";
import { patternVideos } from "@/lib/youtube";
import { ArrowLeft, ChevronRight, ExternalLink, Play } from "lucide-react";
import type { Difficulty } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  return { title: pattern?.name ?? "Pattern" };
}

const diffStyles: Record<Difficulty, string> = {
  Easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) notFound();

  const videos = patternVideos[slug] || [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link href="/patterns" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        All Patterns
      </Link>

      {/* Header */}
      <div className="mb-10 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{pattern.name}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{pattern.description}</p>
        {pattern.keyIdea && (
          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-5 animate-scale-in">
            <p className="text-sm leading-relaxed">
              <span className="font-bold text-primary">Key Idea: </span>
              {pattern.keyIdea}
            </p>
          </div>
        )}
      </div>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-4">Video Tutorials</h2>
          <div className="space-y-2">
            {videos.map((vid, idx) => (
              <a key={idx} href={vid.url} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-accent/50 transition-all duration-200 card-interactive stagger-item"
                style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/20 shrink-0 transition-transform duration-200 group-hover:scale-110">
                  <Play className="h-5 w-5 text-white fill-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{vid.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{vid.channel}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Problems */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-bold tracking-tight">Problems</h2>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary">{pattern.problems.length}</span>
        </div>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border bg-card">
          {pattern.problems.map((problem, idx) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="group flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-all duration-150 stagger-item"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground shrink-0 transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold group-hover:text-primary transition-colors block truncate">
                  {problem.title}
                </span>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold shrink-0 transition-transform duration-200 group-hover:scale-105 ${diffStyles[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
