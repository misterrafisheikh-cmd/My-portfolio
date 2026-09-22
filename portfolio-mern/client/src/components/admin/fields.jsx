// Small shared bits so AdminContent.jsx isn't full of repeated Tailwind
// strings. Purely presentational — no state of their own.
export function Field({ label, children }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-[0.78rem]" style={{ color: "var(--faint)" }}>{label}</label>
      {children}
    </div>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-[10px] border px-3.5 py-2.5 text-[0.92rem] focus:outline-none ${props.className || ""}`}
      style={{ borderColor: "var(--line)", background: "var(--panel)", ...props.style }}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full resize-y rounded-[10px] border px-3.5 py-2.5 text-[0.92rem] focus:outline-none ${props.className || ""}`}
      style={{ borderColor: "var(--line)", background: "var(--panel)", minHeight: "90px", ...props.style }}
    />
  );
}

export function Card({ children, onRemove }) {
  return (
    <div className="relative rounded-[12px] border p-4" style={{ borderColor: "var(--line)" }}>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-3 top-3 text-[0.76rem]"
          style={{ color: "var(--phase)" }}
        >
          Remove
        </button>
      )}
      <div className="grid gap-3 pr-16">{children}</div>
    </div>
  );
}

export function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[10px] border border-dashed py-2.5 text-[0.85rem]"
      style={{ borderColor: "var(--line-strong)", color: "var(--muted)" }}
    >
      + {children}
    </button>
  );
}

export function TabBtn({ active, children, ...props }) {
  return (
    <button
      {...props}
      className="whitespace-nowrap rounded-full border px-4 py-1.5 text-[0.82rem]"
      style={{
        borderColor: active ? "var(--blue)" : "var(--line)",
        background: active ? "var(--blue-soft)" : "transparent",
        color: active ? "var(--text)" : "var(--muted)",
      }}
    >
      {children}
    </button>
  );
}
