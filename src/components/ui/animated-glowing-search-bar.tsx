"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface AnimatedGlowingSearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function AnimatedGlowingSearchBar({
  placeholder = "Search...",
  onSearch,
  className = "",
}: AnimatedGlowingSearchBarProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={false}
      animate={{
        boxShadow: isFocused
          ? "0 0 0 2px rgba(109, 40, 217, 0.3), 0 0 20px rgba(109, 40, 217, 0.15)"
          : "0 0 0 1px rgba(109, 40, 217, 0.1), 0 0 0 0 rgba(109, 40, 217, 0)",
      }}
      transition={{ duration: 0.2 }}
      style={{ borderRadius: "0.75rem" }}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onSearch?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background"
        />
        {value && (
          <button
            onClick={() => {
              setValue("");
              onSearch?.("");
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
    </motion.div>
  );
}
