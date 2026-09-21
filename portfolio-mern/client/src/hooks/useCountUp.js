import { useEffect, useState } from "react";

// Animates 0 -> target once `start` becomes true (pair with useReveal's
// visibility, or IntersectionObserver directly).
export function useCountUp(target, start, suffix = "") {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }
    const dur = 1300;
    const startTime = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min(1, (now - startTime) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);

  return `${value}${suffix}`;
}
