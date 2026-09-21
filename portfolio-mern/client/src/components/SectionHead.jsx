// Shared heading block used by every section — pass the eyebrow number/
// label, the heading, and either children or a `blurb` string on the right.
export default function SectionHead({ tag, title, blurb, right, revealRef }) {
  return (
    <div ref={revealRef} className="rv mb-[46px] flex flex-wrap items-end justify-between gap-7">
      <div>
        <p className="mb-3 flex items-center gap-2.5 font-mono text-[0.74rem] tracking-[.14em]" style={{ color: "var(--faint)" }}>
          <span className="h-px w-[26px]" style={{ background: "var(--phase)" }} />
          {tag}
        </p>
        <h2 className="m-0 text-[clamp(1.9rem,4vw,2.9rem)] font-bold leading-[1.05] tracking-[-.035em]">{title}</h2>
      </div>
      {right ? right : blurb ? <p className="m-0 max-w-[52ch]" style={{ color: "var(--muted)" }}>{blurb}</p> : null}
    </div>
  );
}
