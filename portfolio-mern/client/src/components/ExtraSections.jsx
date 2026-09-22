import { useReveal } from "../hooks/useReveal.js";
import { useContent } from "../context/ContentContext.jsx";

// Renders whatever free-form blocks the admin has added from the
// dashboard's Content tab. This is what lets new content ("Services",
// "Testimonials", anything with a title + text + a list) go live
// without anyone touching code — see server/models/Content.js
// (extraSections) and client/src/pages/AdminContent.jsx.
function Block({ section }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="rv panel p-6">
      <h3 className="m-0 mb-3 text-[1.15rem] font-semibold tracking-[-.02em]">{section.title}</h3>
      {section.body && <p className="m-0 mb-4" style={{ color: "var(--muted)" }}>{section.body}</p>}
      {section.items?.length > 0 && (
        <ul className="m-0 grid gap-2 pl-5" style={{ color: "var(--muted)" }}>
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </div>
  );
}

export default function ExtraSections() {
  const { extraSections } = useContent();
  if (!extraSections?.length) return null;

  return (
    <div className="mx-auto mt-[70px] w-[min(1180px,100%-44px)]">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {extraSections.map((s) => <Block key={s.id} section={s} />)}
      </div>
    </div>
  );
}
