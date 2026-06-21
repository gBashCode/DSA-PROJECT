"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface DockItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface MinimalDockProps {
  items: DockItem[];
  className?: string;
}

export function MinimalDock({ items, className = "" }: MinimalDockProps) {
  return (
    <motion.div
      className={`flex items-end gap-2 rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-2 ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {items.map((item, index) => (
        <DockItem key={item.label} item={item} index={index} />
      ))}
    </motion.div>
  );
}

function DockItem({ item, index }: { item: DockItem; index: number }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <motion.div
        className="flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200 hover:bg-accent"
        animate={{
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <item.icon className="w-5 h-5 text-foreground" />
      </motion.div>

      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs whitespace-nowrap"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -4 }}
        transition={{ duration: 0.15 }}
      >
        {item.label}
      </motion.div>
    </motion.div>
  );
}
