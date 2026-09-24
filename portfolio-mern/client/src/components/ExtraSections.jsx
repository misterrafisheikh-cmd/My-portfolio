import { Link } from "react-router-dom";
import { useReveal } from "../hooks/useReveal.js";
import { useContent } from "../context/ContentContext.jsx";
import SectionHead from "./SectionHead.jsx";

// Four layouts an admin-added section can use — chosen per section from
// the dashboard's Sections tab (see pages/AdminContent.jsx). Each reads
// the same `section.items` shape ({ title, description, link, body })
// but only uses the fields that layout needs.

function TextLayout({ section }) {
  return (
    <div className="panel p-6 md:p-8">
      {section.body && <p className="m-0 mb-4 max-w-[70ch]" style={{ color: "var(--muted)" }}>{section.body}</p>}
      {section.bullets?.length > 0 && (
        <ul className="m-0 grid gap-2.5 pl-5 sm:grid-cols-2" style={{ color: "var(--muted)" }}>
          {section.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  );
}

function CardsLayout({ section }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {section.items.map((it) => (
        <div key={it.id} className="panel flex flex-col gap-3 p-6">
          <h3 className="m-0 text-[1.1rem] font-semibold">{it.title}</h3>
          {it.description && <p className="m-0 text-[0.92rem]" style={{ color: "var(--muted)" }}>{it.description}</p>}
          {it.link && (
            <a href={it.link} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-1.5 text-[0.86rem] font-semibold" style={{ color: "var(--blue)" }}>
              Visit
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5"><path d="M7 17 17 7M9 7h8v8" /></svg>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function LinksLayout({ section }) {
  return (
    <div className="grid gap-3">
      {section.items.map((it) => (
        <a
          key={it.id}
          href={it.link || "#"}
          target="_blank"
          rel="noreferrer"
          className="panel flex items-center justify-between gap-4 p-5 transition-transform hover:translate-x-1"
        >
          <span>
            <span className="font-semibold">{it.title}</span>
            {it.description && <small className="block text-[0.82rem]" style={{ color: "var(--faint)" }}>{it.description}</small>}
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 shrink-0" style={{ color: "var(--faint)" }}><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
      ))}
    </div>
  );
}

function ArticlesLayout({ section }) {
  return (
    <div className="grid gap-0">
      {section.items.map((it, i) => (
        <Link
          key={it.id}
          to={`/read/${section.id}/${it.id}`}
          className="flex items-center justify-between gap-4 border-t py-5 last:border-b hover:opacity-80"
          style={{ borderColor: "var(--line)" }}
        >
          <span>
            <span className="text-[1.05rem] font-semibold" style={{ color: "var(--text)" }}>{it.title}</span>
            {it.description && <span className="mt-1 block max-w-[60ch] text-[0.9rem]" style={{ color: "var(--muted)" }}>{it.description}</span>}
          </span>
          <span className="shrink-0 whitespace-nowrap text-[0.84rem] font-semibold" style={{ color: "var(--blue)" }}>Read →</span>
        </Link>
      ))}
    </div>
  );
}

const LAYOUTS = { text: TextLayout, cards: CardsLayout, links: LinksLayout, articles: ArticlesLayout };

function ExtraSection({ section, number }) {
  const headRef = useReveal();
  const bodyRef = useReveal();
  const Layout = LAYOUTS[section.layout] || TextLayout;

  return (
    <section id={`section-${section.id}`} className="py-[110px]">
      <div className="mx-auto w-[min(1180px,100%-44px)]">
        <SectionHead revealRef={headRef} tag={`0${number} — Section`} title={section.title} />
        <div ref={bodyRef} className="rv">
          {section.layout !== "text" && section.body && (
            <p className="m-0 mb-6 max-w-[70ch]" style={{ color: "var(--muted)" }}>{section.body}</p>
          )}
          <Layout section={section} />
        </div>
      </div>
    </section>
  );
}

export default function ExtraSections() {
  const { extraSections } = useContent();
  if (!extraSections?.length) return null;

  return (
    <>
      {extraSections.map((s, i) => (
        <ExtraSection key={s.id} section={s} number={i + 5} />
      ))}
    </>
  );
}
