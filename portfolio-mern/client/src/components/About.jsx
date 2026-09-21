import { useReveal } from "../hooks/useReveal.js";
import { useCountUp } from "../hooks/useCountUp.js";
import { useEffect, useState } from "react";
import SectionHead from "./SectionHead.jsx";
import rafi from "./images/rafi.png";



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
  const headRef = useReveal();
  const cardRef = useReveal();
  const textRef = useReveal();

  return (
    <section id="about" className="py-[110px]">
      <div className="mx-auto w-[min(1180px,100%-44px)]">
        <SectionHead
          revealRef={headRef}
          tag="01 — About"
          title={<>Full Stack Mern Developer,<br /></>}
          blurb="I develope Mern Websites and reaseching About Ai/Ml and peor Mathematic."
        />

        {/* _________profile image______ */}


        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <div ref={cardRef} className="rv panel relative overflow-hidden p-6">
            <div className="aspect-square grid place-items-center rounded-[10px] border text-[clamp(3rem,9vw,4.4rem)] font-bold tracking-[-.06em]"
              style={{ borderColor: "var(--line)", background: "radial-gradient(circle at 30% 25%, var(--blue-soft), transparent 60%), linear-gradient(160deg, rgba(120,158,224,.12), transparent)" }}>
              <img 
        src={rafi}
        alt="Profile" 
        className="w-full h-full object-cover"
      />
            </div>
            <dl className="mt-[22px] grid gap-3 font-mono text-[0.86rem]">
              {[
                ["Based in", "Dhaka, Bangladesh"],
                ["Focus", "Full-stack · Web"],
                ["Working since", "2026"],
                ["Availability", "Freelance / Full-time"],
              ].map(([dt, dd]) => (
                <div key={dt} className="flex justify-between gap-4 border-b border-dashed pb-2.5" style={{ borderColor: "var(--line)" }}>
                  <dt className="m-0" style={{ color: "var(--faint)" }}>{dt}</dt>
                  <dd className="m-0 text-right">{dd}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ___About Myself____ */}

          <div ref={textRef} className="rv">
            <div className="space-y-[18px]" style={{ color: "var(--muted)" }}>
              <p>I'm Rafi, a passionate Full Stack MERN Developer and an undergraduate student pursuing a Bachelor of Science in Mathematics. My academic background has strengthened my analytical thinking and problem-solving abilities, which I apply to both software development and artificial intelligence research.</p>
              <p>I specialize in building modern, responsive, and scalable web applications using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). I enjoy creating clean user interfaces, designing efficient backend systems, developing RESTful APIs, and turning ideas into practical, real-world applications.</p>
              <p>Alongside web development, I am deeply interested in Artificial Intelligence and Machine Learning. I am actively exploring deep learning, natural language processing, computer vision, and data-driven solutions while working on research-oriented projects and participating in machine learning competitions. My goal is to combine mathematics, software engineering, and AI to develop intelligent systems that solve meaningful real-world problems.</p>

              <p>I believe in continuous learning, writing clean and maintainable code, and staying updated with modern technologies. Every project I build is an opportunity to improve my technical skills and gain practical experience. My long-term goal is to contribute to impactful AI research while building innovative software products that make a difference.</p>
            </div>
            <div className="mt-[38px] grid grid-cols-3 gap-4">
              <Stat n={15} label="projects shipped" />
              <Stat n={0.6} suffix="+" label="years building" />
              <Stat n={13} label="happy clients" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
