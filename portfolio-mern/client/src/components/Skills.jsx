// ============================================================
// Skills — the "02 — Skills" section: three cards (Interface/Systems/
// Delivery by default, but fully editable), each with animated
// percentage bars, plus a scrolling ticker of tech names at the
// bottom. Bar widths animate from 0% to their real value the moment
// the card scrolls into view (see the MutationObserver watching for
// the "in" class that useReveal adds).
// ============================================================
import { useEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal.js";
import { useContent } from "../context/ContentContext.jsx";
import SectionHead from "./SectionHead.jsx";

function Meter({ name, level, pct, groupInView }) {
  return (
    <div className="mb-[18px]">
      <div className="mb-2 flex justify-between text-[0.85rem]">
        <span>{name}</span>
        <em className="not-italic text-[0.78rem]" style={{ color: "var(--faint)" }}>{level}</em>
      </div>
      <div className="h-[5px] overflow-hidden rounded-[3px]" style={{ background: "var(--line)" }}>
        <div
          className="h-full rounded-[3px] transition-[width] duration-[1150ms] ease-out"
          style={{ width: groupInView ? `${pct}%` : "0%", background: "linear-gradient(90deg, var(--signal), var(--blue))" }}
        />
      </div>
    </div>
  );
}

function SkillCard({ group }) {
  const ref = useReveal();
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new MutationObserver(() => { if (el.classList.contains("in")) setInView(true); });
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [ref]);

  return (
    <div ref={ref} className="rv panel p-6">
      <h3 className="m-0 mb-1 text-[1.06rem] font-semibold tracking-[-.02em]">{group.title}</h3>
      <p className="mb-[22px] font-mono text-[0.84rem]" style={{ color: "var(--faint)" }}>{group.subtitle}</p>
      {group.items.map((s) => (
        <Meter key={s.name} {...s} groupInView={inView} />
      ))}
    </div>
  );
}

export default function Skills() {
  const { skills } = useContent();
  const headRef = useReveal();
  const mqRef = useReveal();
  const items = [...skills.marquee, ...skills.marquee];

  return (
    <section id="skills" className="py-[110px]">
      <div className="mx-auto w-[min(1180px,100%-44px)]">
        <SectionHead
          revealRef={headRef}
          tag="02 — Skills"
          title="What I reach for"
          blurb="Depth where it counts, working knowledge everywhere else. No tool listed here is one I've only read about."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.groups.map((g) => <SkillCard key={g.title} group={g} />)}
        </div>

        <div
          ref={mqRef}
          className="rv group mt-[34px] overflow-hidden border-y py-4"
          style={{
            borderColor: "var(--line)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <ul className="flex w-max animate-slide list-none gap-11 p-0 m-0 group-hover:[animation-play-state:paused] font-mono">
            {items.map((item, i) => (
              <li key={i} className="whitespace-nowrap text-[0.88rem]" style={{ color: "var(--faint)" }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
