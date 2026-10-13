import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Car,
  Check,
  Clock,
  Globe2,
  HelpCircle,
  Info,
  Luggage,
  MapPin,
  MessageCircle,
  ParkingCircle,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  RotateCcw,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { travelCopy } from "../contexts/travelCopy";
import { useData } from "../hooks/useData";
import { FlightTable, Load, icons } from "../components/UI";
import AirportHero from "../components/AirportHero";

const shortcuts = [
  ["baggage", Luggage, "/services?topic=baggage"],
  ["parking", ParkingCircle, "/services?topic=parking"],
  ["transport", Car, "/services?topic=taxi"],
  ["assistance", Accessibility, "/services?topic=assistance"],
  ["Wi-Fi", Wifi, "/services?topic=wifi"],
  ["faq", HelpCircle, "/faq"],
];

function TravelChecklist({ copy }) {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("oas-checklist-v1"));
      return Array.isArray(saved) && saved.length === 3
        ? saved.map((value) => value === true)
        : [false, false, false];
    } catch {
      return [false, false, false];
    }
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem("oas-checklist-v1", JSON.stringify(checked));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [checked]);
  const count = checked.filter(Boolean).length;
  return (
    <aside className="travel-checklist">
      <div className="checklist-heading">
        <span className="eyebrow">{copy.checklistEyebrow}</span>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setChecked([false, false, false])}
          aria-label={copy.reset}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <h3>{copy.checklistTitle}</h3>
      <p>{copy.checklistText}</p>
      <div className="checklist-items">
        {copy.checklistItems.map((item, index) => (
          <label key={index} className={checked[index] ? "is-done" : ""}>
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={(event) =>
                setChecked((current) =>
                  current.map((value, i) =>
                    i === index ? event.target.checked : value,
                  ),
                )
              }
            />
            <span className="checklist-check" aria-hidden="true">
              {checked[index] && <Check size={14} />}
            </span>
            <span>{item}</span>
          </label>
        ))}
      </div>
      <div className="checklist-progress">
        <span aria-live="polite">
          {count} / 3 {copy.checklistProgress}
        </span>
        <progress value={count} max={3} aria-label={copy.checklistTitle} />
      </div>
      {saved && (
        <small>
          <ShieldCheck size={13} />
          {copy.checklistSaved}
        </small>
      )}
    </aside>
  );
}

export function Home() {
  const { t, lang, tr } = useApp();
  const copy = travelCopy[lang] || travelCopy.fr;
  const navigate = useNavigate();
  const [direction, setDirection] = useState("departure");
  const [query, setQuery] = useState("");
  const flights = useData("/flights?direction=" + direction);
  const services = useData("/services");
  function findFlight(event) {
    event.preventDefault();
    navigate("/flights?" + new URLSearchParams({ direction, q: query.trim() }));
  }
  return (
    <main className="international-home">
      <section className="welcome-section">
        <div className="container">
          <AirportHero />
          <section className="flight-finder" aria-label={copy.searchTitle}>
            <div className="finder-top">
              <div className="finder-directions">
                {[
                  ["departure", PlaneTakeoff, "departures"],
                  ["arrival", PlaneLanding, "arrivals"],
                ].map(([value, Icon, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={direction === value}
                    className={direction === value ? "selected" : ""}
                    onClick={() => setDirection(value)}
                  >
                    <Icon size={18} />
                    {t(label)}
                  </button>
                ))}
              </div>
              <span className="finder-demo">
                <Info size={14} />
                {t("demo")}
              </span>
            </div>
            <form className="finder-form" onSubmit={findFlight}>
              <span className="finder-plane" aria-hidden="true">
                <Plane size={24} />
              </span>
              <label htmlFor="home-flight-search">
                <span>{copy.searchLabel}</span>
                <input
                  id="home-flight-search"
                  type="search"
                  maxLength={80}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.searchHint}
                />
              </label>
              <button className="btn primary" type="submit">
                <Search size={18} />
                {copy.searchButton}
                <ArrowRight size={17} />
              </button>
            </form>
          </section>
        </div>
      </section>
      <div className="container">
        <section className="essential-shortcuts" aria-label={copy.shortcuts}>
          <p>{copy.shortcuts}</p>
          <div>
            {shortcuts.map(([key, Icon, url]) => (
              <Link to={url} key={key}>
                <Icon size={21} />
                <span>{key === "Wi-Fi" ? key : t(key)}</span>
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </section>
        <section className="flight-overview">
          <div className="section-title">
            <div>
              <span className="eyebrow">{copy.boardEyebrow}</span>
              <h2>{copy.boardTitle}</h2>
              <p>{copy.boardText}</p>
            </div>
            <Link className="text-link" to="/flights">
              {t("allFlights")}
              <ArrowRight size={17} />
            </Link>
          </div>
          <Link className="tracking-entry" to="/tracking">
            <Radar size={20} />
            <span>{t("trackingTeaser")}</span>
            <ArrowRight size={17} />
          </Link>
          <div className="board-layout">
            <div className="flight-panel">
              <div className="board-toolbar">
                <h3>
                  <span className="board-dot" />
                  {t(direction === "departure" ? "departures" : "arrivals")}
                </h3>
                <span className="table-meta">
                  <Clock size={14} />
                  {t("moroccoTime")}
                </span>
              </div>
              <Load state={flights}>
                <FlightTable
                  flights={(flights.data || []).slice(0, 4)}
                  compact
                />
              </Load>
              <div className="board-foot">
                <span>
                  <Info size={13} />
                  {copy.preview}
                </span>
                <Link to={"/flights?direction=" + direction}>
                  {t("allFlights")}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <TravelChecklist copy={copy} />
          </div>
        </section>
        <section className="airport-essentials">
          <div className="section-title">
            <div>
              <span className="eyebrow">{copy.servicesEyebrow}</span>
              <h2>{copy.servicesTitle}</h2>
              <p>{copy.servicesText}</p>
            </div>
            <Link className="text-link" to="/services">
              {t("seeServices")}
              <ArrowRight size={17} />
            </Link>
          </div>
          <Load state={services}>
            <div className="service-grid home-grid">
              {(services.data || [])
                .filter((service) =>
                  ["parking", "dining", "assistance", "wifi"].includes(
                    service.slug,
                  ),
                )
                .map((service, index) => {
                  const Icon = icons[service.icon] || Info;
                  return (
                    <Link
                      className={"service-card service-" + index}
                      to={"/services?topic=" + service.slug}
                      key={service.id}
                    >
                      <div className="service-card-top">
                        <span className="service-icon">
                          <Icon size={26} />
                        </span>
                        <span>0{index + 1}</span>
                      </div>
                      <h3>{tr(service.title)}</h3>
                      <p>{tr(service.description)}</p>
                      <span className="text-link">
                        {t("learnMore")}
                        <ArrowRight size={16} />
                      </span>
                    </Link>
                  );
                })}
            </div>
          </Load>
        </section>
        <section className="intelligent-assistant">
          <div className="assistant-spotlight-copy">
            <span className="eyebrow">
              <Sparkles size={16} />
              {copy.assistantEyebrow}
            </span>
            <h2>{copy.assistantTitle}</h2>
            <p>{copy.assistantText}</p>
            <Link className="btn" to="/assistant">
              {copy.assistant}
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="assistant-preview">
            <div className="assistant-preview-top">
              <span>
                <Sparkles size={22} />
              </span>
              <div>
                <strong>Oujda Smart</strong>
                <small>Français · English · العربية</small>
              </div>
              <Globe2 size={22} />
            </div>
            <p>{copy.assistantHint}</p>
            {["parkingQ", "baggageQ", "checkinQ"].map((key) => (
              <Link
                key={key}
                to={"/assistant?" + new URLSearchParams({ question: t(key) })}
              >
                {t(key)}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <small>
              <ShieldCheck size={13} />
              {copy.local}
            </small>
          </div>
        </section>
        <section className="feedback-strip">
          <span className="feedback-icon">
            <MessageCircle size={25} />
          </span>
          <div>
            <h3>{copy.feedbackTitle}</h3>
            <p>{copy.feedbackText}</p>
          </div>
          <Link className="text-link" to="/complaints">
            {copy.feedbackAction}
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  );
}
