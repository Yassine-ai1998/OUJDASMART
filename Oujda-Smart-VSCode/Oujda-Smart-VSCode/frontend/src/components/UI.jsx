import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Car,
  ParkingCircle,
  Luggage,
  Accessibility,
  Coffee,
  ShoppingBag,
  Wifi,
  Info,
  Search,
  KeyRound,
  ArrowRight,
  Loader2,
  X,
  TriangleAlert,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
export const icons = {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Car,
  Parking: ParkingCircle,
  Luggage,
  Accessibility,
  Coffee,
  ShoppingBag,
  Wifi,
  Info,
  Search,
  KeyRound,
};
export const categories = [
  "flights",
  "checkin",
  "boarding",
  "baggage",
  "security",
  "parking",
  "transport",
  "assistance",
  "services",
  "complaints",
];
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Oujda Smart" dir="ltr">
      <span className="brand-icon">
        <Plane size={23} />
      </span>
      <span>
        oujda<span className="brand-blue">smart.</span>
        <small>AIRPORT ASSISTANT</small>
      </span>
    </Link>
  );
}
export function Status({ value }) {
  const { t } = useApp();
  return (
    <span className={"badge status-" + value}>
      <i />
      {t(value)}
    </span>
  );
}
export function PageHeader({ title, description, children }) {
  const { t } = useApp();
  return (
    <div className="page-title">
      <div>
        <span className="eyebrow">{t("airport")}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function Load({ state, children }) {
  const { t } = useApp();
  if (state.loading)
    return (
      <div className="skeletons" role="status" aria-label={t("loading")}>
        <span className="sr-only">{t("loading")}</span>
        <div />
        <div />
        <div />
      </div>
    );
  if (state.error)
    return (
      <div className="error-box" role="alert">
        <TriangleAlert size={22} />
        <p>{state.error}</p>
        <button className="btn" onClick={state.refresh}>
          {t("retry")}
        </button>
      </div>
    );
  return children;
}
export function Empty() {
  const { t } = useApp();
  return (
    <div className="empty">
      <Search size={28} />
      <p>{t("noResults")}</p>
    </div>
  );
}
export function Notice({ children }) {
  return (
    <div className="notice">
      <Info size={16} />
      <span>{children}</span>
    </div>
  );
}
export function Modal({ open, onClose, title, children }) {
  const ref = useRef();
  const { t } = useApp();
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button className="icon-btn" onClick={onClose} aria-label={t("cancel")}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function BusyButton({ busy, children, ...props }) {
  return (
    <button disabled={busy} {...props}>
      {busy ? <Loader2 size={17} className="spin" /> : null}
      {children}
    </button>
  );
}
export function time(d, lang = "fr") {
  if (!d || Number.isNaN(new Date(d).getTime())) return "—";
  return new Date(d).toLocaleTimeString(
    lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR",
    {
      timeZone: "Africa/Casablanca",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}
export function shortDate(d, lang = "fr") {
  if (!d || Number.isNaN(new Date(d).getTime())) return "—";
  return new Date(d).toLocaleDateString(
    lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR",
    { timeZone: "Africa/Casablanca", day: "numeric", month: "short" },
  );
}
export function Airline({ name }) {
  return (
    <span className="airline">
      <span
        className={
          "airline-logo " +
          (name.includes("Ryanair")
            ? "ryan"
            : name.includes("Royal")
              ? "royal"
              : name.includes("Transavia")
                ? "trans"
                : "tui")
        }
      >
        <Plane size={15} />
      </span>
      {name}
    </span>
  );
}
export function FlightTable({ flights, compact = false }) {
  const { t, lang } = useApp();
  if (!flights.length) return <Empty />;
  return (
    <div className="responsive-flights">
      <div className="flight-mobile-list">
        {flights.map((flight) => (
          <Link
            className="mobile-flight-card"
            to={"/flights/" + flight.id}
            key={flight.id}
          >
            <div className="mobile-flight-heading">
              <strong dir="ltr">{flight.number}</strong>
              <Airline name={flight.airline} />
              <small>{shortDate(flight.scheduled_at, lang)}</small>
            </div>
            <div className="mobile-flight-route">
              <div>
                <small>
                  {t(
                    flight.direction === "departure"
                      ? "departures"
                      : "arrivals",
                  )}
                </small>
                <strong>{flight.city}</strong>
              </div>
              <div>
                <small>{t("scheduled")}</small>
                <strong>{time(flight.scheduled_at, lang)}</strong>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
            </div>
            <div className="mobile-flight-footer">
              <Status value={flight.status} />
              <span>
                {t("gate")} <b>{flight.gate}</b>
              </span>
              {!compact && (
                <span>
                  {t("estimated")} <b>{time(flight.estimated_at, lang)}</b>
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="table-scroll">
        <table className="flight-table">
          <thead>
            <tr>
              <th>{t("flight")}</th>
              <th>{t("destination")}</th>
              <th>{t("scheduled")}</th>
              {!compact && <th>{t("estimated")}</th>}
              <th>{t("gate")}</th>
              <th>{t("status")}</th>
              <th>
                <span className="sr-only">{t("details")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id}>
                <td>
                  <strong>{f.number}</strong>
                  <Airline name={f.airline} />
                </td>
                <td>
                  <Link to={"/flights/" + f.id} className="city-link">
                    {f.city}
                  </Link>
                  <small>
                    {t(f.direction === "departure" ? "departures" : "arrivals")}
                  </small>
                </td>
                <td className="time-cell">
                  {time(f.scheduled_at, lang)}
                  <small>{shortDate(f.scheduled_at, lang)}</small>
                </td>
                {!compact && (
                  <td className="time-cell">{time(f.estimated_at, lang)}</td>
                )}
                <td>
                  <span className="gate">{f.gate}</span>
                </td>
                <td>
                  <Status value={f.status} />
                </td>
                <td>
                  <Link
                    className="icon-btn"
                    to={"/flights/" + f.id}
                    aria-label={t("details") + " " + f.number}
                  >
                    <ArrowRight size={17} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function AssistantCTA() {
  const { t } = useApp();
  return (
    <section className="assistant-cta">
      <span className="cta-icon">
        <MessageCircle size={31} />
      </span>
      <div>
        <h2>{t("alwaysHere")}</h2>
        <p>{t("ctaText")}</p>
      </div>
      <Link className="btn primary" to="/assistant">
        {t("ask")}
        <ArrowRight size={17} />
      </Link>
    </section>
  );
}
