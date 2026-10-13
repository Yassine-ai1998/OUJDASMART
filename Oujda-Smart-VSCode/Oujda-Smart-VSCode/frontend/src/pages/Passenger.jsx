import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, Navigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Plus,
  Sparkles,
  History,
  ArrowRight,
  ShieldCheck,
  UserRound,
  Plane,
  Heart,
  CheckCircle2,
  LogOut,
  Loader2,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useData } from "../hooks/useData";
import { api } from "../services/api";
import {
  PageHeader,
  Notice,
  Load,
  Empty,
  Status,
  BusyButton,
  FlightTable,
  shortDate,
} from "../components/UI";
export function Assistant() {
  const { t, lang, user, notify } = useApp(),
    [params] = useSearchParams(),
    [sessionId, setSessionId] = useState(params.get("session") || null),
    [messages, setMessages] = useState([]),
    [input, setInput] = useState((params.get("question") || "").slice(0, 1500)),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const history = useData("/chat"),
    bottom = useRef();
  useEffect(() => {
    if (sessionId)
      api
        .get("/chat/" + sessionId)
        .then(setMessages)
        .catch((e) => {
          setError(e.message);
          setSessionId(null);
        });
    else setMessages([]);
  }, [sessionId, user?.id]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);
  async function send(value) {
    const message = (value || input).trim();
    if (busy || message.length < 2) return;
    setBusy(true);
    setError("");
    try {
      const r = await api.post("/chat", {
        message,
        language: lang,
        ...(sessionId ? { sessionId } : {}),
      });
      setMessages((m) => [
        ...m,
        { role: "user", content: message },
        { role: "assistant", content: r.text, source: r.source },
      ]);
      setInput("");
      if (!sessionId) setSessionId(r.sessionId);
      history.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="container page">
      <PageHeader
        title={t("assistantTitle")}
        description={t("assistantIntro")}
      />
      <div className="chat-layout">
        <aside className="chat-history">
          <button
            className="btn primary full"
            disabled={busy}
            onClick={() => {
              setSessionId(null);
              setMessages([]);
              setError("");
            }}
          >
            <Plus size={17} />
            {t("newChat")}
          </button>
          <h4>
            <History size={15} />
            {t("history")}
          </h4>
          <Load state={history}>
            {(history.data || []).map((h) => (
              <button
                disabled={busy}
                className={sessionId === h.id ? "active" : ""}
                key={h.id}
                onClick={() => setSessionId(h.id)}
              >
                <MessageCircle size={16} />
                <span>
                  {h.title || t("newChat")}
                  <small>{shortDate(h.created_at, lang)}</small>
                </span>
              </button>
            ))}
            {!history.data?.length && (
              <p className="muted tiny">{t("empty")}</p>
            )}
          </Load>
          <div className="chat-history-note">
            <ShieldCheck size={24} />
            <p>{t("privacy")}</p>
          </div>
        </aside>
        <section className="chat-main">
          <div className="chat-top">
            <span className="assistant-avatar">
              <Sparkles size={23} />
            </span>
            <div>
              <strong>Oujda Smart Assistant</strong>
              <small>
                <i />
                {t("localKnowledge")}
              </small>
            </div>
            <span className="lang-badge">{lang.toUpperCase()}</span>
          </div>
          <div className="chat-messages">
            {!messages.length && (
              <div className="chat-intro">
                <span className="large-ai">
                  <Sparkles size={35} />
                </span>
                <h2>{t("chatWelcome")}</h2>
                <div className="suggestions">
                  {["parkingQ", "baggageQ", "taxiQ", "checkinQ"].map((q) => (
                    <button key={q} disabled={busy} onClick={() => send(t(q))}>
                      {t(q)}
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div className={"chat-message " + m.role} key={i}>
                {m.role === "assistant" && (
                  <span className="message-avatar">
                    <Sparkles size={16} />
                  </span>
                )}
                <div>
                  <p>{m.content}</p>
                  {m.source && <small>{t(m.source)}</small>}
                </div>
              </div>
            ))}
            {busy && (
              <div className="typing">
                <span />
                <span />
                <span />
                {t("typing")}
              </div>
            )}
            <div ref={bottom} />
          </div>
          <form
            className="chat-compose"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div>
              <input
                required
                minLength={2}
                maxLength={1500}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatPlaceholder")}
                aria-label={t("message")}
                disabled={busy}
              />
              <button
                className="btn primary"
                disabled={busy || input.trim().length < 2}
                aria-label={t("send")}
              >
                <Send size={19} />
              </button>
            </div>
            <small>{t("chatDisclaimer")}</small>
          </form>
        </section>
      </div>
    </main>
  );
}
export function Complaint() {
  const { t, user, lang } = useApp(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState(null),
    [tracked, setTracked] = useState(null),
    [mode, setMode] = useState("new");
  async function submit(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    try {
      if (mode === "new") setResult(await api.post("/complaints", d));
      else setTracked(await api.post("/complaints/track", d));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="container page">
      <PageHeader
        title={t("complaintTitle")}
        description={t("complaintIntro")}
      />
      <Notice>{t("notOfficial")}</Notice>
      <div className="form-layout">
        <section className="form-panel">
          <div className="tabs form-tabs">
            <button
              className={mode === "new" ? "selected" : ""}
              onClick={() => {
                setMode("new");
                setError("");
              }}
            >
              {t("complaints")}
            </button>
            <button
              className={mode === "track" ? "selected" : ""}
              onClick={() => {
                setMode("track");
                setError("");
              }}
            >
              {t("track")}
            </button>
          </div>
          {result && mode === "new" ? (
            <div className="success">
              <CheckCircle2 size={44} />
              <h2>{t("received")}</h2>
              <label>
                {t("reference")}
                <code>{result.reference}</code>
              </label>
              <label>
                {t("accessCode")}
                <code>{result.accessCode}</code>
              </label>
              <p>{t("keepCode")}</p>
              <button className="btn" onClick={() => setMode("track")}>
                {t("track")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              {mode === "new" ? (
                <>
                  <div className="form-row">
                    <label>
                      {t("name")}
                      <input
                        required
                        name="name"
                        defaultValue={user?.name}
                        maxLength={100}
                        autoComplete="name"
                      />
                    </label>
                    <label>
                      {t("email")}
                      <input
                        required
                        type="email"
                        name="email"
                        defaultValue={user?.email}
                        maxLength={180}
                        autoComplete="email"
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      {t("phone")}
                      <input name="phone" type="tel" maxLength={30} />
                    </label>
                    <label>
                      {t("category")}
                      <select name="category">
                        {[
                          "flights",
                          "baggage",
                          "parking",
                          "transport",
                          "assistance",
                          "services",
                          "other",
                        ].map((c) => (
                          <option value={c} key={c}>
                            {t(c)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    {t("subject")}
                    <input required name="subject" maxLength={180} />
                  </label>
                  <label>
                    {t("message")}
                    <textarea
                      required
                      name="message"
                      minLength={10}
                      maxLength={4000}
                      rows={5}
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      {t("priority")}
                      <select name="priority" defaultValue="NORMAL">
                        {["LOW", "NORMAL", "HIGH"].map((p) => (
                          <option value={p} key={p}>
                            {t(p)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t("optionalFlight")}
                      <input name="flight_number" maxLength={12} />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <label>
                    {t("reference")}
                    <input
                      required
                      name="reference"
                      maxLength={30}
                      defaultValue={result?.reference}
                    />
                  </label>
                  <label>
                    {t("email")}
                    <input
                      required
                      name="email"
                      type="email"
                      defaultValue={user?.email}
                    />
                  </label>
                  <label>
                    {t("accessCode")}
                    <input
                      required
                      name="accessCode"
                      minLength={10}
                      maxLength={100}
                      defaultValue={result?.accessCode}
                    />
                  </label>
                </>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <BusyButton className="btn primary" busy={busy}>
                {t(mode === "new" ? "submitComplaint" : "track")}
                <ArrowRight size={16} />
              </BusyButton>
            </form>
          )}
          {mode === "track" && tracked && (
            <div className="tracked">
              <h3>{tracked.subject}</h3>
              <Status value={tracked.status} />
              <p>{shortDate(tracked.updated_at, lang)}</p>
              {tracked.response && (
                <>
                  <h4>{t("response")}</h4>
                  <p>{tracked.response}</p>
                </>
              )}
            </div>
          )}
        </section>
        <aside className="form-aside">
          <span className="service-icon">
            <MessageCircle size={30} />
          </span>
          <h2>{t("notFoundAnswer")}</h2>
          <p>{t("ctaText")}</p>
          <Link className="btn" to="/assistant">
            {t("ask")}
            <ArrowRight size={16} />
          </Link>
          <hr />
          <ShieldCheck size={24} />
          <p className="tiny">{t("privacy")}</p>
          <p className="tiny">{t("notOfficial")}</p>
        </aside>
      </div>
    </main>
  );
}
export function Auth({ register = false }) {
  const { t, setUser, user } = useApp(),
    navigate = useNavigate(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (user)
    return (
      <Navigate to={user.role === "ADMIN" ? "/admin" : "/account"} replace />
    );
  return (
    <main className="container page auth-page">
      <div className="auth-visual">
        <Plane size={50} />
        <span className="eyebrow">OUJDA SMART</span>
        <h2>{t("heroTitle")}</h2>
        <p>{t("loginIntro")}</p>
        <span className="auth-route">
          OUD <span>················</span> <Plane size={24} />
        </span>
        <small>{t("academic")}</small>
      </div>
      <section className="auth-form">
        <span className="eyebrow">{t("account")}</span>
        <h1>{t(register ? "register" : "welcomeBack")}</h1>
        <p className="muted">{t("loginIntro")}</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const d = Object.fromEntries(new FormData(e.currentTarget));
            setBusy(true);
            setError("");
            try {
              const u = await api.post(
                "/auth/" + (register ? "register" : "login"),
                d,
              );
              setUser(u);
              navigate(u.role === "ADMIN" ? "/admin" : "/account");
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {register && (
            <label>
              {t("name")}
              <input required name="name" maxLength={100} autoComplete="name" />
            </label>
          )}
          <label>
            {t("email")}
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              maxLength={180}
            />
          </label>
          <label>
            {t("password")}
            <input
              required
              type="password"
              name="password"
              autoComplete={register ? "new-password" : "current-password"}
              minLength={register ? 12 : 1}
              maxLength={72}
            />
            {register && <small>{t("passwordHint")}</small>}
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <BusyButton className="btn primary full" busy={busy}>
            {t(register ? "register" : "login")}
            <ArrowRight size={17} />
          </BusyButton>
        </form>
        <p>
          {t(register ? "hasAccount" : "noAccount")}{" "}
          <Link className="text-link" to={register ? "/login" : "/register"}>
            {t(register ? "login" : "register")}
          </Link>
        </p>
      </section>
    </main>
  );
}
export function UserDashboard() {
  const { t, user, setUser, lang } = useApp(),
    [tab, setTab] = useState("favorites"),
    navigate = useNavigate();
  const state = useData(
    tab === "favorites"
      ? "/favorites"
      : tab === "complaints"
        ? "/complaints/mine"
        : "/chat",
  );
  return (
    <main className="container page">
      <PageHeader
        title={t("hello") + ", " + user.name}
        description={t("loginIntro")}
      >
        <button
          className="btn"
          onClick={async () => {
            await api.post("/auth/logout", {});
            setUser(null);
            navigate("/");
          }}
        >
          <LogOut size={17} />
          {t("logout")}
        </button>
      </PageHeader>
      <div className="panel">
        <div className="tabs account-tabs">
          {[
            ["favorites", "myFlights", Heart],
            ["complaints", "myComplaints", MessageCircle],
            ["chats", "myChats", History],
          ].map(([k, label, Icon]) => (
            <button
              className={tab === k ? "selected" : ""}
              key={k}
              onClick={() => setTab(k)}
            >
              <Icon size={17} />
              {t(label)}
            </button>
          ))}
        </div>
        <Load state={state}>
          {tab === "favorites" ? (
            <FlightTable flights={state.data || []} />
          ) : !state.data?.length ? (
            <Empty />
          ) : (
            <div className="request-list">
              {state.data.map((r) => (
                <article key={r.id}>
                  {tab === "complaints" ? (
                    <>
                      <div className="flex-between">
                        <h3>{r.subject}</h3>
                        <Status value={r.status} />
                      </div>
                      <small>
                        {r.reference} · {shortDate(r.created_at, lang)}
                      </small>
                      <p>{r.message}</p>
                      {r.response && (
                        <div className="admin-response">
                          <strong>{t("response")}</strong>
                          <p>{r.response}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link to={"/assistant?session=" + r.id}>
                      <MessageCircle size={20} />
                      <span>
                        <strong>{r.title || t("newChat")}</strong>
                        <small>{shortDate(r.created_at, lang)}</small>
                      </span>
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          )}
        </Load>
      </div>
    </main>
  );
}
