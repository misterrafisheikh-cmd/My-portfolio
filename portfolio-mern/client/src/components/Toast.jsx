// ============================================================
// Toast — the little pill notification that slides up from the
// bottom of the screen ("Message sent", "Copied ...", etc). Any part
// of the app can trigger one by calling toast("some text") — it fires
// a browser event that this component is always listening for, so you
// never need to pass a toast function around as a prop.
// ============================================================
import { useEffect, useState } from "react";

// Fires window "toast" events from anywhere: window.dispatchEvent(new
// CustomEvent("toast", { detail: "message" })). Keeps components that
// need to notify the user from having to manage toast state themselves.
export default function Toast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    const onToast = (e) => {
      setMsg(e.detail);
      setShow(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShow(false), 2400);
    };
    window.addEventListener("toast", onToast);
    return () => {
      window.removeEventListener("toast", onToast);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 z-[120] max-w-[90vw] -translate-x-1/2 whitespace-nowrap rounded-full border px-5 py-3 text-sm shadow-[var(--shadow)] transition-transform duration-[400ms] ${
        show ? "translate-y-0" : "translate-y-[120%]"
      }`}
      style={{
        bottom: "calc(26px + env(safe-area-inset-bottom, 0px))",
        borderColor: "var(--line-strong)",
        background: "var(--panel-solid)",
        color: "var(--text)",
      }}
    >
      {msg}
    </div>
  );
}

export function toast(message) {
  window.dispatchEvent(new CustomEvent("toast", { detail: message }));
}
