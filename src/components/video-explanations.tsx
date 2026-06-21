"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";

interface Video {
  title: string;
  url: string;
  channel: string;
  duration?: string;
}

interface VideoExplanationsProps {
  problemTitle: string;
  videos?: Video[];
}

function generateYouTubeSearchUrl(title: string): string {
  const query = encodeURIComponent(`${title} leetcode solution explanation`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

export function VideoExplanations({ problemTitle, videos }: VideoExplanationsProps) {
  const [expanded, setExpanded] = useState(false);

  const defaultVideo: Video = {
    title: `Search "${problemTitle}" on YouTube`,
    url: generateYouTubeSearchUrl(problemTitle),
    channel: "YouTube",
  };

  const videoList = videos && videos.length > 0 ? videos : [defaultVideo];

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-mono text-accent-rose hover:text-accent-rose/80 transition-colors"
      >
        <Play className="w-3.5 h-3.5" />
        Video Solutions ({videoList.length})
      </button>

      {expanded && (
        <div className="space-y-2 mt-2">
          {videoList.map((video, i) => (
            <a
              key={i}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-lg border border-border bg-surface hover:border-accent-rose/30 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-accent-rose/10 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-accent-rose" />
                </div>
                <div>
                  <p className="text-xs font-mono text-text group-hover:text-accent-rose transition-colors">{video.channel}</p>
                  {video.duration && (
                    <p className="text-[10px] font-mono text-text-muted">{video.duration}</p>
                  )}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-rose transition-colors" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
