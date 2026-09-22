import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { adminLogin } from "../lib/api.js";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const token = await adminLogin(password);
      login(token);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center p-6" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <form onSubmit={submit} className="panel w-full max-w-sm p-8">
        <p className="mb-1 font-mono text-[0.74rem] tracking-[.14em]" style={{ color: "var(--faint)" }}>ADMIN</p>
        <h1 className="m-0 mb-6 text-2xl font-bold tracking-tight">Sign in</h1>

        <label htmlFor="pw" className="mb-1.5 block text-[0.8rem]" style={{ color: "var(--faint)" }}>Password</label>
        <input
          id="pw"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-[11px] border px-[15px] py-[13px] focus:outline-none"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        />
        {error && <p className="mt-2 text-[0.82rem]" style={{ color: "var(--phase)" }}>{error}</p>}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 w-full rounded-full px-6 py-3 text-[0.95rem] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)" }}
        >
          {busy ? "Checking…" : "Sign in"}
        </button>

        <a href="/" className="mt-5 block text-center text-[0.82rem]" style={{ color: "var(--muted)" }}>← Back to site</a>
      </form>
    </div>
  );
}
