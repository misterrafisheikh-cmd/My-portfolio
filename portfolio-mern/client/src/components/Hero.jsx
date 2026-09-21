import { useEffect, useState } from "react";
import FourierCanvas from "./FourierCanvas.jsx";
import { useTypedText } from "../hooks/useTypedText.js";
import { toast } from "./Toast.jsx";



const ROLES = ["full-stack engineer", "interface builder", "systems tinkerer", "problem chaser"];
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@*+=<>/\\|";
const NAME = "Rafi Sheikh";
const LEDE =
  "I build web software the way a signal gets cleaned up: strip the noise, keep the shape, make every layer do one job well. Front-end that feels instant, back-end that holds under load.";
const CIPHER_NAME = "K9XQ VF2MTP";
const CIPHER_LEDE = "Payload sealed. AES-256-GCM, key held client-side. Press decrypt to restore the plaintext.";

function useScramble(finalText) {
  const [text, setText] = useState(finalText);
  const run = (target, dur = 900) => {
    const len = Math.max(target.length, text.length);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      let out = "";
      for (let i = 0; i < len; i++) {
        if (i < target.length && i / len < p) out += target[i];
        else if (i < target.length || p < 1) out += CHARS[(Math.random() * CHARS.length) | 0];
      }
      setText(out);
      if (p < 1) requestAnimationFrame(step);
      else setText(target);
    };
    requestAnimationFrame(step);
  };
  return [text, run];
}

// Harmonic count driven by hero scroll depth — feeds FourierCanvas.
function useHarmonics() {
  const [n, setN] = useState(7);
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("home")?.getBoundingClientRect();
      if (!hero) return;
      const p = Math.min(1, Math.max(0, -hero.top / Math.max(1, hero.height)));
      setN(Math.max(2, Math.round(7 - p * 5)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return n;
}

export default function Hero() {
  const role = useTypedText(ROLES);
  const harmonics = useHarmonics();
  const [encrypted, setEncrypted] = useState(false);
  const [nameText, scrambleName] = useScramble(NAME);
  const [ledeText, scrambleLede] = useScramble(LEDE);

  const handleEncrypt = () => {
    const next = !encrypted;
    setEncrypted(next);
    if (next) {
      scrambleName(CIPHER_NAME, 900);
      scrambleLede(CIPHER_LEDE, 1100);
      toast("Encrypted — nothing left the browser.");
    } else {
      scrambleName(NAME, 900);
      scrambleLede(LEDE, 1100);
      toast("Decrypted.");
    }
  };

  return (
    <section id="home" className="relative grid min-h-[100svh] items-center overflow-hidden p-0">
      <FourierCanvas harmonics={harmonics} />
      <p
        className="absolute bottom-[16%] right-[4%] z-[1] hidden whitespace-nowrap font-mono text-[0.8rem] opacity-75 lg:block"
        style={{ color: "var(--faint)" }}
      >
        f(x) = 4/π Σ [1/(2n−1)] sin((2n−1)x)
      </p>

      <div className="relative z-[2] mx-auto w-[min(1180px,100%-44px)] pb-[90px] pt-[150px]">
        <div className="max-w-[640px]">
          <span
            className="inline-flex items-center gap-2.5 rounded-full border py-1.5 pl-2.5 pr-3.5 font-mono text-[0.78rem]"
            style={{ borderColor: "var(--line)", background: "var(--panel)", color: "var(--muted)" }}
          >
            <span className="h-[7px] w-[7px] animate-pulse2 rounded-full" style={{ background: "var(--signal)", boxShadow: "0 0 0 4px rgba(61,220,132,.16)" }} />
            Open to work · Dhaka, BD
          </span>

          <h1 className="mt-5 text-[clamp(2.7rem,7.4vw,5.1rem)] font-bold leading-[.98] tracking-[-.045em]">
            {nameText}
          </h1>

          <p className="mt-5 min-h-[1.7em] font-mono text-[clamp(1rem,2.3vw,1.28rem)]" style={{ color: "var(--muted)" }}>
            &gt; <b style={{ color: "var(--text)", fontWeight: 600 }}>{role}</b>
            <span className="animate-blink" style={{ color: "var(--phase)" }}>▍</span>
          </p>

          <p className="mt-5 max-w-[50ch]" style={{ color: "var(--muted)" }}>{ledeText}</p>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <button
              onClick={handleEncrypt}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_14px_34px_-16px_rgba(79,141,255,.9)] transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[17px] w-[17px]">
                <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
                <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
              </svg>
              {encrypted ? "Decrypt" : "Encrypt"}
            </button>
            <a
              href="#projects"
              className="inline-flex items-center gap-2.5 rounded-full border px-6 py-3.5 text-[0.95rem] font-semibold transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--line-strong)", background: "var(--panel)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[17px] w-[17px]">
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              See the work
            </a>
          </div>

          <div className="mt-[54px] flex flex-wrap gap-x-[30px] gap-y-2.5 font-mono text-[0.76rem] tracking-wide" style={{ color: "var(--faint)" }}>
            <span>harmonics <b style={{ color: "var(--signal)", fontWeight: 500 }}>{harmonics}</b></span>
            <span>sample rate <b style={{ color: "var(--signal)", fontWeight: 500 }}>60 Hz</b></span>
            <span>build <b style={{ color: "var(--signal)", fontWeight: 500 }}>v2.6.0</b></span>
            <span>status <b style={{ color: "var(--signal)", fontWeight: 500 }}>listening</b></span>
             
          </div>
        </div>
      </div>
    </section>
  );
}
