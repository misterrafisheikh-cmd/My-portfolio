import { useEffect, useState } from "react";

// Returns { pct, scrolled } — percent of page scrolled, and whether
// the user has scrolled past a small threshold (for shrinking the navbar).
export function useScrollProgress() {
  const [pct, setPct] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (y / h) * 100 : 0);
      setScrolled(y > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { pct, scrolled };
}
