"use client";
import roadmap from "@/data/roadmap.json";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { Target, Clock } from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <AnimateIn>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">12-Week Roadmap</h1>
          </div>
          <p className="mt-2 text-muted-foreground text-lg">
            A structured path from fundamentals to advanced topics — follow it week by week
          </p>
        </div>
      </AnimateIn>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden sm:block" />

        <div className="space-y-3">
          {(roadmap as Array<{ week: number; title: string; topics: string[]; problems: number; difficulty: string; tips: string }>).map((week, idx) => (
            <div key={week.week} className="relative sm:pl-12 stagger-item" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="absolute left-3 top-5 h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-background hidden sm:block transition-transform duration-200 hover:scale-125 hover:bg-primary/20" />

              <div className="rounded-xl border border-border p-6 bg-card hover:border-primary/20 hover:bg-accent/30 transition-all duration-200 card-interactive group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="inline-flex items-center text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      Week {week.week}
                    </span>
                    <h3 className="text-lg font-bold mt-2.5 group-hover:text-primary transition-colors">{week.title}</h3>
                  </div>
                  <Target className="h-4 w-4 text-muted-foreground/20 shrink-0 mt-1" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {week.topics.map((topic) => (
                    <span key={topic} className="text-[11px] bg-muted text-muted-foreground px-2.5 py-1 rounded-lg font-medium">{topic}</span>
                  ))}
                </div>

                {week.problems > 0 && (
                  <p className="text-xs text-muted-foreground mb-3 font-medium">
                    <span className="font-bold text-foreground">{week.problems} problems</span> &middot; {week.difficulty}
                  </p>
                )}

                {week.tips && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-primary">Tip: </span>{week.tips}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
