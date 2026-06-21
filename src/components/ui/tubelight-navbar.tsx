"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface TubelightNavbarProps {
  items: NavItem[];
  className?: string;
}

export function TubelightNavbar({ items, className = "" }: TubelightNavbarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <nav className={cn("relative flex items-center gap-1 p-1 rounded-xl bg-muted/50", className)}>
      {items.map((item, index) => (
        <button
          key={item.label}
          onClick={() => setActiveIndex(index)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
            activeIndex === index
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeIndex === index && (
            <motion.div
              layoutId="tubelight"
              className="absolute inset-0 bg-primary rounded-lg"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
