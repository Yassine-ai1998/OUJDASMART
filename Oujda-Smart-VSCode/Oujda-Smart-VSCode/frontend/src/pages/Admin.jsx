import { useState } from "react";
import {
  Users,
  MessagesSquare,
  MessageCircle,
  Clock,
  Plus,
  PenLine,
  Trash2,
  Sparkles,
  ArrowUpRight,
  Search,
  Check,
  ChartColumn,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useData } from "../hooks/useData";
import { api } from "../services/api";
import {
  PageHeader,
  Load,
  Status,
  Empty,
  Modal,
  Notice,
  BusyButton,
  categories,
  shortDate,
} from "../components/UI";
export function AdminDashboard({ full = false }) {
  const { t, tr, lang } = useApp(),
    state = useData("/analytics"),
    [period, setPeriod] = useState("daily"),
    d = state.data;
  return (
    <>
      <PageHeader
        title={t(full ? "analytics" : "dashboard")}
        description={t("manageIntro")}
      />
      <Load state={state}>
        {d && (
          <>
            <div className="admin-stats">
              {[
                ["users", Users, d.counts.users],
                ["conversations", MessagesSquare, d.counts.conversations],
                ["complaints", MessageCircle, d.counts.complaints],
                ["openComplaints", Clock, d.counts.open],
              ].map(([k, Icon, value], i) => (
                <article key={k}>
                  <span className={"stat-icon stat-" + i}>
                    <Icon size={22} />
                  </span>
                  <span>{t(k)}</span>
                  <strong>{value}</strong>
                  <small>{t("demo")}</small>
                </article>
              ))}
            </div>
            <div className="analytics-grid">
              <section className="panel chart-panel">
                <div className="section-title">
                  <h3>{t("requestTrend")}</h3>
                  <select
                    aria-label={t("requestTrend")}
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="daily">{t("daily")}</option>
                    <option value="monthly">{t("monthly")}</option>
                  </select>
                </div>
                <div
                  className="bar-chart"
                  role="img"
                  aria-label={t("requestTrend")}
                >
                  {d[period].map((r, i) => {
                    const max = Math.max(1, ...d[period].map((v) => v.count));
                    return (
                      <div key={i}>
                        <span>{r.count}</span>
                        <i
                          style={{ height: Math.max(4, (r.count / max) * 150) }}
                        />
                        <small>
                          {period === "daily"
                            ? (r.day || "").slice(5)
                            : r.month}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </section>
              <section className="panel chart-panel">
                <h3>{t("popularTopics")}</h3>
                <div className="horizontal-chart">
                  {d.topics.slice(0, 6).map((r) => (
                    <div key={r.topic}>
                      <span>{t(r.topic)}</span>
                      <div>
                        <i
                          style={{
                            width:
                              (r.count /
                                Math.max(...d.topics.map((t) => t.count), 1)) *
                                100 +
                              "%",
                          }}
                        />
                      </div>
                      <strong>{r.count}</strong>
                    </div>
                  ))}
                </div>
              </section>
              <section className="panel chart-panel">
                <h3>{t("sentiment")}</h3>
                <div className="sentiments">
                  {["positive", "neutral", "negative"].map((s) => (
                    <div className={s} key={s}>
                      <span>
                        {s === "positive" ? "☺" : s === "neutral" ? "◉" : "☹"}
                      </span>
                      <strong>
                        {d.sentiments.find((v) => v.sentiment === s)?.count ||
                          0}
                      </strong>
                      <small>{t(s)}</small>
                    </div>
                  ))}
                </div>
                <p className="tiny muted">{t("analysisNote")}</p>
              </section>
              <section className="panel chart-panel">
                <h3>{t("popularServices")}</h3>
                <div className="service-ranks">
                  {d.services.map((s, i) => (
                    <div key={i}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <strong>{tr(s.title)}</strong>
                      <small>{s.views}</small>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <section className="recommendation-panel">
              <div>
                <span className="stat-icon">
                  <Sparkles size={23} />
                </span>
                <h3>{t("recommendations")}</h3>
              </div>
              <div>
                {d.recommendations.map((r, i) => (
                  <p key={r.topic}>
                    <span>{i + 1}</span>
                    {t("recommendText")} <strong>{t(r.topic)}</strong>
                    <small>{r.count}</small>
                  </p>
                ))}
              </div>
            </section>
            {full && (
              <section className="panel chart-panel">
                <h3>{t("frequentQuestions")}</h3>
                {d.questions.length ? (
                  d.questions.map((q, i) => (
                    <div className="question-row" key={i}>
                      <p>{q.content}</p>
                      <span>{q.count}</span>
                    </div>
                  ))
                ) : (
                  <Empty />
                )}
              </section>
            )}
            <Notice>{t("analysisNote")}</Notice>
          </>
        )}
      </Load>
    </>
  );
}
const resourceConfig = {
  flights: {
    title: "flights",
    fields: [
      ["number", "flight"],
      ["airline", "airline"],
      ["city", "city"],
      ["direction", "direction", "direction"],
      ["scheduled_at", "scheduled", "datetime-local"],
      ["estimated_at", "estimated", "datetime-local"],
      ["gate", "gate"],
      ["status", "status", "status"],
      ["terminal", "terminal"],
    ],
  },
  services: {
    title: "services",
    fields: [
      ["slug", "slug"],
      ["icon", "icon"],
      ["title", "title", "translated"],
      ["description", "description", "translated"],
      ["location", "location", "translated"],
      ["hours", "hours", "translated"],
    ],
  },
  faq: {
    title: "faq",
    fields: [
      ["category", "category", "category"],
      ["question", "question", "translated"],
      ["answer", "answer", "translated"],
      ["keywords", "keywords"],
    ],
  },
  knowledge: {
    title: "knowledge",
    fields: [
      ["topic", "topic", "category"],
      ["title", "title", "translated"],
      ["content", "answer", "translated"],
      ["keywords", "keywords"],
      ["source", "source"],
    ],
  },
};
function localDate(v) {
  if (!v) return "";
  const d = new Date(v);
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export function AdminResource({ resource }) {
  const { t, tr, notify } = useApp(),
    state = useData("/admin/" + resource),
    cfg = resourceConfig[resource];
  const [edit, setEdit] = useState(null),
    [remove, setRemove] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [q, setQ] = useState(""),
    [editLang, setEditLang] = useState("fr");
  function open(item) {
    const record = item
      ? structuredClone(item)
      : Object.fromEntries(
          cfg.fields.map(([k, label, type]) => [
            k,
            type === "translated"
              ? { fr: "", ar: "", en: "" }
              : type === "category"
                ? "services"
                : type === "direction"
                  ? "departure"
                  : type === "status"
                    ? "ON_TIME"
                    : "",
          ]),
        );
    if (!item && resource === "flights") record.terminal = "Terminal démo";
    if (!item && resource === "knowledge")
      record.source = "Prototype académique";
    setEdit(record);
    setEditLang("fr");
    setError("");
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = Object.fromEntries(
        cfg.fields.map(([k, l, type]) => [
          k,
          type === "datetime-local" ? new Date(edit[k]).toISOString() : edit[k],
        ]),
      );
      for (const [key, label, type] of cfg.fields) {
        if (
          type === "translated" &&
          ["fr", "en", "ar"].some((l) => !d[key][l]?.trim())
        )
          throw new Error(t(label) + " : FR, EN et AR sont requis.");
      }
      await api[edit.id ? "put" : "post"](
        "/admin/" + resource + (edit.id ? "/" + edit.id : ""),
        d,
      );
      setEdit(null);
      state.refresh();
      notify(t("savedOk"));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const list = (state.data || []).filter((r) =>
    JSON.stringify(r).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader title={t(cfg.title)} description={t("manageIntro")}>
        <button className="btn primary" onClick={() => open()}>
          <Plus size={17} />
          {t("add")}
        </button>
      </PageHeader>
      <section className="panel">
        <div className="resource-toolbar search-input">
          <Search size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
          />
        </div>
        <Load state={state}>
          {!list.length ? (
            <Empty />
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      {t(
                        resource === "flights"
                          ? "flight"
                          : resource === "faq"
                            ? "question"
                            : "title",
                      )}
                    </th>
                    <th>
                      {t(resource === "flights" ? "destination" : "category")}
                    </th>
                    <th>{t(resource === "flights" ? "status" : "source")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.number || tr(r.question || r.title)}</strong>
                        {r.airline && <small>{r.airline}</small>}
                      </td>
                      <td>{r.city || t(r.category || r.topic) || r.slug}</td>
                      <td>
                        {r.status ? (
                          <Status value={r.status} />
                        ) : (
                          r.source || t("academic")
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn"
                            aria-label={t("edit")}
                            onClick={() => open(r)}
                          >
                            <PenLine size={17} />
                          </button>
                          <button
                            className="icon-btn danger-text"
                            aria-label={t("delete")}
                            onClick={() => {
                              setRemove(r);
                              setError("");
                            }}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Load>
      </section>
      <Modal
        open={!!edit}
        title={t(edit?.id ? "edit" : "add") + " · " + t(cfg.title)}
        onClose={() => setEdit(null)}
      >
        {edit && (
          <form onSubmit={save}>
            {resource !== "flights" && (
              <div className="tabs language-tabs">
                {["fr", "en", "ar"].map((l) => (
                  <button
                    type="button"
                    key={l}
                    className={editLang === l ? "selected" : ""}
                    onClick={() => setEditLang(l)}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            {cfg.fields.map(([key, label, type]) => (
              <label key={key}>
                {t(label)}
                {type === "translated" ? " · " + editLang.toUpperCase() : ""}
                {type === "translated" ? (
                  <textarea
                    dir={editLang === "ar" ? "rtl" : "ltr"}
                    rows={key === "content" || key === "answer" ? 4 : 2}
                    value={edit[key]?.[editLang] || ""}
                    maxLength={4000}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        [key]: { ...edit[key], [editLang]: e.target.value },
                      })
                    }
                  />
                ) : ["category", "status", "direction"].includes(type) ? (
                  <select
                    value={edit[key]}
                    onChange={(e) =>
                      setEdit({ ...edit, [key]: e.target.value })
                    }
                  >
                    {(type === "category"
                      ? categories
                      : type === "status"
                        ? [
                            "ON_TIME",
                            "DELAYED",
                            "BOARDING",
                            "DEPARTED",
                            "ARRIVED",
                            "CANCELLED",
                          ]
                        : ["departure", "arrival"]
                    ).map((v) => (
                      <option value={v} key={v}>
                        {t(
                          v === "departure"
                            ? "departures"
                            : v === "arrival"
                              ? "arrivals"
                              : v,
                        )}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required={key !== "keywords"}
                    type={type === "datetime-local" ? type : "text"}
                    value={
                      type === "datetime-local"
                        ? localDate(edit[key])
                        : edit[key] || ""
                    }
                    maxLength={key === "keywords" ? 1000 : 300}
                    onChange={(e) =>
                      setEdit({ ...edit, [key]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <BusyButton className="btn primary full" busy={busy}>
              <Check size={16} />
              {t("save")}
            </BusyButton>
          </form>
        )}
      </Modal>
      <Modal
        open={!!remove}
        onClose={() => setRemove(null)}
        title={t("deleteConfirm")}
      >
        <p>{remove?.number || tr(remove?.title || remove?.question)}</p>
        {error && <p className="form-error">{error}</p>}
        <BusyButton
          className="btn danger"
          busy={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api.delete("/admin/" + resource + "/" + remove.id);
              setRemove(null);
              state.refresh();
              notify(t("savedOk"));
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {t("delete")}
        </BusyButton>
      </Modal>
    </>
  );
}
export function AdminComplaints() {
  const { t, lang, notify } = useApp(),
    state = useData("/admin/complaints"),
    [selected, setSelected] = useState(null),
    [filter, setFilter] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const transitions = {
    RECEIVED: ["RECEIVED", "IN_PROGRESS"],
    IN_PROGRESS: ["IN_PROGRESS", "RESOLVED"],
    RESOLVED: ["RESOLVED", "CLOSED", "IN_PROGRESS"],
    CLOSED: ["CLOSED", "IN_PROGRESS"],
  };
  return (
    <>
      <PageHeader title={t("complaints")} description={t("notOfficial")} />
      <section className="panel">
        <div className="resource-toolbar">
          <select
            value={filter}
            aria-label={t("filter")}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">{t("allStatuses")}</option>
            {Object.keys(transitions).map((s) => (
              <option value={s} key={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </div>
        <Load state={state}>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{t("reference")}</th>
                  <th>{t("subject")}</th>
                  <th>{t("category")}</th>
                  <th>{t("priority")}</th>
                  <th>{t("status")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {(state.data || [])
                  .filter((c) => !filter || c.status === filter)
                  .map((c) => (
                    <tr key={c.id}>
                      <td>
                        {c.reference}
                        <small>{shortDate(c.created_at, lang)}</small>
                      </td>
                      <td>
                        <strong>{c.subject}</strong>
                        <small>{c.name}</small>
                      </td>
                      <td>{t(c.category)}</td>
                      <td>{t(c.priority)}</td>
                      <td>
                        <Status value={c.status} />
                      </td>
                      <td>
                        <button
                          className="icon-btn"
                          aria-label={t("edit")}
                          onClick={() => {
                            setSelected({ ...c, original: c.status });
                            setError("");
                          }}
                        >
                          <PenLine size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Load>
      </section>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.reference}
      >
        {selected && (
          <>
            <h3>{selected.subject}</h3>
            <p>{selected.message}</p>
            <p className="muted">
              {selected.name} · {selected.email}
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await api.put("/admin/complaints/" + selected.id, {
                    status: selected.status,
                    response: selected.response,
                  });
                  setSelected(null);
                  state.refresh();
                  notify(t("savedOk"));
                } catch (e) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label>
                {t("status")}
                <select
                  value={selected.status}
                  onChange={(e) =>
                    setSelected({ ...selected, status: e.target.value })
                  }
                >
                  {transitions[selected.original].map((s) => (
                    <option key={s} value={s}>
                      {t(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("response")}
                <textarea
                  rows={5}
                  maxLength={4000}
                  value={selected.response}
                  onChange={(e) =>
                    setSelected({ ...selected, response: e.target.value })
                  }
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <BusyButton className="btn primary full" busy={busy}>
                {t("save")}
              </BusyButton>
            </form>
          </>
        )}
      </Modal>
    </>
  );
}
export function AdminConversations() {
  const { t, lang, notify } = useApp(),
    state = useData("/admin/conversations"),
    [selected, setSelected] = useState(null);
  return (
    <>
      <PageHeader title={t("conversations")} description={t("manageIntro")} />
      <Load state={state}>
        <section className="panel request-list">
          {!(state.data || []).length ? (
            <Empty />
          ) : (
            state.data.map((c) => (
              <article key={c.id}>
                <button
                  className="conversation-row"
                  onClick={async () => {
                    try {
                      setSelected(
                        await api.get("/admin/conversations/" + c.id),
                      );
                    } catch (e) {
                      notify(e.message);
                    }
                  }}
                >
                  <MessagesSquare size={23} />
                  <span>
                    <strong>{c.name || t("account")}</strong>
                    <small>
                      {shortDate(c.created_at, lang)} ·{" "}
                      {c.language.toUpperCase()} · {c.messages}
                    </small>
                  </span>
                  <ArrowUpRight size={18} />
                </button>
              </article>
            ))
          )}
        </section>
      </Load>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={t("conversations")}
      >
        {selected?.map((m, i) => (
          <div className={"admin-chat " + m.role} key={i}>
            <strong>
              {m.role === "assistant" ? t("assistant") : t("account")}
            </strong>
            <p>{m.content}</p>
            {m.source && <small>{t(m.source)}</small>}
          </div>
        ))}
      </Modal>
    </>
  );
}
