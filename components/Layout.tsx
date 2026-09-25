"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";

interface LayoutProps {
  mode: "home" | "query";
  children: ReactNode;
}

type Rect = { left: number; top: number; width: number; height: number };

const SELECTORS = [
  '[data-flip="brand"]',
  '[data-flip="navigation"]',
  '[data-flip="search"]',
  '[data-flip="content"]',
  '[data-flip="footer"]',
];

function measure(root: HTMLElement | null) {
  if (!root) return new Map<string, Rect>();
  const result = new Map<string, Rect>();
  for (const selector of SELECTORS) {
    const el = root.querySelector<HTMLElement>(selector);
    if (!el) continue;
    const key = el.dataset.flip;
    if (!key) continue;
    const r = el.getBoundingClientRect();
    result.set(key, { left: r.left, top: r.top, width: r.width, height: r.height });
  }
  return result;
}

export default function Layout({ mode, children }: LayoutProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const previousRef = useRef<Map<string, Rect>>(new Map());

  useEffect(() => {
    previousRef.current = measure(rootRef.current);
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const previous = previousRef.current;
    if (!root || previous.size === 0) return;

    const elements = SELECTORS
      .map((selector) => root.querySelector<HTMLElement>(selector))
      .filter((el): el is HTMLElement => Boolean(el));

    const animations: Animation[] = [];

    for (const el of elements) {
      const key = el.dataset.flip;
      if (!key) continue;
      const from = previous.get(key);
      if (!from) continue;

      const to = el.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      const sx = from.width / Math.max(to.width, 1);
      const sy = from.height / Math.max(to.height, 1);

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) {
        continue;
      }

      const animation = el.animate(
        [
          { transformOrigin: "top left", transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
          { transformOrigin: "top left", transform: "translate(0, 0) scale(1, 1)" },
        ],
        {
          duration: 0,
          easing: "cubic-bezier(.2,.75,.25,1)",
          fill: "both",
        },
      );
      animations.push(animation);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) animations.forEach((animation) => animation.cancel());

    return () => animations.forEach((animation) => animation.cancel());
  }, [mode]);

  return (
    <div ref={rootRef} className={mode === "home" ? "page-transition home-state" : "page-transition query-state"}>
      {children}
    </div>
  );
}
