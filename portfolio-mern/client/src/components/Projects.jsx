import { useState } from "react";
import { useReveal } from "../hooks/useReveal.js";
import { useContent } from "../context/ContentContext.jsx";
import ProjectCard from "./ProjectCard.jsx";
import Timeline from "./Timeline.jsx";
import ExtraSections from "./ExtraSections.jsx";
import SectionHead from "./SectionHead.jsx";

const filters = [
  { key: "all", label: "Everything" },
  { key: "web", label: "Web apps" },
  { key: "tool", label: "Tools" },
  { key: "lab", label: "Experiments" },
];

export default function Projects() {
  const { projects } = useContent();
  const headRef = useReveal();
  const [active, setActive] = useState("all");

  return (
    <section id="projects" className="py-[110px]">
      <div className="mx-auto w-[min(1180px,100%-44px)]">
        <SectionHead
          revealRef={headRef}
          tag="03 — Projects"
          title="Selected work"
          right={
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  aria-pressed={active === f.key}
                  className="rounded-full border px-4 py-2 text-[0.84rem] transition-colors"
                  style={{
                    borderColor: active === f.key ? "var(--blue)" : "var(--line)",
                    background: active === f.key ? "var(--blue-soft)" : "transparent",
                    color: active === f.key ? "var(--text)" : "var(--muted)",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} hidden={active !== "all" && p.category !== active} />
          ))}
        </div>

        <Timeline />
      </div>
      <ExtraSections />
    </section>
  );
}
