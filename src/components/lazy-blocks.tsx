"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The 3D code is only downloaded when it is needed:
// - on screens at least 768px wide
// - when the user has not asked for reduced motion
// - when the box is about to scroll into view
const BlocksScene = dynamic(() => import("./blocks-scene"), { ssr: false });

export function LazyBlocks() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const el = ref.current;
    if (reduce || !wide || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="hidden h-64 w-full md:block md:h-80">
      {show ? <BlocksScene /> : null}
    </div>
  );
}