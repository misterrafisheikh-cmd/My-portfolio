import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL || "";

// The full-page reading view for an "articles"-layout section item.
// Self-contained fetch (doesn't rely on ContentContext) since this
// route is opened directly, often as a fresh page load or a shared link.
export default function ArticleReader() {
  const { sectionId, itemId } = useParams();
  const [state, setState] = useState({ loading: true, section: null, item: null });

  useEffect(() => {
    fetch(`${BASE}/api/content`)
      .then((r) => r.json())
      .then((content) => {
        const section = content.extraSections?.find((s) => s.id === sectionId);
        const item = section?.items?.find((i) => i.id === itemId);
        setState({ loading: false, section, item });
      })
      .catch(() => setState({ loading: false, section: null, item: null }));
  }, [sectionId, itemId]);

  if (state.loading) {
    return <Centered><p style={{ color: "var(--muted)" }}>Loading…</p></Centered>;
  }

  if (!state.item) {
    return (
      <Centered>
        <p style={{ color: "var(--muted)" }}>That page couldn't be found.</p>
        <Link to="/" className="mt-3 inline-block text-[0.9rem] font-semibold" style={{ color: "var(--blue)" }}>← Back to site</Link>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-[min(760px,100%-44px)] py-16">
        <Link to={`/#section-${state.section.id}`} className="mb-8 inline-flex items-center gap-1.5 text-[0.88rem]" style={{ color: "var(--muted)" }}>
          ← Back to {state.section.title}
        </Link>
        <p className="mb-2 font-mono text-[0.74rem] tracking-[.14em]" style={{ color: "var(--faint)" }}>{state.section.title.toUpperCase()}</p>
        <h1 className="m-0 mb-8 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight tracking-[-.03em]">{state.item.title}</h1>
        <div className="whitespace-pre-wrap text-[1.02rem] leading-[1.8]" style={{ color: "var(--muted)" }}>
          {state.item.body || state.item.description || "No content yet."}
        </div>
      </div>
    </div>
  );
}

function Centered({ children }) {
  return <div className="grid min-h-screen place-items-center p-6 text-center" style={{ background: "var(--bg)" }}>{children}</div>;
}
