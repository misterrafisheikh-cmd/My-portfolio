import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { fetchMessages, setMessageRead, deleteMessageById } from "../lib/api.js";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboard() {
  const { token, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | unread

  const handleAuthError = (err) => {
    if (err.message === "SESSION_EXPIRED") {
      logout();
      navigate("/admin/login");
    } else {
      setError(err.message);
    }
  };

  const load = () => {
    setLoading(true);
    fetchMessages(token)
      .then(setMessages)
      .catch(handleAuthError)
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleRead = async (m) => {
    try {
      const updated = await setMessageRead(token, m._id, !m.read);
      setMessages((list) => list.map((x) => (x._id === m._id ? updated : x)));
    } catch (err) {
      handleAuthError(err);
    }
  };

  const remove = async (m) => {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    try {
      await deleteMessageById(token, m._id);
      setMessages((list) => list.filter((x) => x._id !== m._id));
    } catch (err) {
      handleAuthError(err);
    }
  };

  const shown = filter === "unread" ? messages.filter((m) => !m.read) : messages;
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex w-[min(1100px,100%-32px)] items-center justify-between py-5">
          <div>
            <p className="m-0 font-mono text-[0.72rem] tracking-[.14em]" style={{ color: "var(--faint)" }}>ADMIN</p>
            <h1 className="m-0 text-xl font-bold">Messages{unreadCount > 0 && <span className="ml-2 align-middle text-sm font-normal" style={{ color: "var(--signal)" }}>{unreadCount} unread</span>}</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/content" className="text-[0.85rem]" style={{ color: "var(--muted)" }}>Edit content</a>
            <a href="/" className="text-[0.85rem]" style={{ color: "var(--muted)" }}>View site</a>
            <button
              onClick={() => { logout(); navigate("/admin/login"); }}
              className="rounded-full border px-4 py-2 text-[0.85rem]"
              style={{ borderColor: "var(--line)" }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[min(1100px,100%-32px)] py-8">
        <div className="mb-5 flex gap-2">
          {["all", "unread"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full border px-4 py-1.5 text-[0.82rem] capitalize"
              style={{
                borderColor: filter === f ? "var(--blue)" : "var(--line)",
                background: filter === f ? "var(--blue-soft)" : "transparent",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "var(--muted)" }}>Loading…</p>}
        {error && <p style={{ color: "var(--phase)" }}>{error}</p>}
        {!loading && !error && shown.length === 0 && (
          <p style={{ color: "var(--muted)" }}>No messages here yet.</p>
        )}

        <div className="grid gap-3">
          {shown.map((m) => (
            <div key={m._id} className="panel p-5" style={{ opacity: m.read ? 0.7 : 1 }}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold">{m.name}</span>{" "}
                  <a href={`mailto:${m.email}`} className="text-[0.85rem]" style={{ color: "var(--blue)" }}>{m.email}</a>
                </div>
                <span className="font-mono text-[0.74rem]" style={{ color: "var(--faint)" }}>{timeAgo(m.createdAt)}</span>
              </div>
              <p className="m-0 mb-3 whitespace-pre-wrap text-[0.93rem]" style={{ color: "var(--muted)" }}>{m.message}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleRead(m)}
                  className="rounded-full border px-3.5 py-1.5 text-[0.78rem]"
                  style={{ borderColor: "var(--line)" }}
                >
                  Mark as {m.read ? "unread" : "read"}
                </button>
                <button
                  onClick={() => remove(m)}
                  className="rounded-full border px-3.5 py-1.5 text-[0.78rem]"
                  style={{ borderColor: "var(--line)", color: "var(--phase)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
