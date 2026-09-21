export default function Footer() {
  return (
    <footer className="border-t py-10" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto flex w-[min(1180px,100%-44px)] flex-wrap justify-between gap-4 font-mono text-[0.82rem]" style={{ color: "var(--faint)" }}>
        <span>© {new Date().getFullYear()} Rafi Sheikh</span>
        <span>Built by hand. No template underneath.</span>
      </div>
    </footer>
  );
}
