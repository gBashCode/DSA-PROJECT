"use client";

import React from "react";
import { motion } from "motion/react";

interface ProgressiveBlurProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  intensity?: "light" | "medium" | "heavy";
}

export function ProgressiveBlur({
  children,
  className = "",
  blur = 8,
  intensity = "medium",
}: ProgressiveBlurProps) {
  const intensityMap = {
    light: { blur: 4, opacity: 0.3 },
    medium: { blur: 8, opacity: 0.5 },
    heavy: { blur: 16, opacity: 0.7 },
  };

  const config = intensityMap[intensity];

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, filter: `blur(${blur * 2}px)` }}
      animate={{ opacity: 1, filter: `blur(0px)` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden">
        {children}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, transparent 60%, var(--background) 100%)`,
            filter: `blur(${config.blur}px)`,
            opacity: config.opacity,
          }}
        />
      </div>
    </motion.div>
  );
}
