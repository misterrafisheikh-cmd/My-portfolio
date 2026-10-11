import { useParams, Link } from "react-router-dom";
import { useContentApi } from "../context/ContentContext.jsx";
import { sectionSlug } from "../lib/slug.js";
import PageShell from "../components/PageShell.jsx";

// The full-page reading view for an "articles"-layout section item.
// Uses the shared (cached) content, so it opens instantly.
export default function ArticleReader() {
  const { sectionId, itemId } = useParams();
  const { content, loaded } = useContentApi();
  const section = content.extraSections?.find((s) => s.id === sectionId);
  const item = section?.items?.find((i) => i.id === itemId);
  const state = { loading: !loaded && !item, section, item };
  // Go back to the section's own page if it has one, else the homepage block.
  const backTo = section ? (section.separatePage ? `/${sectionSlug(section)}` : `/#section-${section.id}`) : "/";

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
    <PageShell>
      <div className="mx-auto w-[min(760px,100%-44px)] pb-24 pt-[130px]">
        <Link to={backTo} className="mb-8 inline-flex items-center gap-1.5 text-[0.88rem]" style={{ color: "var(--muted)" }}>
          ← Back to {state.section.title}
        </Link>
        <p className="mb-2 font-mono text-[0.74rem] tracking-[.14em]" style={{ color: "var(--faint)" }}>{state.section.title.toUpperCase()}</p>
        <h1 className="m-0 mb-8 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight tracking-[-.03em]">{state.item.title}</h1>
        <div className="whitespace-pre-wrap text-[1.02rem] leading-[1.8]" style={{ color: "var(--muted)" }}>
          {state.item.body || state.item.description || "No content yet."}
        </div>
      </div>
    </PageShell>
  );
}

function Centered({ children }) {
  return <div className="grid min-h-screen place-items-center p-6 text-center" style={{ background: "var(--bg)" }}>{children}</div>;
}
