"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

interface InfiniteSliderProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  gap?: number;
}

export function InfiniteSlider({
  children,
  className = "",
  speed = 30,
  gap = 16,
}: InfiniteSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const contentWidth = content.scrollWidth;
    const containerWidth = container.offsetWidth;

    if (contentWidth <= containerWidth) return;

    const animate = () => {
      const currentX = x.get();
      const newX = currentX - speed * 0.01;

      if (Math.abs(newX) >= contentWidth / 2) {
        x.set(0);
      } else {
        x.set(newX);
      }
    };

    const interval = setInterval(animate, 1000 / 60);
    return () => clearInterval(interval);
  }, [speed, x]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        ref={contentRef}
        className="flex"
        style={{ x, gap: `${gap}px` }}
      >
        <div className="flex" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
