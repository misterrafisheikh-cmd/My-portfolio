// ============================================================
// Contact — the "04 — Contact" section: a form on the left (which
// POSTs to the backend's /api/contact and lands in the admin
// Messages dashboard), and a list of copy-to-clipboard contact links
// on the right, both driven by the database (useContent).
// ============================================================
import { useState } from "react";
import { useReveal } from "../hooks/useReveal.js";
import { useContent } from "../context/ContentContext.jsx";
import { sendContactMessage } from "../lib/api.js";
import { toast } from "./Toast.jsx";
import SectionHead from "./SectionHead.jsx";

const initial = { name: "", email: "", message: "" };

export default function Contact() {
  const { links } = useContent();
  const headRef = useReveal();
  const formRef = useReveal();
  const linksRef = useReveal();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});

    const localErrors = {};
    if (values.name.trim().length < 2) localErrors.name = "Add a name so I know who's writing.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) localErrors.email = "That email address doesn't look right.";
    if (values.message.trim().length < 12) localErrors.message = "A sentence or two about the project is enough.";
    if (Object.keys(localErrors).length) { setErrors(localErrors); return; }

    setSending(true);
    try {
      await sendContactMessage(values);
      toast("Message sent — I'll reply soon.");
      setValues(initial);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      else toast(err.message || "Couldn't send that — try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`Copied ${text}`);
    } catch {
      toast(`Copy manually: ${text}`);
    }
  };

  const field = "w-full rounded-[11px] border px-[15px] py-[13px] transition-shadow focus:outline-none";

  return (
    <section id="contact" className="py-[110px]">
      <div className="mx-auto w-[min(1180px,100%-44px)]">
        <SectionHead
          revealRef={headRef}
          tag="04 — Contact"
          title="Tell me what you're building"
          blurb="Replies usually land within a day. If it's urgent, say so in the first line."
        />
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-14">
          <form ref={formRef} onSubmit={submit} noValidate className="rv grid gap-4">
            <div className="grid gap-[7px]">
              <label htmlFor="name" className="text-[0.8rem]" style={{ color: "var(--faint)" }}>Your name</label>
              <input id="name" name="name" value={values.name} onChange={change} autoComplete="name" placeholder="Rafi Sheikh"
                className={field} style={{ borderColor: "var(--line)", background: "var(--panel)" }} />
              <p className="min-h-[1em] text-[0.76rem]" style={{ color: "var(--phase)" }}>{errors.name}</p>
            </div>
            <div className="grid gap-[7px]">
              <label htmlFor="email" className="text-[0.8rem]" style={{ color: "var(--faint)" }}>Email</label>
              <input id="email" name="email" type="email" value={values.email} onChange={change} autoComplete="email" placeholder="you@company.com"
                className={field} style={{ borderColor: "var(--line)", background: "var(--panel)" }} />
              <p className="min-h-[1em] text-[0.76rem]" style={{ color: "var(--phase)" }}>{errors.email}</p>
            </div>
            <div className="grid gap-[7px]">
              <label htmlFor="msg" className="text-[0.8rem]" style={{ color: "var(--faint)" }}>What do you need?</label>
              <textarea id="msg" name="message" value={values.message} onChange={change} placeholder="A short brief, a timeline, and a budget range if you have one or ask for a meeting"
                className={`${field} min-h-[130px] resize-y`} style={{ borderColor: "var(--line)", background: "var(--panel)" }} />
              <p className="min-h-[1em] text-[0.76rem]" style={{ color: "var(--phase)" }}>{errors.message}</p>
            </div>
            <button type="submit" disabled={sending}
              className="justify-center rounded-full px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_14px_34px_-16px_rgba(79,141,255,.9)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)" }}>
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>

          <div ref={linksRef} className="rv">
            <p className="mt-0" style={{ color: "var(--muted)" }}>Prefer something direct? Every line below copies to your clipboard.</p>
            <div className="mt-6 grid gap-3">
              {links.contact.map((l) => (
                <button key={l.copy} onClick={() => copy(l.copy)}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-all hover:translate-x-1"
                  style={{ borderColor: "var(--line)", background: "var(--panel)" }}>
                  <span>{l.label}<small className="block text-[0.76rem]" style={{ color: "var(--faint)" }}>{l.type}</small></span>
                  <span className="font-mono text-[0.76rem]" style={{ color: "var(--faint)" }}>copy</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
