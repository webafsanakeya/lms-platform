"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";

// Fades and flips an element up into place the first time it scrolls into view.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial={reduce ? false : { opacity: 0, y: 40, rotateX: 14 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        style={{ transformPerspective: 800 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}