import { useEffect, useRef } from "react";

// The hero's square-wave-from-epicycles animation. `harmonics` (2–7) is
// passed down from Hero.jsx, driven by scroll depth. Pure canvas — no
// state re-renders per frame, everything lives in refs/closures.
export default function FourierCanvas({ harmonics = 7 }) {
  const canvasRef = useRef(null);
  const harmonicsRef = useRef(harmonics);
  harmonicsRef.current = harmonics;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let wave = [], ghost3 = [], ghost2 = [];
    let time = 0, small = false, raf, running = true;
    const DT = 0.021;

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.max(1, W * dpr);
      canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = W < 820;
      wave = []; ghost3 = []; ghost2 = [];
    }

    function tokens() {
      const s = getComputedStyle(document.documentElement);
      return {
        signal: s.getPropertyValue("--signal").trim(),
        blue: s.getPropertyValue("--blue").trim(),
        phase: s.getPropertyValue("--phase").trim(),
        harm: s.getPropertyValue("--harm").trim(),
        faint: s.getPropertyValue("--faint").trim(),
        line: s.getPropertyValue("--line").trim(),
      };
    }

    function sumAt(count, base, t) {
      let x = 0, y = 0;
      for (let i = 0; i < count; i++) {
        const n = i * 2 + 1;
        const rad = base * (4 / (n * Math.PI));
        x += rad * Math.cos(n * t);
        y += rad * Math.sin(n * t);
      }
      return { x, y };
    }

    function draw() {
      const N = harmonicsRef.current;
      const c = tokens();
      ctx.clearRect(0, 0, W, H);

      const base = small ? Math.min(56, H * 0.1) : Math.min(92, H * 0.15);
      const cx = small ? W * 0.5 : W * 0.585;
      const cy = small ? H * 0.24 : H * 0.33;
      const gap = base + (small ? 26 : 52);
      const waveX = cx + gap;
      const maxLen = Math.max(10, Math.floor(W - waveX));

      ctx.save();
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(waveX, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      const per = (Math.PI / 2) / DT;
      ctx.fillStyle = c.faint;
      ctx.globalAlpha = 0.55;
      ctx.font = '9px "JetBrains Mono", monospace';
      for (let k = 1; waveX + k * per < W; k++) {
        const tx = waveX + k * per;
        ctx.fillRect(tx, cy - 3, 1, 6);
        if (k % 2 === 0) ctx.fillText(k / 2 === 1 ? "π" : `${k / 2}π`, tx - 6, cy + 16);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      let x = cx, y = cy;
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        const px = x, py = y, n = i * 2 + 1;
        const rad = base * (4 / (n * Math.PI));
        ctx.beginPath();
        ctx.strokeStyle = c.signal;
        ctx.globalAlpha = 0.16 + 0.34 / (i + 1);
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.stroke();
        x += rad * Math.cos(n * time);
        y += rad * Math.sin(n * time);
        ctx.beginPath();
        ctx.strokeStyle = c.phase;
        ctx.globalAlpha = 0.28 + 0.4 / (i + 1);
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      wave.unshift(y);
      const g3 = sumAt(3, base, time), g2 = sumAt(2, base, time);
      ghost3.unshift(cy + g3.y);
      ghost2.unshift(cy + g2.y);
      if (wave.length > maxLen) wave.pop();
      if (ghost3.length > maxLen) ghost3.pop();
      if (ghost2.length > maxLen) ghost2.pop();

      const trail = (arr, color, alpha, width) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        arr.forEach((py2, j) => {
          const px2 = waveX + j;
          j === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      };
      trail(ghost2, c.harm, 0.28, 1);
      trail(ghost3, c.signal, 0.32, 1);
      trail(wave, c.blue, 0.95, 1.8);

      ctx.beginPath();
      ctx.strokeStyle = c.phase;
      ctx.globalAlpha = 0.35;
      ctx.setLineDash([2, 4]);
      ctx.moveTo(x, y);
      ctx.lineTo(waveX, wave[0]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.fillStyle = c.blue;
      ctx.arc(waveX, wave[0], 2.6, 0, Math.PI * 2);
      ctx.fill();

      time += DT;
    }

    function loop() {
      if (running) draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    const onVis = () => { running = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    if (reduced) {
      for (let s = 0; s < 400; s++) time += DT;
      draw();
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full" />;
}
