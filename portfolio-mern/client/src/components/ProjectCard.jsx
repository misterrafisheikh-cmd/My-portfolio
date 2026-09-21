import { useEffect, useRef } from "react";
import { useReveal } from "../hooks/useReveal.js";

// Each card gets its own faint animated "scope trace" canvas behind the
// content — purely decorative, phase-offset by `seed` so cards don't sync.
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
  return (
    <article
      ref={ref}
      className={`rv panel relative flex flex-col gap-3.5 overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1.5 ${hidden ? "hidden" : ""}`}
    >
      <ScopeTrace seed={index} />
      <div className="relative z-[1] flex items-center justify-between gap-3">
        <h3 className="m-0 text-[1.22rem] font-semibold tracking-[-.025em]">{project.title}</h3>
        <span className="font-mono text-[0.72rem] tracking-[.1em]" style={{ color: "var(--faint)" }}>{project.year}</span>
      </div>
      <p className="relative z-[1] m-0 text-[0.92rem]" style={{ color: "var(--muted)" }}>{project.description}</p>
      <div className="relative z-[1] mt-auto flex flex-wrap gap-1.5 pt-1.5 font-mono">
        {project.stack.map((s) => (
          <b key={s} className="rounded-[6px] border px-2.5 py-1 text-[0.73rem] font-medium" style={{ borderColor: "var(--line)", color: "var(--faint)" }}>{s}</b>
        ))}
      </div>
      <a href={project.link} className="group relative z-[1] inline-flex items-center gap-1.5 text-[0.86rem] font-semibold" style={{ color: "var(--blue)" }}>
        Read the case study
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </a>
    </article>
  );
}
