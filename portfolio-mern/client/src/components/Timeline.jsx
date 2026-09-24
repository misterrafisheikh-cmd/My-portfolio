// ============================================================
// Timeline — the career-history rows under the Projects grid. Reads
// the "timeline" array from the database (edited in /admin/content's
// "Timeline" tab) and renders one row per entry, each fading in as it
// scrolls into view.
// ============================================================
import { useReveal } from "../hooks/useReveal.js";
import { useContent } from "../context/ContentContext.jsx";

function Row({ item }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="rv grid grid-cols-1 gap-2 border-t py-6 last:border-b sm:grid-cols-[82px_1fr] sm:gap-6" style={{ borderColor: "var(--line)" }}>
      <div className="font-mono text-[0.82rem]" style={{ color: "var(--faint)" }}>{item.range}</div>
      <div>
        <h4 className="m-0 mb-1.5 text-[1.05rem] font-semibold">{item.role}</h4>
        <p className="m-0 max-w-[64ch] text-[0.92rem]" style={{ color: "var(--muted)" }}>{item.detail}</p>
      </div>
    </div>
  );
}

export default function Timeline() {
  const { timeline } = useContent();
  return (
    <div className="mt-[70px]">
      {timeline.map((item, i) => <Row key={i} item={item} />)}
    </div>
  );
}
