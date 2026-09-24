// ============================================================
// ProjectCard — one card in the Projects grid (Projects.jsx renders
// one of these per entry in the "projects" array from the database).
// Has a decorative animated line (ScopeTrace) behind the text, and a
// link at the bottom that either opens the real project (new tab) or,
// if no real link was given, jumps to the Contact section instead.
// ============================================================
import { useEffect, useRef } from "react";
import { useReveal } from "../hooks/useReveal.js";

// A faint, slowly-moving wavy line drawn behind each card's text —
// purely decorative. `seed` offsets each card's animation so they
// don't all move in sync. Pauses itself when the card scrolls off
// screen (via IntersectionObserver) so it's not wasting CPU everywhere.
function ScopeTrace({ seed }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let t = seed * 7, raf = null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, r.width * dpr);
      canvas.height = Math.max(1, r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function frame() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const col = getComputedStyle(document.documentElement).getPropertyValue("--blue").trim();
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      // Three overlapping sine waves at different speeds/sizes make the
      // line look organic instead of a plain repeating wiggle.
      for (let x = 0; x <= w; x += 4) {
        const y = h * 0.78 + Math.sin(x * 0.014 + t) * 10 + Math.sin(x * 0.031 + t * 1.7) * 5 + Math.sin(x * 0.007 - t * 0.6) * 14;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      t += 0.02;
      raf = requestAnimationFrame(frame);
    }
    size();
    if (!reduced) {
      const vis = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { if (!raf) frame(); }
        else if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
      vis.observe(canvas);
      window.addEventListener("resize", size);
      return () => { cancelAnimationFrame(raf); vis.disconnect(); window.removeEventListener("resize", size); };
    }
  }, [seed]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-50" />;
}

export default function ProjectCard({ project, index, hidden }) {
  const ref = useReveal();

  // A "real" link is one that points somewhere else on the web
  // (http/https). If the admin left it as "#contact" (the default) or
  // blank, we treat this project as not having a live link yet, and
  // send visitors to the Contact section instead of a broken/fake link.
  const hasRealLink = project.link && /^https?:\/\//i.test(project.link);

  return (
    <article
      ref={ref}
      // "hidden" here is a Tailwind class (display:none) — Projects.jsx
      // passes hidden=true for cards that don't match the active filter
      // chip (All / Web apps / Tools / Experiments).
      className={`rv panel relative flex flex-col gap-3.5 overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1.5 ${hidden ? "hidden" : ""}`}
    >
      <ScopeTrace seed={index} />

      <div className="relative z-[1] flex items-center justify-between gap-3">
        <h3 className="m-0 text-[1.22rem] font-semibold tracking-[-.025em]">{project.title}</h3>
        <span className="font-mono text-[0.72rem] tracking-[.1em]" style={{ color: "var(--faint)" }}>{project.year}</span>
      </div>

      <p className="relative z-[1] m-0 text-[0.92rem]" style={{ color: "var(--muted)" }}>{project.description}</p>

      {/* The tech-stack tags (e.g. "React", "Node") — edited as a
          comma-separated list in the admin Projects tab. */}
      <div className="relative z-[1] mt-auto flex flex-wrap gap-1.5 pt-1.5 font-mono">
        {project.stack.map((s) => (
          <b key={s} className="rounded-[6px] border px-2.5 py-1 text-[0.73rem] font-medium" style={{ borderColor: "var(--line)", color: "var(--faint)" }}>{s}</b>
        ))}
      </div>

      {hasRealLink ? (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="group relative z-[1] inline-flex items-center gap-1.5 text-[0.86rem] font-semibold"
          style={{ color: "var(--blue)" }}
        >
          View project
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      ) : (
        <a href="#contact" className="group relative z-[1] inline-flex items-center gap-1.5 text-[0.86rem] font-semibold" style={{ color: "var(--blue)" }}>
          Ask about this project
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      )}
    </article>
  );
}
