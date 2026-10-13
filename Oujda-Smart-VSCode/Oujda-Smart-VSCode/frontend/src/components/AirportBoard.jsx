import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  Clock3,
  FlaskConical,
  Loader2,
  Map as MapIcon,
  MapPin,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { airportBoardCopy } from "../contexts/airportBoardCopy";
import "../airport-board.css";

const timeZone = "Africa/Casablanca";
const knownStatuses = new Set([
  "ON_TIME",
  "DELAYED",
  "BOARDING",
  "DEPARTED",
  "ARRIVED",
  "CANCELLED",
]);
const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
function parsedDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
function dayKey(date) {
  if (!date) return "unknown";
  const parts = Object.fromEntries(
    dateKeyFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function groupFlights(flights) {
  const groups = new Map();
  for (const flight of flights) {
    const scheduled = parsedDate(flight.scheduled_at);
    const key = dayKey(scheduled);
    if (!groups.has(key))
      groups.set(key, { key, date: scheduled, flights: [] });
    groups.get(key).flights.push(flight);
  }
  return [...groups.values()]
    .sort((a, b) =>
      a.key === "unknown"
        ? 1
        : b.key === "unknown"
          ? -1
          : a.key.localeCompare(b.key),
    )
    .map((group) => ({
      ...group,
      flights: group.flights.sort(
        (a, b) =>
          (parsedDate(a.scheduled_at)?.getTime() ?? Infinity) -
          (parsedDate(b.scheduled_at)?.getTime() ?? Infinity),
      ),
    }));
}
function AirportClock({ lang, copy }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const update = () => {
      if (!document.hidden) setNow(new Date());
    };
    const timer = setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const clock = new Intl.DateTimeFormat(lang, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(now);
  const date = new Intl.DateTimeFormat(lang, {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  return (
    <div className="airport-board-clock">
      <span>
        <Clock3 size={13} aria-hidden="true" />
        {copy.localTime}
      </span>
      <time dateTime={now.toISOString()} aria-live="off">
        <strong>{clock}</strong>
        <small>{date}</small>
      </time>
    </div>
  );
}
export function AirportBoard({
  flights = [],
  direction = "departure",
  onDirectionChange,
  loading = false,
  error = "",
  onRetry,
}) {
  const { lang, t } = useApp();
  const copy = airportBoardCopy[lang] || airportBoardCopy.fr;
  const boardId = useId().replaceAll(":", "");
  const [expanded, setExpanded] = useState(null);
  const groups = useMemo(
    () => groupFlights(Array.isArray(flights) ? flights : []),
    [flights],
  );
  const formatTime = useMemo(
    () =>
      new Intl.DateTimeFormat(lang, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }),
    [lang],
  );
  const formatDay = useMemo(
    () =>
      new Intl.DateTimeFormat(lang, {
        timeZone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [lang],
  );
  const formatCount = useMemo(() => new Intl.NumberFormat(lang), [lang]);
  const renderTime = (value) => {
    const date = parsedDate(value);
    return date ? (
      <time dateTime={date.toISOString()}>{formatTime.format(date)}</time>
    ) : (
      <span aria-label={copy.notProvided}>—</span>
    );
  };
  return (
    <section
      className="airport-board"
      aria-label={copy.boardTitle}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <header className="airport-board-header">
        <div className="airport-board-identity">
          <span className="airport-board-brand">
            <Plane size={15} aria-hidden="true" />
            {copy.brand}
          </span>
          <h2>{t("airport")}</h2>
          <div className="airport-board-location">
            <MapPin size={13} aria-hidden="true" />
            <bdi dir="ltr">
              OUD <span aria-hidden="true">/</span> GMFO
            </bdi>
          </div>
        </div>
        <AirportClock lang={lang} copy={copy} />
      </header>
      <div className="airport-board-demo">
        <strong>
          <FlaskConical size={17} aria-hidden="true" />
          {copy.demo}
        </strong>
        <p>{copy.demoText}</p>
      </div>
      <div
        className="airport-board-body"
        id={`${boardId}-body`}
        aria-busy={loading}
      >
        {loading ? (
          <div className="airport-board-empty" role="status">
            <Loader2
              className="airport-board-loader"
              size={26}
              aria-hidden="true"
            />
            <p>{copy.loading}</p>
          </div>
        ) : error ? (
          <div className="airport-board-empty" role="alert">
            <p>{error}</p>
            <button type="button" className="btn" onClick={onRetry}>
              {t("retry")}
            </button>
          </div>
        ) : !groups.length ? (
          <div className="airport-board-empty">
            <Plane size={30} aria-hidden="true" />
            <h3>{copy.emptyTitle}</h3>
            <p>{copy.emptyText}</p>
          </div>
        ) : (
          groups.map((group, groupIndex) => (
            <section
              className="airport-board-day"
              key={group.key}
              aria-labelledby={`${boardId}-date-${groupIndex}`}
            >
              <div className="airport-board-date">
                <h3 id={`${boardId}-date-${groupIndex}`}>
                  {group.date ? formatDay.format(group.date) : copy.dateUnknown}
                </h3>
                <span>
                  {formatCount.format(group.flights.length)} {copy.flightCount}
                </span>
              </div>
              <div className="airport-board-columns" aria-hidden="true">
                <span>{copy.times}</span>
                <span>{copy.route}</span>
                <span>{copy.status}</span>
                <span />
              </div>
              <ul className="airport-board-flight-list">
                {group.flights.map((flight, index) => {
                  const open = expanded === flight.id;
                  const status = knownStatuses.has(flight.status)
                    ? flight.status
                    : "UNKNOWN";
                  const statusText =
                    status === "UNKNOWN" ? copy.unknownStatus : t(status);
                  const panelId = `${boardId}-detail-${groupIndex}-${index}`;
                  return (
                    <li
                      className={`airport-board-flight${open ? " is-expanded" : ""}`}
                      key={flight.id || `${group.key}-${index}`}
                    >
                      <button
                        type="button"
                        className="airport-board-row"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setExpanded(open ? null : flight.id)}
                      >
                        <span className="airport-board-times">
                          <span className="airport-board-time">
                            <small>{copy.scheduled}</small>
                            <strong>{renderTime(flight.scheduled_at)}</strong>
                          </span>
                          <span className="airport-board-time airport-board-estimated">
                            <small>{copy.estimated}</small>
                            <strong>{renderTime(flight.estimated_at)}</strong>
                          </span>
                        </span>
                        <span className="airport-board-route">
                          <span className="airport-board-city">
                            {flight.city || copy.notProvided}
                            {flight.airport_code && (
                              <bdi dir="ltr">{flight.airport_code}</bdi>
                            )}
                          </span>
                          <span className="airport-board-flight-meta">
                            <bdi dir="ltr">{flight.number || "—"}</bdi>
                            {flight.airline && (
                              <>
                                <span
                                  className="airport-board-meta-dot"
                                  aria-hidden="true"
                                />{" "}
                                <span>{flight.airline}</span>
                              </>
                            )}
                          </span>
                        </span>
                        <span className="airport-board-status-slot">
                          <span
                            className={`airport-board-status airport-board-status-${status}`}
                          >
                            <i aria-hidden="true" />
                            {statusText}
                          </span>
                        </span>
                        <span className="airport-board-expand">
                          <ChevronDown size={18} aria-hidden="true" />
                          <span className="airport-board-sr-only">
                            {open ? copy.hideDetails : copy.showDetails}
                          </span>
                        </span>
                      </button>
                      <div
                        className="airport-board-detail"
                        id={panelId}
                        hidden={!open}
                      >
                        <dl>
                          <div>
                            <dt>{copy.gate}</dt>
                            <dd>
                              <bdi>{flight.gate || copy.notProvided}</bdi>
                            </dd>
                          </div>
                          <div>
                            <dt>{copy.terminal}</dt>
                            <dd>
                              <bdi>{flight.terminal || copy.notProvided}</bdi>
                            </dd>
                          </div>
                          {flight.aircraft && (
                            <div>
                              <dt>{copy.aircraft}</dt>
                              <dd>
                                <bdi>{flight.aircraft}</bdi>
                              </dd>
                            </div>
                          )}
                        </dl>
                        <Link
                          to={`/flights/${encodeURIComponent(flight.id)}`}
                          className="airport-board-detail-link"
                        >
                          {copy.viewFlight}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
      <nav className="airport-board-tabs" aria-label={copy.navigation}>
        <button
          type="button"
          onClick={() => onDirectionChange?.("arrival")}
          aria-pressed={direction === "arrival"}
          aria-controls={`${boardId}-body`}
        >
          <PlaneLanding size={20} aria-hidden="true" />
          <span>{copy.arrivals}</span>
        </button>
        <button
          type="button"
          onClick={() => onDirectionChange?.("departure")}
          aria-pressed={direction === "departure"}
          aria-controls={`${boardId}-body`}
        >
          <PlaneTakeoff size={20} aria-hidden="true" />
          <span>{copy.departures}</span>
        </button>
        <Link to="/tracking">
          <MapIcon size={20} aria-hidden="true" />
          <span>{copy.tracking}</span>
        </Link>
      </nav>
    </section>
  );
}
export default AirportBoard;
