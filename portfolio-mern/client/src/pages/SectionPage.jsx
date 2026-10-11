// ============================================================
// SectionPage — a section shown as its OWN full page (e.g. /research).
// Scrolling this page shows only that section's content. Turn it on
// in /admin/content -> Sections -> "Show on its own page".
// ============================================================
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useContentApi } from "../context/ContentContext.jsx";
import { sectionSlug } from "../lib/slug.js";
import PageShell from "../components/PageShell.jsx";
import { SectionBody } from "../components/ExtraSections.jsx";
import { useReveal } from "../hooks/useReveal.js";
import SectionHead from "../components/SectionHead.jsx";

export default function SectionPage() {
  const { slug } = useParams();
  const { content, loaded } = useContentApi();
  const section = (content.extraSections || []).find((s) => s.separatePage && sectionSlug(s) === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  return (
    <PageShell>
      <div className="min-h-[70vh] pb-24 pt-[130px]">
        <div className="mx-auto w-[min(1180px,100%-44px)]">
          {section ? (
            <>
              <PageHead section={section} />
              <SectionBody section={section} showIntro />
            </>
          ) : loaded ? (
            <div className="py-24 text-center">
              <p style={{ color: "var(--muted)" }}>That page couldn't be found.</p>
              <Link to="/" className="mt-3 inline-block font-semibold" style={{ color: "var(--blue)" }}>← Back to home</Link>
            </div>
          ) : (
            <p className="py-24 text-center" style={{ color: "var(--muted)" }}>Loading…</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}

// Separate component so the fade-in hook mounts together with the section.
function PageHead({ section }) {
  const ref = useReveal();
  return <SectionHead revealRef={ref} tag="Page" title={section.title} />;
}
