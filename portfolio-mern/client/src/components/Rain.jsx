import { useEffect, useRef } from "react";

// Rain that emerges from the navbar's wave edge and falls down the page.
// Reads the --rain CSS variable so it re-colors automatically with theme.
export default function Rain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rw = 0, rh = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let drops = [], splashes = [], line = 120, wind = 0.35, target = 0.35, windT = 0;
    let raf;

    const count = () => (rw < 640 ? 46 : rw < 1100 ? 78 : 120);

    function seam() {
      const wave = document.querySelector("[data-wave-edge]");
      if (!wave) return;
      const r = wave.getBoundingClientRect();
      line = r.top + r.height * 0.62;
    }

    function spawn(d, fresh) {
      d.x = Math.random() * (rw + 180) - 90;
      d.y = fresh ? line + Math.random() * rh : line - Math.random() * 40;
      d.z = Math.random();
      d.len = 7 + d.z * 22;
      d.sp = 2.6 + d.z * 9.5;
      d.a = 0.1 + d.z * 0.42;
      return d;
    }

    function size() {
      const r = canvas.getBoundingClientRect();
      rw = r.width; rh = r.height;
      canvas.width = Math.max(1, rw * dpr);
      canvas.height = Math.max(1, rh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seam();
      drops = [];
      for (let i = 0; i < count(); i++) drops.push(spawn({}, true));
    }

    let col = "rgba(150,195,255,.5)";
    function readColor() {
      col = getComputedStyle(document.documentElement).getPropertyValue("--rain").trim() || col;
    }
    function rgb() {
      const m = col.match(/rgba?\(([^)]+)\)/);
      return m ? `rgba(${m[1].split(",").slice(0, 3).join(",")},` : "rgba(150,195,255,";
    }

    readColor();
    const themeObserver = new MutationObserver(readColor);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    function frame() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, rw, rh);
        const base = rgb();

        windT += 0.004;
        target = Math.sin(windT) * 1.4 + Math.sin(windT * 2.3) * 0.5;
        wind += (target - wind) * 0.02;

        ctx.lineCap = "round";
        for (const d of drops) {
          const fade = d.y < line + 26 ? Math.max(0, (d.y - line) / 26) : 1;
          const tail = d.y > rh - 120 ? Math.max(0, (rh - d.y) / 120) : 1;
          ctx.strokeStyle = base + (d.a * fade * tail).toFixed(3) + ")";
          ctx.lineWidth = 0.6 + d.z * 1.1;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - wind * d.z * 2.4, d.y - d.len);
          ctx.stroke();

          d.y += d.sp;
          d.x += wind * d.z * 0.9;

          if (d.y - d.len > rh) {
            if (d.z > 0.72 && splashes.length < 24) {
              splashes.push({ x: d.x, y: rh - 6 - Math.random() * 14, r: 1, a: d.a * 0.8 });
            }
            spawn(d, false);
          }
        }

        for (let j = splashes.length - 1; j >= 0; j--) {
          const s = splashes[j];
          s.r += 0.9;
          s.a -= 0.022;
          if (s.a <= 0) { splashes.splice(j, 1); continue; }
          ctx.strokeStyle = base + s.a.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.r * 2.2, s.r * 0.6, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    frame();
    window.addEventListener("resize", size);
    window.addEventListener("scroll", seam, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("scroll", seam);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[6] h-full w-full"
    />
  );
}
