"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import fundamentals from "@/data/system-design/fundamentals.json";
import components from "@/data/system-design/components.json";
import caseStudies from "@/data/system-design/case-studies.json";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { AnimatedGlowingSearchBar } from "@/components/ui/animated-glowing-search-bar";
import { ArrowLeft, ChevronRight, Building2, Lightbulb, Target } from "lucide-react";
import type { SystemDesignTopic } from "@/lib/types";

const sections: Record<string, { title: string; topics: SystemDesignTopic[] }> = {
  fundamentals: { title: "Fundamentals", topics: fundamentals as SystemDesignTopic[] },
  components: { title: "Components", topics: components as SystemDesignTopic[] },
  "case-studies": { title: "Case Studies", topics: caseStudies as SystemDesignTopic[] },
};

export default function SystemDesignSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const section = sections[slug];
  const [search, setSearch] = useState("");

  if (section) {
    const filtered = section.topics.filter((t) => {
      if (!search) return true;
      return t.name.toLowerCase().includes(search.toLowerCase());
    });

    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/system-design" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          System Design
        </Link>

        <AnimateIn>
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{section.title} Topics</h1>
            <p className="mt-2 text-muted-foreground text-lg">{section.topics.length} topics</p>
          </div>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div className="mb-6">
            <AnimatedGlowingSearchBar
              placeholder="Search topics..."
              onSearch={setSearch}
              className="max-w-sm"
            />
          </div>
        </AnimateIn>

        <div className="space-y-1">
          {filtered.map((topic, idx) => (
            <Link
              key={topic.slug}
              href={`/system-design/${topic.slug}`}
              className="group flex items-center gap-4 rounded-xl px-5 py-4 hover:bg-accent/50 transition-all duration-150 stagger-item"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground shrink-0 transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold group-hover:text-primary transition-colors block truncate">{topic.name}</span>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{topic.keyPoints[0]}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {topic.companies?.slice(0, 3).map((c) => (
                  <span key={c} className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted font-medium">{c}</span>
                ))}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const allTopics = [...(fundamentals as SystemDesignTopic[]), ...(components as SystemDesignTopic[]), ...(caseStudies as SystemDesignTopic[])];
  const topic = allTopics.find((t) => t.slug === slug);
  if (!topic) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">Topic Not Found</h1>
        <Link href="/system-design" className="text-sm text-primary hover:underline">Back to System Design</Link>
      </div>
    );
  }

  const sectionEntry = Object.values(sections).find((s) => s.topics.some((t) => t.slug === slug));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/system-design" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        System Design
      </Link>

      <AnimateIn>
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{topic.name}</h1>
          {sectionEntry && (
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">{sectionEntry.title}</span>
          )}
        </div>
      </AnimateIn>

      <AnimateIn delay={100}>
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-primary" />
            Key Points
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {topic.keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-border p-4 bg-card stagger-item" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      {topic.challenges && topic.challenges.length > 0 && (
        <AnimateIn delay={200}>
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              Challenges
            </h2>
            <div className="space-y-2">
              {topic.challenges.map((challenge, idx) => (
                <div key={idx} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-muted-foreground leading-relaxed stagger-item" style={{ animationDelay: `${idx * 60}ms` }}>
                  {challenge}
                </div>
              ))}
            </div>
          </section>
        </AnimateIn>
      )}

      {topic.companies && topic.companies.length > 0 && (
        <AnimateIn delay={300}>
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5" />
              Asked At
            </h2>
            <div className="flex flex-wrap gap-2">
              {topic.companies.map((company) => (
                <span key={company} className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">{company}</span>
              ))}
            </div>
          </section>
        </AnimateIn>
      )}

      {topic.interviewQuestions && topic.interviewQuestions.length > 0 && (
        <AnimateIn delay={400}>
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Common Interview Questions</h2>
            <div className="space-y-2">
              {topic.interviewQuestions.map((q, idx) => (
                <div key={idx} className="rounded-xl border border-border p-4 text-sm leading-relaxed bg-card stagger-item" style={{ animationDelay: `${idx * 60}ms` }}>
                  {q}
                </div>
              ))}
            </div>
          </section>
        </AnimateIn>
      )}
    </div>
  );
}
