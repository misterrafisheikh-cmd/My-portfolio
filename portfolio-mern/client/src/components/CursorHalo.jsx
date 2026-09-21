import { useEffect, useRef } from "react";

// A soft light that follows the mouse — mouse/fine-pointer only,
// invisible on touch devices.
export default function CursorHalo() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      el.style.opacity = "1";
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[-1] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500"
      style={{ background: "radial-gradient(circle, var(--blue-soft), transparent 66%)" }}
    />
  );
}
