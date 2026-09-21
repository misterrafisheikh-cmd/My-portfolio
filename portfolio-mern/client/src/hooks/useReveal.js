import { useEffect, useRef } from "react";

// Attach to any section wrapper: className={`rv ${ref...}`} — adds "in"
// once the element crosses into view, then stops observing it.
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
