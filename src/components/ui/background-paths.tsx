"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface BackgroundPathsProps {
  className?: string;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function BackgroundPaths({ className = "" }: BackgroundPathsProps) {
  const paths = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 12 }, (_, i) => {
      const startX = rand() * 1000;
      const startY = rand() * 1000;
      const midX1 = rand() * 1000;
      const midY1 = rand() * 1000;
      const midX2 = rand() * 1000;
      const midY2 = rand() * 1000;
      const endX = rand() * 1000;
      const endY = rand() * 1000;
      return {
        id: i,
        d: `M ${startX} ${startY} C ${midX1} ${midY1}, ${midX2} ${midY2}, ${endX} ${endY}`,
        strokeWidth: 0.5 + rand() * 1,
        opacity: 0.1 + rand() * 0.1,
        delay: i * 0.5,
      };
    });
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={path.strokeWidth}
            className="text-primary"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: path.opacity }}
            transition={{
              pathLength: {
                duration: 3,
                delay: path.delay,
                ease: "easeInOut",
              },
              opacity: {
                duration: 1,
                delay: path.delay,
              },
            }}
          />
        ))}
      </svg>
    </div>
  );
}
