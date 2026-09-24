import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { fetchContentAdmin, saveContent } from "../lib/contentApi.js";
import { Field, Input, TextArea, Card, AddButton, TabBtn } from "../components/admin/fields.jsx";

const TABS = ["Hero", "About", "Skills", "Projects", "Timeline", "Links", "Sections"];
const uid = () => Math.random().toString(36).slice(2, 9);

export default function AdminContent() {
  const { token, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [tab, setTab] = useState("Hero");
  const [status, setStatus] = useState(""); // "", "saving", "saved", error text
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchContentAdmin().then(setForm).catch((e) => setLoadError(e.message));
  }, []);

  const save = async () => {
    setStatus("saving");
    try {
      const updated = await saveContent(token, form);
      setForm(updated);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        logout();
        navigate("/admin/login");
        return;
      }
      setStatus(err.message);
    }
  };

  if (loadError) return <Centered><p style={{ color: "var(--phase)" }}>{loadError}</p></Centered>;
  if (!form) return <Centered><p style={{ color: "var(--muted)" }}>Loading…</p></Centered>;

  const csv = (arr) => (arr || []).join(", ");
  const parseCsv = (text) => text.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <header className="sticky top-0 z-10 border-b backdrop-blur" style={{ borderColor: "var(--line)", background: "var(--panel-solid)" }}>
        <div className="mx-auto flex w-[min(1100px,100%-32px)] items-center justify-between py-4">
          <div>
            <p className="m-0 font-mono text-[0.72rem] tracking-[.14em]" style={{ color: "var(--faint)" }}>ADMIN</p>
            <h1 className="m-0 text-xl font-bold">Edit site content</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-[0.85rem]" style={{ color: "var(--muted)" }}>Messages</a>
            <a href="/" className="text-[0.85rem]" style={{ color: "var(--muted)" }}>View site</a>
            <button
              onClick={save}
              disabled={status === "saving"}
              className="rounded-full px-5 py-2 text-[0.86rem] font-semibold text-white disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)" }}
            >
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
        {status && status !== "saving" && (
          <div className="mx-auto w-[min(1100px,100%-32px)] pb-3 text-[0.82rem]" style={{ color: status === "saved" ? "var(--signal)" : "var(--phase)" }}>
            {status === "saved" ? "Saved — refresh the site to see it live." : status}
          </div>
        )}
      </header>

      <div className="mx-auto w-[min(1100px,100%-32px)] py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => <TabBtn key={t} active={tab === t} onClick={() => setTab(t)}>{t}</TabBtn>)}
        </div>

        {tab === "Hero" && (
          <div className="grid gap-4">
            <Field label="Name">
              <Input value={form.hero.name} onChange={(e) => setForm({ ...form, hero: { ...form.hero, name: e.target.value } })} />
            </Field>
            <Field label="Rotating roles (comma-separated)">
              <Input value={csv(form.hero.roles)} onChange={(e) => setForm({ ...form, hero: { ...form.hero, roles: parseCsv(e.target.value) } })} />
            </Field>
            <Field label="Intro paragraph">
              <TextArea value={form.hero.lede} onChange={(e) => setForm({ ...form, hero: { ...form.hero, lede: e.target.value } })} />
            </Field>
            <Field label="Encrypted name (shown when 'Encrypt' is clicked)">
              <Input value={form.hero.cipherName} onChange={(e) => setForm({ ...form, hero: { ...form.hero, cipherName: e.target.value } })} />
            </Field>
            <Field label="Encrypted intro">
              <TextArea value={form.hero.cipherLede} onChange={(e) => setForm({ ...form, hero: { ...form.hero, cipherLede: e.target.value } })} />
            </Field>
          </div>
        )}

        {tab === "About" && (
          <div className="grid gap-6">
            <Field label="Short blurb (top-right of the About section)">
              <TextArea value={form.about.blurb} onChange={(e) => setForm({ ...form, about: { ...form.about, blurb: e.target.value } })} />
            </Field>

            <div>
              <p className="mb-2 text-[0.85rem] font-semibold">Identity card (label / value rows)</p>
              <div className="grid gap-3">
                {form.about.identity.map((row, i) => (
                  <Card key={i} onRemove={() => setForm({ ...form, about: { ...form.about, identity: form.about.identity.filter((_, x) => x !== i) } })}>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Label" value={row.label} onChange={(e) => {
                        const identity = [...form.about.identity]; identity[i] = { ...row, label: e.target.value };
                        setForm({ ...form, about: { ...form.about, identity } });
                      }} />
                      <Input placeholder="Value" value={row.value} onChange={(e) => {
                        const identity = [...form.about.identity]; identity[i] = { ...row, value: e.target.value };
                        setForm({ ...form, about: { ...form.about, identity } });
                      }} />
                    </div>
                  </Card>
                ))}
                <AddButton onClick={() => setForm({ ...form, about: { ...form.about, identity: [...form.about.identity, { label: "", value: "" }] } })}>Add row</AddButton>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[0.85rem] font-semibold">Paragraphs</p>
              <div className="grid gap-3">
                {form.about.paragraphs.map((p, i) => (
                  <Card key={i} onRemove={() => setForm({ ...form, about: { ...form.about, paragraphs: form.about.paragraphs.filter((_, x) => x !== i) } })}>
                    <TextArea value={p} onChange={(e) => {
                      const paragraphs = [...form.about.paragraphs]; paragraphs[i] = e.target.value;
                      setForm({ ...form, about: { ...form.about, paragraphs } });
                    }} />
                  </Card>
                ))}
                <AddButton onClick={() => setForm({ ...form, about: { ...form.about, paragraphs: [...form.about.paragraphs, ""] } })}>Add paragraph</AddButton>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[0.85rem] font-semibold">Stats (the three numbers with count-up)</p>
              <div className="grid gap-3">
                {form.about.stats.map((s, i) => (
                  <Card key={i} onRemove={() => setForm({ ...form, about: { ...form.about, stats: form.about.stats.filter((_, x) => x !== i) } })}>
                    <div className="grid grid-cols-3 gap-3">
                      <Input type="number" placeholder="Number" value={s.value} onChange={(e) => {
                        const stats = [...form.about.stats]; stats[i] = { ...s, value: Number(e.target.value) || 0 };
                        setForm({ ...form, about: { ...form.about, stats } });
                      }} />
                      <Input placeholder="Suffix (e.g. +)" value={s.suffix} onChange={(e) => {
                        const stats = [...form.about.stats]; stats[i] = { ...s, suffix: e.target.value };
                        setForm({ ...form, about: { ...form.about, stats } });
                      }} />
                      <Input placeholder="Label" value={s.label} onChange={(e) => {
                        const stats = [...form.about.stats]; stats[i] = { ...s, label: e.target.value };
                        setForm({ ...form, about: { ...form.about, stats } });
                      }} />
                    </div>
                  </Card>
                ))}
                <AddButton onClick={() => setForm({ ...form, about: { ...form.about, stats: [...form.about.stats, { value: 0, suffix: "", label: "" }] } })}>Add stat</AddButton>
              </div>
            </div>
          </div>
        )}

        {tab === "Skills" && (
          <div className="grid gap-6">
            {form.skills.groups.map((g, gi) => (
              <Card key={gi} onRemove={() => setForm({ ...form, skills: { ...form.skills, groups: form.skills.groups.filter((_, x) => x !== gi) } })}>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Group title (e.g. Interface)" value={g.title} onChange={(e) => {
                    const groups = [...form.skills.groups]; groups[gi] = { ...g, title: e.target.value };
                    setForm({ ...form, skills: { ...form.skills, groups } });
                  }} />
                  <Input placeholder="Subtitle" value={g.subtitle} onChange={(e) => {
                    const groups = [...form.skills.groups]; groups[gi] = { ...g, subtitle: e.target.value };
                    setForm({ ...form, skills: { ...form.skills, groups } });
                  }} />
                </div>
                <div className="grid gap-2">
                  {g.items.map((it, ii) => (
                    <div key={ii} className="grid grid-cols-[1fr_110px_80px_auto] items-center gap-2">
                      <Input placeholder="Skill name" value={it.name} onChange={(e) => {
                        const groups = [...form.skills.groups]; const items = [...g.items]; items[ii] = { ...it, name: e.target.value };
                        groups[gi] = { ...g, items }; setForm({ ...form, skills: { ...form.skills, groups } });
                      }} />
                      <Input placeholder="expert/strong/working" value={it.level} onChange={(e) => {
                        const groups = [...form.skills.groups]; const items = [...g.items]; items[ii] = { ...it, level: e.target.value };
                        groups[gi] = { ...g, items }; setForm({ ...form, skills: { ...form.skills, groups } });
                      }} />
                      <Input type="number" placeholder="%" value={it.pct} onChange={(e) => {
                        const groups = [...form.skills.groups]; const items = [...g.items]; items[ii] = { ...it, pct: Number(e.target.value) || 0 };
                        groups[gi] = { ...g, items }; setForm({ ...form, skills: { ...form.skills, groups } });
                      }} />
                      <button type="button" className="text-[0.76rem]" style={{ color: "var(--phase)" }} onClick={() => {
                        const groups = [...form.skills.groups]; groups[gi] = { ...g, items: g.items.filter((_, x) => x !== ii) };
                        setForm({ ...form, skills: { ...form.skills, groups } });
                      }}>Remove</button>
                    </div>
                  ))}
                  <AddButton onClick={() => {
                    const groups = [...form.skills.groups]; groups[gi] = { ...g, items: [...g.items, { name: "", level: "working", pct: 50 }] };
                    setForm({ ...form, skills: { ...form.skills, groups } });
                  }}>Add skill to this group</AddButton>
                </div>
              </Card>
            ))}
            <AddButton onClick={() => setForm({ ...form, skills: { ...form.skills, groups: [...form.skills.groups, { title: "", subtitle: "", items: [] }] } })}>Add skill group</AddButton>

            <Field label="Scrolling tech marquee (comma-separated)">
              <TextArea value={csv(form.skills.marquee)} onChange={(e) => setForm({ ...form, skills: { ...form.skills, marquee: parseCsv(e.target.value) } })} />
            </Field>
          </div>
        )}

        {tab === "Projects" && (
          <div className="grid gap-4">
            {form.projects.map((p, i) => (
              <Card key={p.id || i} onRemove={() => setForm({ ...form, projects: form.projects.filter((_, x) => x !== i) })}>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Title" value={p.title} onChange={(e) => {
                    const projects = [...form.projects]; projects[i] = { ...p, title: e.target.value };
                    setForm({ ...form, projects });
                  }} />
                  <Input placeholder="Year" value={p.year} onChange={(e) => {
                    const projects = [...form.projects]; projects[i] = { ...p, year: e.target.value };
                    setForm({ ...form, projects });
                  }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={p.category}
                    onChange={(e) => { const projects = [...form.projects]; projects[i] = { ...p, category: e.target.value }; setForm({ ...form, projects }); }}
                    className="rounded-[10px] border px-3.5 py-2.5 text-[0.92rem]"
                    style={{ borderColor: "var(--line)", background: "var(--panel)" }}
                  >
                    <option value="web">Web app</option>
                    <option value="tool">Tool</option>
                    <option value="lab">Experiment</option>
                  </select>
                  <Input placeholder="Link (URL or #contact)" value={p.link} onChange={(e) => {
                    const projects = [...form.projects]; projects[i] = { ...p, link: e.target.value };
                    setForm({ ...form, projects });
                  }} />
                </div>
                <TextArea placeholder="Description" value={p.description} onChange={(e) => {
                  const projects = [...form.projects]; projects[i] = { ...p, description: e.target.value };
                  setForm({ ...form, projects });
                }} />
                <Input placeholder="Stack (comma-separated)" value={csv(p.stack)} onChange={(e) => {
                  const projects = [...form.projects]; projects[i] = { ...p, stack: parseCsv(e.target.value) };
                  setForm({ ...form, projects });
                }} />
              </Card>
            ))}
            <AddButton onClick={() => setForm({ ...form, projects: [...form.projects, { id: uid(), title: "", year: "", category: "web", description: "", stack: [], link: "#contact" }] })}>
              Add project
            </AddButton>
          </div>
        )}

        {tab === "Timeline" && (
          <div className="grid gap-4">
            {form.timeline.map((t, i) => (
              <Card key={i} onRemove={() => setForm({ ...form, timeline: form.timeline.filter((_, x) => x !== i) })}>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Range (e.g. 2024 — now)" value={t.range} onChange={(e) => {
                    const timeline = [...form.timeline]; timeline[i] = { ...t, range: e.target.value };
                    setForm({ ...form, timeline });
                  }} />
                  <Input placeholder="Role / title" value={t.role} onChange={(e) => {
                    const timeline = [...form.timeline]; timeline[i] = { ...t, role: e.target.value };
                    setForm({ ...form, timeline });
                  }} />
                </div>
                <TextArea placeholder="Detail" value={t.detail} onChange={(e) => {
                  const timeline = [...form.timeline]; timeline[i] = { ...t, detail: e.target.value };
                  setForm({ ...form, timeline });
                }} />
              </Card>
            ))}
            <AddButton onClick={() => setForm({ ...form, timeline: [...form.timeline, { range: "", role: "", detail: "" }] })}>Add timeline entry</AddButton>
          </div>
        )}

        {tab === "Links" && (
          <div className="grid gap-4">
            <Field label="Contact email (used by the mail-to link)">
              <Input value={form.links.email} onChange={(e) => setForm({ ...form, links: { ...form.links, email: e.target.value } })} />
            </Field>
            {form.links.contact.map((l, i) => (
              <Card key={i} onRemove={() => setForm({ ...form, links: { ...form.links, contact: form.links.contact.filter((_, x) => x !== i) } })}>
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Displayed text" value={l.label} onChange={(e) => {
                    const contact = [...form.links.contact]; contact[i] = { ...l, label: e.target.value };
                    setForm({ ...form, links: { ...form.links, contact } });
                  }} />
                  <Input placeholder="Type (Email/Code/...)" value={l.type} onChange={(e) => {
                    const contact = [...form.links.contact]; contact[i] = { ...l, type: e.target.value };
                    setForm({ ...form, links: { ...form.links, contact } });
                  }} />
                  <Input placeholder="Value copied to clipboard" value={l.copy} onChange={(e) => {
                    const contact = [...form.links.contact]; contact[i] = { ...l, copy: e.target.value };
                    setForm({ ...form, links: { ...form.links, contact } });
                  }} />
                </div>
              </Card>
            ))}
            <AddButton onClick={() => setForm({ ...form, links: { ...form.links, contact: [...form.links.contact, { label: "", type: "", copy: "" }] } })}>Add contact link</AddButton>
          </div>
        )}

        {tab === "Sections" && (
          <div className="grid gap-5">
            <p className="text-[0.85rem]" style={{ color: "var(--muted)" }}>
              Pick a layout per section. <b>Text</b> is a paragraph + bullet list (like About).
              <b> Cards</b> is a grid with an optional outbound link on each card.
              <b> Links</b> makes every item a clickable row that jumps straight to its link.
              <b> Articles</b> lists titles — clicking one opens a dedicated page showing that
              item's full write-up, for long-form content like research notes or course
              descriptions. New sections appear on the homepage and in the nav automatically.
            </p>

            {form.extraSections.map((s, si) => {
              const setSection = (patch) => {
                const extraSections = [...form.extraSections];
                extraSections[si] = { ...s, ...patch };
                setForm({ ...form, extraSections });
              };
              const setItem = (ii, patch) => {
                const items = [...s.items];
                items[ii] = { ...items[ii], ...patch };
                setSection({ items });
              };
              const addItem = () => setSection({ items: [...s.items, { id: uid(), title: "", description: "", link: "", body: "" }] });
              const removeItem = (ii) => setSection({ items: s.items.filter((_, x) => x !== ii) });

              return (
                <Card key={s.id} onRemove={() => setForm({ ...form, extraSections: form.extraSections.filter((_, x) => x !== si) })}>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Section title (e.g. Research)" value={s.title} onChange={(e) => setSection({ title: e.target.value })} />
                    <select
                      value={s.layout || "text"}
                      onChange={(e) => setSection({ layout: e.target.value })}
                      className="rounded-[10px] border px-3.5 py-2.5 text-[0.92rem]"
                      style={{ borderColor: "var(--line)", background: "var(--panel)" }}
                    >
                      <option value="text">Text (paragraph + bullets)</option>
                      <option value="cards">Cards (grid)</option>
                      <option value="links">Links (clickable rows)</option>
                      <option value="articles">Articles (full-page read)</option>
                    </select>
                  </div>

                  {s.layout !== "text" && (
                    <TextArea placeholder="Optional intro text shown above the items" value={s.body} onChange={(e) => setSection({ body: e.target.value })} />
                  )}

                  {s.layout === "text" && (
                    <>
                      <TextArea placeholder="Body text" value={s.body} onChange={(e) => setSection({ body: e.target.value })} />
                      <Input
                        placeholder="Bullet points (comma-separated, optional)"
                        value={csv(s.bullets)}
                        onChange={(e) => setSection({ bullets: parseCsv(e.target.value) })}
                      />
                    </>
                  )}

                  {s.layout !== "text" && (
                    <div className="grid gap-3">
                      <p className="text-[0.8rem] font-semibold" style={{ color: "var(--faint)" }}>Items</p>
                      {s.items.map((it, ii) => (
                        <div key={it.id} className="rounded-[10px] border p-3.5" style={{ borderColor: "var(--line)" }}>
                          <div className="mb-2 grid gap-2 sm:grid-cols-2">
                            <Input placeholder="Title" value={it.title} onChange={(e) => setItem(ii, { title: e.target.value })} />
                            {(s.layout === "cards" || s.layout === "links") && (
                              <Input
                                placeholder={s.layout === "links" ? "Link (required — where this row goes)" : "Link (optional — 'Visit' button)"}
                                value={it.link}
                                onChange={(e) => setItem(ii, { link: e.target.value })}
                              />
                            )}
                          </div>
                          <Input
                            placeholder={s.layout === "articles" ? "Short teaser shown in the list" : "Description (optional)"}
                            value={it.description}
                            onChange={(e) => setItem(ii, { description: e.target.value })}
                            className="mb-2"
                          />
                          {s.layout === "articles" && (
                            <TextArea
                              placeholder="Full content — shown on the item's own page, as long as you like"
                              value={it.body}
                              onChange={(e) => setItem(ii, { body: e.target.value })}
                              style={{ minHeight: "160px" }}
                            />
                          )}
                          <button type="button" onClick={() => removeItem(ii)} className="mt-2 text-[0.76rem]" style={{ color: "var(--phase)" }}>
                            Remove item
                          </button>
                        </div>
                      ))}
                      <AddButton onClick={addItem}>Add item</AddButton>
                    </div>
                  )}
                </Card>
              );
            })}

            <AddButton
              onClick={() =>
                setForm({
                  ...form,
                  extraSections: [...form.extraSections, { id: uid(), title: "", layout: "text", body: "", bullets: [], items: [] }],
                })
              }
            >
              Add section
            </AddButton>
          </div>
        )}
      </div>
    </div>
  );
}

function Centered({ children }) {
  return <div className="grid min-h-screen place-items-center" style={{ background: "var(--bg)" }}>{children}</div>;
}
