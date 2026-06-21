"use client";
import { type ReactNode } from "react";

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerList({ children, className = "", staggerDelay = 50 }: StaggerListProps) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              className="stagger-item"
              style={{ animationDelay: `${i * staggerDelay}ms` }}
            >
              {child}
            </div>
          ))
        : <div className="stagger-item">{children}</div>
      }
    </div>
  );
}
