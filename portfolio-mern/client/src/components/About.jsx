// ============================================================
// About — the "01 — About" section: photo/identity card on the left,
// bio paragraphs and the three animated stat counters on the right.
// All the text and numbers come from the database (useContent), edited
// from /admin/content's "About" tab — nothing here is hardcoded text.
// ============================================================
import { useEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal.js";
import { useCountUp } from "../hooks/useCountUp.js";
import { useContent } from "../context/ContentContext.jsx";
import SectionHead from "./SectionHead.jsx";

function Stat({ n, suffix = "", label }) {
  const ref = useReveal();
  const [start, setStart] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new MutationObserver(() => { if (el.classList.contains("in")) setStart(true); });
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [ref]);
  const value = useCountUp(n, start, suffix);
  return (
    <div ref={ref} className="rv rounded-[14px] border p-5" style={{ borderColor: "var(--line)", background: "var(--panel)" }}>
      <b className="block text-[clamp(1.7rem,4vw,2.3rem)] font-bold leading-none tracking-[-.04em]">{value}</b>
      <span className="text-[0.78rem]" style={{ color: "var(--faint)" }}>{label}</span>
    </div>
  );
}

export default function About() {
  const { about, hero } = useContent();
  const headRef = useReveal();
  const cardRef = useReveal();
  const textRef = useReveal();
  const initials = hero.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "RS";

  return (
    <section id="about" className="py-[110px]">
      <div className="mx-auto w-[min(1180px,100%-44px)]">
        <SectionHead
          revealRef={headRef}
          tag="01 — About"
          title={<>Engineer first,<br />designer by necessity.</>}
          blurb={about.blurb}
        />
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <div ref={cardRef} className="rv panel relative overflow-hidden p-6">
            <div className="aspect-square overflow-hidden rounded-[10px] border grid place-items-center text-[clamp(3rem,9vw,4.4rem)] font-bold tracking-[-.06em]"
              style={{ borderColor: "var(--line)", background: "radial-gradient(circle at 30% 25%, var(--blue-soft), transparent 60%), linear-gradient(160deg, rgba(120,158,224,.12), transparent)" }}>
              {about.avatarUrl ? (
                <img src={about.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <dl className="mt-[22px] grid gap-3 font-mono text-[0.86rem]">
              {about.identity.map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4 border-b border-dashed pb-2.5" style={{ borderColor: "var(--line)" }}>
                  <dt className="m-0" style={{ color: "var(--faint)" }}>{label}</dt>
                  <dd className="m-0 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div ref={textRef} className="rv">
            <div className="space-y-[18px]" style={{ color: "var(--muted)" }}>
              {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-[38px] grid grid-cols-3 gap-4">
              {about.stats.map((s) => (
                <Stat key={s.label} n={s.value} suffix={s.suffix} label={s.label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
