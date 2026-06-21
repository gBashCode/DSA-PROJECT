"use client";

import { useState } from "react";
import { Network, Layers, Box, ChevronDown, ChevronUp, BookOpen, Zap } from "lucide-react";
import fundamentals from "@/data/system-design/fundamentals.json";
import components from "@/data/system-design/components.json";
import caseStudies from "@/data/system-design/case-studies.json";
import type { SystemDesignTopic } from "@/lib/types";

interface TierSection {
  tier: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  topics: SystemDesignTopic[];
}

const tierSections: TierSection[] = [
  {
    tier: "fundamentals",
    title: "Fundamentals",
    description: "Core concepts every engineer must know for system design interviews.",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-accent-teal",
    bgColor: "bg-accent-teal/10",
    topics: fundamentals as SystemDesignTopic[],
  },
  {
    tier: "components",
    title: "Components",
    description: "Building blocks of distributed systems — databases, caches, queues, and more.",
    icon: <Layers className="w-5 h-5" />,
    color: "text-accent-amber",
    bgColor: "bg-accent-amber/10",
    topics: components as SystemDesignTopic[],
  },
  {
    tier: "case-studies",
    title: "Case Studies",
    description: "Real-world system design walkthroughs for popular applications.",
    icon: <Box className="w-5 h-5" />,
    color: "text-accent-rose",
    bgColor: "bg-accent-rose/10",
    topics: caseStudies as SystemDesignTopic[],
  },
];

export default function SystemDesignPage() {
  const [expandedTier, setExpandedTier] = useState<string | null>("fundamentals");
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const totalTopics = tierSections.reduce((sum, s) => sum + s.topics.length, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-accent-amber/10">
            <Network className="w-6 h-6 text-accent-amber" />
          </div>
          <div>
            <h1 className="text-3xl font-mono font-bold text-text">System Design</h1>
            <p className="text-sm font-mono text-text-muted">{totalTopics} topics across 3 levels</p>
          </div>
        </div>
        <p className="text-base font-mono text-text-muted max-w-2xl">
          Master the architecture behind scalable, reliable distributed systems. Start with fundamentals, build components knowledge, then apply to real-world case studies.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6 p-4 rounded-xl border border-border bg-surface">
        <Zap className="w-5 h-5 text-accent-amber" />
        <p className="text-sm font-mono text-text-muted">
          <span className="text-text font-semibold">Suggested path:</span> Fundamentals → Components → Case Studies
        </p>
      </div>

      <div className="space-y-4">
        {tierSections.map((section) => {
          const isExpanded = expandedTier === section.tier;
          return (
            <div key={section.tier} className="rounded-xl border border-border bg-surface overflow-hidden">
              <button
                onClick={() => setExpandedTier(isExpanded ? null : section.tier)}
                className="w-full flex items-center justify-between p-5 hover:bg-bg/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${section.bgColor} ${section.color}`}>
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-mono font-bold text-text">{section.title}</h2>
                    <p className="text-xs font-mono text-text-muted">{section.topics.length} topics</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4 space-y-3">
                  <p className="text-sm font-mono text-text-muted mb-4">{section.description}</p>
                  {section.topics.map((topic) => {
                    const isTopicExpanded = expandedTopic === topic.slug;
                    return (
                      <div key={topic.slug} className="rounded-lg border border-border bg-bg overflow-hidden">
                        <button
                          onClick={() => setExpandedTopic(isTopicExpanded ? null : topic.slug)}
                          className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${section.color.replace("text-", "bg-")}`} />
                            <span className="text-sm font-mono font-semibold text-text">{topic.name}</span>
                          </div>
                          {isTopicExpanded ? (
                            <ChevronUp className="w-4 h-4 text-text-muted" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-text-muted" />
                          )}
                        </button>

                        {isTopicExpanded && (
                          <div className="px-4 pb-4 space-y-4">
                            <p className="text-sm font-mono text-text-muted">{topic.description}</p>

                            {topic.keyPoints && (
                              <div>
                                <h4 className="text-xs font-mono font-semibold text-text-muted mb-2 uppercase tracking-wider">Key Points</h4>
                                <ul className="space-y-1.5">
                                  {topic.keyPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs font-mono text-text">
                                      <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${section.color.replace("text-", "bg-")}`} />
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {topic.whenToUse && (
                              <div className="p-3 rounded-lg bg-accent-teal/5 border border-accent-teal/20">
                                <h4 className="text-xs font-mono font-semibold text-accent-teal mb-1">When to Use</h4>
                                <p className="text-xs font-mono text-text-muted">{topic.whenToUse}</p>
                              </div>
                            )}

                            {topic.interviewQuestions && (
                              <div>
                                <h4 className="text-xs font-mono font-semibold text-text-muted mb-2 uppercase tracking-wider">Interview Questions</h4>
                                <div className="space-y-1.5">
                                  {topic.interviewQuestions.map((q, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs font-mono text-text-muted">
                                      <span className="text-accent-amber">Q{i + 1}.</span>
                                      {q}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {topic.companies && (
                              <div className="flex flex-wrap gap-1.5">
                                {topic.companies.map((company) => (
                                  <span key={company} className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent-amber/10 text-accent-amber">
                                    {company}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
