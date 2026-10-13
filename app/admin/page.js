"use client";

import { useEffect, useState, useCallback } from "react";
import { SCHEMA, PROFILE_FIELDS } from "@/lib/schema";

const TABS = [
  { key: "profile", label: "Profil" },
  ...Object.entries(SCHEMA).map(([key, s]) => ({ key, label: s.label })),
];

async function api(url, method = "GET", body) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Xatolik yuz berdi");
  return data;
}

/* ---------- Umumiy forma maydonlari ---------- */
function Field({ f, value, onChange }) {
  return (
    <div className="field">
      <label htmlFor={f.name}>{f.label}{f.required ? " *" : ""}</label>
      {f.type === "textarea" ? (
        <textarea id={f.name} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={f.name}
          type={f.type === "number" ? "number" : "text"}
          min={f.type === "number" ? 0 : undefined}
          max={f.type === "number" ? 100 : undefined}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ---------- Profil ---------- */
function ProfileEditor() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api("/api/profile").then(setForm).catch((e) => setMsg({ err: e.message }));
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg(null);
    try {
      const saved = await api("/api/profile", "PUT", form);
      setForm(saved);
      setMsg({ ok: "Saqlandi ✓" });
    } catch (err) {
      setMsg({ err: err.message });
    }
  }

  if (!form) return <div className="panel">Yuklanmoqda...</div>;

  return (
    <form className="panel form" onSubmit={save}>
      {PROFILE_FIELDS.map((f) => (
        <Field key={f.name} f={f} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
      ))}
      <div className="form-actions">
        <button className="btn primary" type="submit">Saqlash</button>
        {msg?.ok && <span className="msg ok">{msg.ok}</span>}
        {msg?.err && <span className="msg err">{msg.err}</span>}
      </div>
    </form>
  );
}

/* ---------- Umumiy CRUD ---------- */
function CrudEditor({ collection }) {
  const schema = SCHEMA[collection];
  const empty = Object.fromEntries(schema.fields.map((f) => [f.name, ""]));

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setItems(await api(`/api/${collection}`));
    } catch (e) {
      setMsg({ err: e.message });
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    load();
  }, [load]);

  function reset() {
    setForm(empty);
    setEditId(null);
  }

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    try {
      if (editId) {
        await api(`/api/${collection}/${editId}`, "PUT", form);
        setMsg({ ok: "Yangilandi ✓" });
      } else {
        await api(`/api/${collection}`, "POST", form);
        setMsg({ ok: "Qo'shildi ✓" });
      }
      reset();
      load();
    } catch (err) {
      setMsg({ err: err.message });
    }
  }

  function startEdit(item) {
    setEditId(item.id);
    setForm(Object.fromEntries(schema.fields.map((f) => [f.name, item[f.name] ?? ""])));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(item) {
    if (!confirm(`"${item[schema.titleField]}" o'chirilsinmi?`)) return;
    try {
      await api(`/api/${collection}/${item.id}`, "DELETE");
      if (editId === item.id) reset();
      load();
    } catch (err) {
      setMsg({ err: err.message });
    }
  }

  const twoCol = (f) => f.type !== "textarea";

  return (
    <div>
      <form className="panel form" onSubmit={submit}>
        <strong>{editId ? `${schema.singular}ni tahrirlash` : `Yangi ${schema.singular.toLowerCase()} qo'shish`}</strong>
        <div className="two">
          {schema.fields.filter(twoCol).map((f) => (
            <Field key={f.name} f={f} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
          ))}
        </div>
        {schema.fields.filter((f) => !twoCol(f)).map((f) => (
          <Field key={f.name} f={f} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
        ))}
        <div className="form-actions">
          <button className="btn primary" type="submit">{editId ? "Yangilash" : "Qo'shish"}</button>
          {editId && <button type="button" className="btn" onClick={reset}>Bekor qilish</button>}
          {msg?.ok && <span className="msg ok">{msg.ok}</span>}
          {msg?.err && <span className="msg err">{msg.err}</span>}
        </div>
      </form>

      <div className="list">
        {loading && <div className="msg">Yuklanmoqda...</div>}
        {!loading && items.length === 0 && <div className="msg">Hali hech narsa qo'shilmagan.</div>}
        {items.map((it) => (
          <div className="row-item" key={it.id}>
            <div>
              <div className="t">{it[schema.titleField]}</div>
              <div className="s">
                {schema.fields
                  .filter((f) => f.name !== schema.titleField && f.type !== "textarea" && it[f.name] !== "" && it[f.name] != null)
                  .slice(0, 2)
                  .map((f) => it[f.name])
                  .join(" · ")}
              </div>
            </div>
            <div className="acts">
              <button className="btn sm" onClick={() => startEdit(it)}>Tahrirlash</button>
              <button className="btn sm danger" onClick={() => remove(it)}>O'chirish</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Login ---------- */
function Login({ onDone }) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await api("/api/login", "POST", { password });
      onDone();
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <form className="login panel form" onSubmit={submit}>
      <div>
        <h1>Admin panel</h1>
        <p>Davom etish uchun parolni kiriting.</p>
      </div>
      <div className="field">
        <label htmlFor="pw">Parol</label>
        <input id="pw" type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {err && <span className="msg err">{err}</span>}
      <button className="btn primary" type="submit">Kirish</button>
      <a href="/" className="msg">← Saytga qaytish</a>
    </form>
  );
}

/* ---------- Asosiy sahifa ---------- */
export default function AdminPage() {
  const [state, setState] = useState("loading"); // loading | out | in
  const [tab, setTab] = useState("profile");

  const check = useCallback(async () => {
    try {
      const { admin } = await api("/api/me");
      setState(admin ? "in" : "out");
    } catch {
      setState("out");
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  async function logout() {
    await api("/api/logout", "POST");
    setState("out");
  }

  if (state === "loading") return null;
  if (state === "out") return <Login onDone={() => setState("in")} />;

  return (
    <div className="container admin-wrap">
      <div className="admin-head">
        <h1>Admin panel</h1>
        <div className="right">
          <a className="btn" href="/" target="_blank" rel="noreferrer">Saytni ko'rish ↗</a>
          <button className="btn danger" onClick={logout}>Chiqish</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" ? <ProfileEditor /> : <CrudEditor key={tab} collection={tab} />}
    </div>
  );
}
