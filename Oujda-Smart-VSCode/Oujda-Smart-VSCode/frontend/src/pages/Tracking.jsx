import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Info,
  LocateFixed,
  MapPinned,
  Pause,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Play,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { trackingCopy } from "../contexts/trackingCopy";
import { api } from "../services/api";
import TrackingMap from "../components/TrackingMap";
import FlightViews from "../components/FlightViews";
import AirportHero from "../components/AirportHero";
import "../tracking.css";

const defaultAirport = {
  iata: "OUD",
  icao: "GMFO",
  name: "Oujda-Angads",
  lat: 34.786111,
  lon: -1.925556,
};
const acceptedStatuses = new Set([
  "not_configured",
  "live",
  "sandbox",
  "stale",
  "unavailable",
]);
const minimumInterval = 60_000;
const staleRetention = 5 * 60_000;
function expireStaleSnapshot(data, now = Date.now()) {
  if (data?.status !== "stale") return data;
  const fetchedAt = Date.parse(data.fetchedAt);
  if (Number.isFinite(fetchedAt) && now - fetchedAt < staleRetention)
    return data;
  return { ...data, status: "unavailable", flights: [], fetchedAt: null };
}
function refreshInterval(data) {
  const seconds = Number(data?.refreshAfterSeconds);
  return Number.isFinite(seconds)
    ? Math.max(minimumInterval, seconds * 1000)
    : minimumInterval;
}
function useTracking() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [version, setVersion] = useState(0);
  const snapshot = useRef(null);
  const nextRequestAt = useRef(0);
  const manual = useRef(false);
  const refresh = useCallback(() => {
    manual.current = true;
    setVersion((v) => v + 1);
  }, []);
  useEffect(() => {
    let disposed = false;
    let timer;
    let controller;
    const schedule = () => {
      clearTimeout(timer);
      if (disposed || paused || document.hidden) return;
      timer = setTimeout(load, Math.max(0, nextRequestAt.current - Date.now()));
    };
    async function load() {
      if (disposed || paused || document.hidden) return;
      clearTimeout(timer);
      controller = new AbortController();
      const request = controller;
      const startedAt = Date.now();
      nextRequestAt.current = startedAt + refreshInterval(snapshot.current);
      setBusy(true);
      try {
        const response = await api.get("/tracking/flights", {
          signal: request.signal,
        });
        if (disposed || request.signal.aborted) return;
        if (
          !acceptedStatuses.has(response?.status) ||
          !Array.isArray(response.flights)
        )
          throw new Error("Invalid tracking response");
        const next = expireStaleSnapshot({
          ...response,
          flights: response.flights
            .filter((flight) => flight && flight.id)
            .map((flight) =>
              response.status === "stale"
                ? { ...flight, positionStale: true }
                : flight,
            ),
        });
        snapshot.current = next;
        nextRequestAt.current = Date.now() + refreshInterval(next);
        setData(next);
      } catch {
        if (disposed || request.signal.aborted) return;
        const previous = snapshot.current;
        const failed = previous?.flights?.length
          ? expireStaleSnapshot({
              ...previous,
              status: "stale",
              reason: "provider_error",
              flights: previous.flights.map((flight) => ({
                ...flight,
                positionStale: true,
              })),
            })
          : {
              ...previous,
              provider: previous?.provider || "unknown",
              status: "unavailable",
              reason: "provider_error",
              mode: previous?.mode || "disabled",
              airport: previous?.airport || defaultAirport,
              flights: [],
              fetchedAt: null,
              refreshAfterSeconds: previous?.refreshAfterSeconds || 300,
            };
        snapshot.current = failed;
        nextRequestAt.current = Date.now() + refreshInterval(failed);
        setData(failed);
      } finally {
        if (!disposed && !request.signal.aborted) {
          setBusy(false);
          schedule();
        }
      }
    }
    function visibilityChanged() {
      if (document.hidden) {
        clearTimeout(timer);
        controller?.abort();
        setBusy(false);
      } else schedule();
    }
    setBusy(false);
    document.addEventListener("visibilitychange", visibilityChanged);
    if (manual.current && !paused && !document.hidden) {
      manual.current = false;
      load();
    } else schedule();
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [paused, version]);
  useEffect(() => {
    if (data?.status !== "stale") return;
    const expire = () => {
      if (snapshot.current !== data) return;
      const next = expireStaleSnapshot(data);
      if (next !== data) {
        snapshot.current = next;
        setData(next);
      }
    };
    const remaining = Date.parse(data.fetchedAt) + staleRetention - Date.now();
    const timer = setTimeout(
      expire,
      Math.max(0, Number.isFinite(remaining) ? remaining : 0),
    );
    document.addEventListener("visibilitychange", expire);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", expire);
    };
  }, [data]);
  return { data, busy, paused, setPaused, refresh };
}
export function trackingTime(value, lang, fallback = "—") {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(lang, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Africa/Casablanca",
  }).format(date);
}
export function oldPosition(flight, now) {
  const date = Date.parse(flight.positionAt);
  return flight.positionStale || !Number.isFinite(date) || now - date > 120_000;
}
function number(value, lang, suffix = "") {
  return typeof value === "number" && Number.isFinite(value)
    ? `${new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }).format(value)}${suffix ? ` ${suffix}` : ""}`
    : "—";
}
function FlightDetails({ flight, copy, lang, now, onClose, nearby }) {
  return (
    <section className="tracking-details" aria-label={copy.details}>
      <div className="tracking-detail-heading">
        <div>
          <span className="eyebrow">{copy.selected}</span>
          <h2>
            <bdi dir="ltr">
              {flight.number || flight.callsign || flight.registration || "—"}
            </bdi>
          </h2>
        </div>
        <button
          className="icon-btn"
          type="button"
          onClick={onClose}
          aria-label={copy.close}
        >
          <X size={19} />
        </button>
      </div>
      {flight.origin && flight.destination ? (
        <div className="tracking-route">
          <bdi dir="ltr">{flight.origin || "—"}</bdi>
          <Plane size={20} aria-hidden="true" />
          <bdi dir="ltr">{flight.destination || "—"}</bdi>
        </div>
      ) : (
        <p className="tracking-route tracking-route-unknown">
          {copy.routeUnknown}
        </p>
      )}
      <span
        className={
          "tracking-position-label " + (oldPosition(flight, now) ? "old" : "")
        }
      >
        <Clock3 size={13} />
        {oldPosition(flight, now) ? copy.oldPosition : copy.currentPosition}
      </span>
      <dl className="tracking-metrics">
        {[
          [copy.callsign, flight.callsign],
          [copy.registration, flight.registration],
          [copy.aircraft, flight.aircraft],
          [copy.altitude, number(flight.altitudeFeet, lang, copy.feet)],
          [copy.speed, number(flight.speedKnots, lang, copy.knots)],
          [copy.heading, number(flight.heading, lang, "°")],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              <bdi>{value || "—"}</bdi>
            </dd>
          </div>
        ))}
      </dl>
      <div className="tracking-detail-time">
        <span>{copy.position}</span>
        <strong>
          {trackingTime(flight.positionAt, lang, copy.positionUnknown)}
        </strong>
        {!nearby && (
          <>
            <span>{copy.eta}</span>
            <strong>{trackingTime(flight.estimatedArrival, lang)}</strong>
          </>
        )}
        <small>{copy.timeZone}</small>
      </div>
    </section>
  );
}
export function Tracking() {
  const { lang } = useApp();
  const baseCopy = trackingCopy[lang] || trackingCopy.fr;
  const { data, busy, paused, setPaused, refresh } = useTracking();
  const isOpenSky = data?.provider === "opensky";
  const isAdsb = data?.provider === "adsb_lol";
  const nearby = isOpenSky || isAdsb;
  const isFr24 = data?.provider === "flightradar24";
  const radiusNm =
    Number.isFinite(data?.radiusNm) &&
    data.radiusNm >= 25 &&
    data.radiusNm <= 250
      ? data.radiusNm
      : 150;
  const withRadius = (text) =>
    text
      .replaceAll("{provider}", isOpenSky ? "OpenSky Network" : "ADSB.lol")
      .replaceAll("{radiusNm}", number(radiusNm, lang))
      .replaceAll("{radiusKm}", number(Math.round(radiusNm * 1.852), lang));
  const copy = nearby
    ? {
        ...baseCopy,
        title: baseCopy.nearbyTitle,
        intro: withRadius(baseCopy.nearbyIntro),
        listTitle: baseCopy.nearbyListTitle,
        count: baseCopy.nearbyCount,
        not_configuredText: withRadius(baseCopy.nearbyNotConfiguredText),
        emptyNotConfiguredText: withRadius(
          baseCopy.nearbyEmptyNotConfiguredText,
        ),
        search: baseCopy.nearbySearch,
        searchHint: baseCopy.nearbySearchHint,
        noFlightsText: withRadius(baseCopy.nearbyNoFlightsText),
        noResults: baseCopy.nearbyNoResults,
        select: baseCopy.nearbySelect,
        selected: baseCopy.nearbySelected,
        details: baseCopy.nearbyDetails,
        noSelection: baseCopy.nearbyNoSelection,
        noSelectionText: baseCopy.nearbyNoSelectionText,
      }
    : {
        ...baseCopy,
        intro: isFr24 ? baseCopy.intro : baseCopy.genericIntro,
        ...(!isFr24
          ? {
              not_configuredText: baseCopy.genericInactive,
              emptyNotConfiguredText: baseCopy.genericInactive,
            }
          : {}),
      };
  const sourceName = isOpenSky
    ? "OpenSky Network"
    : isAdsb
      ? "ADSB.lol"
      : isFr24
        ? "Flightradar24"
        : data
          ? copy.sourceUnknown
          : copy.sourcePending;
  const sourceUrl = isOpenSky
    ? "https://opensky-network.org"
    : isAdsb
      ? "https://www.adsb.lol"
      : isFr24
        ? "https://www.flightradar24.com/"
        : null;
  const [direction, setDirection] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectionVersion, setSelectionVersion] = useState(0);
  const [centerVersion, setCenterVersion] = useState(0);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const updateTime = () => {
      if (!document.hidden) setNow(Date.now());
    };
    const timer = setInterval(updateTime, 30_000);
    document.addEventListener("visibilitychange", updateTime);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", updateTime);
    };
  }, []);
  const flights = useMemo(
    () =>
      (data?.flights || []).filter(
        (flight) => !nearby || now - Date.parse(flight.positionAt) <= 300000,
      ),
    [data?.flights, nearby, now],
  );
  const visibleFlights = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return flights.filter(
      (flight) =>
        (nearby || direction === "all" || flight.direction === direction) &&
        (!search ||
          [
            flight.number,
            flight.callsign,
            flight.registration,
            flight.aircraft,
            flight.origin,
            flight.destination,
          ].some((value) =>
            String(value || "")
              .toLocaleLowerCase()
              .includes(search),
          )),
    );
  }, [flights, direction, query, nearby]);
  const selected = visibleFlights.find((flight) => flight.id === selectedId);
  const selectFlight = useCallback((id) => {
    setSelectedId(id);
    setSelectionVersion((value) => value + 1);
  }, []);
  const receivedAt = Date.parse(data?.fetchedAt);
  const expired =
    data?.status === "live" &&
    (!Number.isFinite(receivedAt) ||
      now - receivedAt > Math.max(120_000, refreshInterval(data) * 2));
  const status = ["not_configured", "unavailable"].includes(data?.status)
    ? data.status
    : paused
      ? "paused"
      : expired
        ? "stale"
        : data?.status || "loading";
  const notice = copy[status + "Text"];
  const reason = {
    credentials: copy.reasonCredentials,
    quota: copy.reasonQuota,
    timeout: copy.reasonTimeout,
    configuration: copy.reasonConfiguration,
    provider_error: copy.reasonProvider,
    contact_required: copy.reasonContactRequired,
    access_denied: copy.reasonAccessDenied,
  }[data?.reason];
  const airport = data?.airport || defaultAirport;
  const emptyState = flights.length
    ? { title: copy.emptyNoResultsTitle, text: copy.noResults }
    : data?.status === "not_configured"
      ? {
          title: copy.emptyNotConfiguredTitle,
          text: copy.emptyNotConfiguredText,
        }
      : data?.status === "unavailable"
        ? {
            title: copy.emptyUnavailableTitle,
            text: copy.emptyUnavailableText,
          }
        : data?.status === "sandbox"
          ? {
              title: copy.emptySandboxTitle,
              text: copy.emptySandboxText,
            }
          : { title: copy.noFlights, text: copy.noFlightsText };
  return (
    <main className="container page tracking-page">
      <AirportHero
        variant="tracking"
        title={copy.title}
        description={copy.intro}
      />
      <FlightViews />
      <div className="tracking-source-strip">
        <span>{copy.source}</span>
        <strong>{sourceName}</strong>
      </div>
      <section
        className={"tracking-status tracking-status-" + status}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="tracking-status-icon">
          {["unavailable", "not_configured", "stale", "sandbox"].includes(
            status,
          ) ? (
            <Info size={21} />
          ) : paused ? (
            <Pause size={21} />
          ) : (
            <Radio size={21} />
          )}
        </div>
        <div>
          <strong>{copy[status]}</strong>
          {notice && <p>{notice}</p>}
          {nearby && (
            <p className="tracking-area-notice">
              {withRadius(copy.nearbyNotice)}
            </p>
          )}
          {reason &&
            ["stale", "unavailable", "not_configured"].includes(status) && (
              <small>{reason}</small>
            )}
          {data?.mode === "sandbox" && status !== "sandbox" && (
            <small>{copy.sandboxText}</small>
          )}
        </div>
      </section>
      <div className="tracking-workspace">
        <div className="tracking-map-column">
          <div className="tracking-map-toolbar">
            <div>
              <MapPinned size={16} />
              <strong>{copy.map}</strong>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => setCenterVersion((v) => v + 1)}
            >
              <LocateFixed size={15} />
              {copy.center}
            </button>
          </div>
          <TrackingMap
            airport={airport}
            flights={visibleFlights}
            selectedId={selected?.id || null}
            selectionVersion={selectionVersion}
            centerVersion={centerVersion}
            onSelect={selectFlight}
            copy={copy}
            lang={lang}
            now={now}
            scope={nearby ? "area" : "routes"}
            radiusNm={radiusNm}
          />
          <div className="tracking-update-bar">
            <span>
              <Clock3 size={14} />
              {data?.fetchedAt ? (
                <>
                  {copy.updated}{" "}
                  <time dateTime={data.fetchedAt}>
                    {trackingTime(data.fetchedAt, lang)}
                  </time>
                </>
              ) : (
                copy.never
              )}
            </span>
            <div>
              <button
                type="button"
                className="btn"
                onClick={() => setPaused((value) => !value)}
                aria-pressed={paused}
              >
                {paused ? <Play size={15} /> : <Pause size={15} />}
                <span>{paused ? copy.resume : copy.pause}</span>
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={refresh}
                disabled={busy || paused}
              >
                <RefreshCw
                  size={15}
                  className={busy ? "tracking-spinning" : ""}
                />
                {copy.refresh}
              </button>
            </div>
          </div>
          <p className="tracking-cadence">
            {copy.cadenceMinutes.replace(
              "{minutes}",
              number(Math.ceil(refreshInterval(data) / 60000), lang),
            )}
          </p>
          <p className="tracking-provider-credit">
            {copy.source} :{" "}
            {sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                {sourceName}
              </a>
            ) : (
              <span>{sourceName}</span>
            )}
            {isAdsb && (
              <span className="tracking-license">
                {copy.dataLicense} :{" "}
                <a
                  href="https://opendatacommons.org/licenses/odbl/1-0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ODbL 1.0
                </a>
              </span>
            )}
          </p>
          {isOpenSky && (
            <p className="tracking-research-credit">
              <a
                href="https://openskynetwork.github.io/opensky-api/#citation-and-terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenSky Network — Schäfer, Strohmeier, Lenders, Martinovic &
                Wilhelm (2014), Bringing Up OpenSky: A Large-scale ADS-B Sensor
                Network for Research, IPSN, pp. 83–94.
              </a>
              <span>{copy.researchUse}</span>
            </p>
          )}
        </div>
        <aside className="tracking-sidebar">
          <div className="tracking-list-heading">
            <span className="eyebrow">OUD / GMFO</span>
            <h2>{copy.listTitle}</h2>
            <p>
              {!data
                ? copy.loading
                : ["not_configured", "unavailable"].includes(data.status)
                  ? copy[data.status]
                  : `${visibleFlights.length} ${copy.count}`}
            </p>
          </div>
          {!nearby && (
            <div className="tracking-filter-tabs">
              {[
                ["all", copy.all],
                ["arrival", copy.arrival],
                ["departure", copy.departure],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={direction === value ? "selected" : ""}
                  aria-pressed={direction === value}
                  onClick={() => setDirection(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <label className="tracking-search">
            <Search size={16} />
            <span className="sr-only">{copy.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchHint}
            />
          </label>
          <div className="tracking-flight-list" aria-busy={busy && !data}>
            {!data ? (
              <div className="tracking-empty">
                <RefreshCw className="tracking-spinning" size={25} />
                <p>{copy.loading}</p>
              </div>
            ) : !visibleFlights.length ? (
              <div className="tracking-empty">
                {["not_configured", "unavailable"].includes(data.status) ? (
                  <Info size={32} />
                ) : (
                  <Plane size={32} />
                )}
                <h3>{emptyState.title}</h3>
                <p>{emptyState.text}</p>
                {!flights.length && (
                  <Link to="/flights" className="text-link">
                    {copy.demoLink}
                    <ArrowRight size={15} />
                  </Link>
                )}
                {(query || (!nearby && direction !== "all")) && (
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setQuery("");
                      setDirection("all");
                    }}
                  >
                    {copy.reset}
                  </button>
                )}
              </div>
            ) : (
              visibleFlights.map((flight) => (
                <button
                  type="button"
                  key={flight.id}
                  className={
                    "tracking-flight-card " +
                    (flight.id === selectedId ? "selected" : "")
                  }
                  onClick={() => selectFlight(flight.id)}
                  aria-pressed={flight.id === selectedId}
                  aria-label={`${copy.select} ${flight.number || flight.callsign || flight.id}`}
                >
                  <span className="tracking-card-top">
                    <strong>
                      <bdi dir="ltr">
                        {flight.number ||
                          flight.callsign ||
                          flight.registration ||
                          "—"}
                      </bdi>
                    </strong>
                    <span>
                      {!nearby && flight.direction === "arrival" ? (
                        <PlaneLanding size={15} />
                      ) : !nearby && flight.direction === "departure" ? (
                        <PlaneTakeoff size={15} />
                      ) : (
                        <Plane size={15} />
                      )}{" "}
                      {nearby
                        ? flight.onGround
                          ? copy.onGround
                          : copy.inArea
                        : copy[flight.direction] || copy.other}
                    </span>
                  </span>
                  {flight.origin && flight.destination ? (
                    <span className="tracking-card-route">
                      <bdi dir="ltr">{flight.origin || "—"}</bdi>
                      <ArrowRight size={15} />
                      <bdi dir="ltr">{flight.destination || "—"}</bdi>
                    </span>
                  ) : (
                    <span className="tracking-card-route tracking-route-unknown">
                      {copy.routeUnknown}
                    </span>
                  )}
                  <span className="tracking-card-bottom">
                    <span>{number(flight.altitudeFeet, lang, copy.feet)}</span>
                    <span className={oldPosition(flight, now) ? "old" : ""}>
                      <Clock3 size={12} />
                      {oldPosition(flight, now)
                        ? copy.oldPosition
                        : trackingTime(
                            flight.positionAt,
                            lang,
                            copy.positionUnknown,
                          )}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
          {data?.truncated && (
            <p className="tracking-limit">
              <Info size={13} />
              {copy.limited}
            </p>
          )}
        </aside>
      </div>
      {selected ? (
        <FlightDetails
          flight={selected}
          copy={copy}
          lang={lang}
          now={now}
          onClose={() => setSelectedId(null)}
          nearby={nearby}
        />
      ) : visibleFlights.length > 0 ? (
        <div className="tracking-selection-hint">
          <LocateFixed size={19} />
          <p>
            <strong>{copy.noSelection}</strong>
            <span>{copy.noSelectionText}</span>
          </p>
        </div>
      ) : null}
      <footer className="tracking-explanation">
        <ShieldCheck size={20} />
        <p>{copy.distinction}</p>
        <Link to="/flights">
          {copy.demoLink}
          <ArrowRight size={15} />
        </Link>
      </footer>
    </main>
  );
}
export default Tracking;
