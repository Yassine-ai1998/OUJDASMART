import { useState, useEffect } from "react";
import {
  Link,
  useSearchParams,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  Luggage,
  ParkingCircle,
  Car,
  Accessibility,
  HelpCircle,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Clock,
  Search,
  SlidersHorizontal,
  Heart,
  MapPin,
  ShieldCheck,
  Info,
  ChevronDown,
  Plane,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import AirportBoard from "../components/AirportBoard";
import AirportHero from "../components/AirportHero";
import FlightViews from "../components/FlightViews";
import { useData } from "../hooks/useData";
import { api } from "../services/api";
import {
  PageHeader,
  Load,
  Notice,
  Empty,
  Status,
  Airline,
  AssistantCTA,
  icons,
  categories,
  time,
  shortDate,
  Modal,
} from "../components/UI";
export function Flights() {
  const { t } = useApp(),
    [params, setParams] = useSearchParams();
  const direction =
      params.get("direction") === "arrival" ? "arrival" : "departure",
    q = params.get("q") || "",
    airline = params.get("airline") || "",
    status = params.get("status") || "",
    after = params.get("after") || "",
    city = params.get("city") || "";
  const [debouncedQuery, setDebouncedQuery] = useState(q);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(q), 200);
    return () => clearTimeout(timer);
  }, [q]);
  function updateFilter(key, value, replace = true) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("direction", direction);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace },
    );
  }
  const filters = new URLSearchParams({
    direction,
    q: debouncedQuery,
    airline,
    status,
    after,
    city,
  });
  const state = useData("/flights?" + filters),
    all = useData("/flights");
  return (
    <main className="container page airport-page">
      <AirportHero variant="flights" title={t("flightBoard")}>
        <a
          className="airport-page-official"
          href="https://www.onda.ma/fr/Nos-A%C3%A9roports/A%C3%A9roport-Oujda-Angads"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("airportOfficial")} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </AirportHero>
      <FlightViews />
      <details
        className="airport-page-filters"
        open={Boolean(q || airline || status || after || city)}
      >
        <summary>{t("airportFilters")}</summary>
        <div className="flight-filters">
          <div className="search-input">
            <Search size={18} />
            <input
              value={q}
              onChange={(e) => updateFilter("q", e.target.value)}
              placeholder={t("flightSearch")}
              aria-label={t("search")}
            />
          </div>
          <select
            aria-label={t("airline")}
            value={airline}
            onChange={(e) => updateFilter("airline", e.target.value, false)}
          >
            <option value="">{t("allAirlines")}</option>
            {[...new Set((all.data || []).map((f) => f.airline))].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <select
            value={status}
            aria-label={t("status")}
            onChange={(e) => updateFilter("status", e.target.value, false)}
          >
            <option value="">{t("allStatuses")}</option>
            {[
              "ON_TIME",
              "DELAYED",
              "BOARDING",
              "DEPARTED",
              "ARRIVED",
              "CANCELLED",
            ].map((s) => (
              <option value={s} key={s}>
                {t(s)}
              </option>
            ))}
          </select>
          <input
            aria-label={t("destination")}
            value={city}
            placeholder={t("city")}
            onChange={(e) => updateFilter("city", e.target.value)}
          />
          <label className="time-filter">
            {t("after")}
            <input
              type="time"
              value={after}
              onChange={(e) => updateFilter("after", e.target.value)}
            />
          </label>
          <button
            className="text-link"
            onClick={() => setParams({ direction })}
          >
            {t("reset")}
          </button>
        </div>
      </details>
      <AirportBoard
        flights={state.data || []}
        direction={direction}
        loading={state.loading}
        error={state.error}
        onRetry={state.refresh}
        onDirectionChange={(value) => updateFilter("direction", value, false)}
      />
    </main>
  );
}
export function FlightDetails() {
  const { id } = useParams(),
    state = useData("/flights/" + id),
    { t, lang, user, notify } = useApp(),
    navigate = useNavigate();
  const [favorite, setFavorite] = useState(false),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (user)
      api
        .get("/favorites")
        .then((list) => setFavorite(list.some((f) => f.id === id)))
        .catch(() => {});
  }, [user, id]);
  async function save() {
    if (!user) return navigate("/login");
    setBusy(true);
    try {
      await api[favorite ? "delete" : "post"]("/favorites/" + id, {});
      setFavorite(!favorite);
      notify(t(favorite ? "removed" : "saved"));
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }
  const f = state.data;
  return (
    <main className="container page">
      <Link className="text-link" to="/flights">
        ← {t("back")}
      </Link>
      <Load state={state}>
        {f && (
          <>
            <PageHeader
              title={f.number + " · " + f.city}
              description={f.airline}
            />
            <Notice>{t("flightDemo")}</Notice>
            <section className="flight-detail">
              <div className="flight-route">
                <div>
                  <span>
                    {t(f.direction === "departure" ? "departures" : "arrivals")}
                  </span>
                  <h2>{f.direction === "departure" ? "OUD" : f.city}</h2>
                  <p>
                    {f.direction === "departure" ? t("airport") : f.airline}
                  </p>
                </div>
                <div className="route-plane">
                  <span />
                  <Plane size={30} />
                  <span />
                </div>
                <div>
                  <span>{t("destination")}</span>
                  <h2>{f.direction === "departure" ? f.city : "OUD"}</h2>
                  <p>{shortDate(f.scheduled_at, lang)}</p>
                </div>
              </div>
              <div className="detail-metrics">
                {[
                  ["scheduled", time(f.scheduled_at, lang)],
                  ["estimated", time(f.estimated_at, lang)],
                  ["gate", f.gate],
                  ["status", <Status value={f.status} />],
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{t(k)}</small>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <div className="flex-between">
                <span className="muted">{t("moroccoTime")}</span>
                <button
                  disabled={busy}
                  className={"btn " + (favorite ? "" : "primary")}
                  onClick={save}
                >
                  <Heart size={17} fill={favorite ? "currentColor" : "none"} />
                  {t(favorite ? "saved" : "favorite")}
                </button>
              </div>
            </section>
          </>
        )}
      </Load>
      <AssistantCTA />
    </main>
  );
}
export function Services() {
  const { t, tr } = useApp(),
    state = useData("/services"),
    [params] = useSearchParams(),
    [selected, setSelected] = useState(null);
  const topic = params.get("topic");
  function view(s) {
    setSelected(s);
    api.post("/services/" + s.id + "/view", {}).catch(() => {});
  }
  return (
    <main className="container page">
      <PageHeader title={t("servicesTitle")} description={t("servicesIntro")} />
      <Notice>{t("servicesDisclaimer")}</Notice>
      <Load state={state}>
        <div className="service-grid">
          {(state.data || []).map((s, i) => {
            const Icon = icons[s.icon] || Info;
            return (
              <article
                className={
                  "service-card service-" +
                  (i % 4) +
                  (topic === s.slug ? " highlighted" : "")
                }
                key={s.id}
              >
                <span className="service-icon">
                  <Icon size={29} />
                </span>
                <h3>{tr(s.title)}</h3>
                <p>{tr(s.description)}</p>
                <span className="service-location">
                  <MapPin size={14} />
                  {tr(s.location)}
                </span>
                <button className="text-link" onClick={() => view(s)}>
                  {t("learnMore")}
                  <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </Load>
      <AssistantCTA />
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={tr(selected?.title)}
      >
        {selected && (
          <>
            <p>{tr(selected.description)}</p>
            <h4>{t("location")}</h4>
            <p>{tr(selected.location)}</p>
            <h4>{t("hours")}</h4>
            <p>{tr(selected.hours)}</p>
            <Notice>{t("servicesDisclaimer")}</Notice>
            <Link className="btn primary" to="/assistant">
              {t("ask")}
            </Link>
          </>
        )}
      </Modal>
    </main>
  );
}
export function FAQ() {
  const { t, tr } = useApp(),
    [q, setQ] = useState(""),
    [cat, setCat] = useState(""),
    state = useData("/faq?" + new URLSearchParams({ q, category: cat }));
  return (
    <main className="container page">
      <PageHeader title={t("faqTitle")} description={t("faqIntro")} />
      <div className="faq-search search-input">
        <Search size={20} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("faqSearch")}
          aria-label={t("search")}
        />
      </div>
      <div className="faq-layout">
        <aside className="faq-categories">
          {["", ...categories].map((c) => (
            <button
              className={cat === c ? "active" : ""}
              key={c}
              onClick={() => setCat(c)}
            >
              {t(c || "all")}
              <ArrowRight size={14} />
            </button>
          ))}
        </aside>
        <section className="faq-list">
          <Load state={state}>
            {!(state.data || []).length ? (
              <Empty />
            ) : (
              state.data.map((f) => (
                <details key={f.id}>
                  <summary>
                    {tr(f.question)}
                    <ChevronDown size={18} />
                  </summary>
                  <p>{tr(f.answer)}</p>
                  <small>
                    {t(f.category)} · {t("academic")}
                  </small>
                </details>
              ))
            )}
          </Load>
        </section>
      </div>
      <AssistantCTA />
    </main>
  );
}
