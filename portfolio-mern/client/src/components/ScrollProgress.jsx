// ============================================================
// ScrollProgress — the thin colored line at the very top of the page
// that fills left-to-right as the visitor scrolls down. Purely visual.
// ============================================================
import { useScrollProgress } from "../hooks/useScrollProgress.js";

export default function ScrollProgress() {
  const { pct } = useScrollProgress();
  return (
    <div
      className="fixed left-0 top-0 z-[90] h-[2px] transition-[width] duration-100 ease-linear"
      style={{
        width: `${pct}%`,
        background: "linear-gradient(90deg, var(--signal), var(--blue), var(--phase))",
      }}
    />
  );
}
