// Official FR24 REST integration. No token, payload or provider error is logged.
// The demo flight database is deliberately not read or modified by this service.
export const TRACKING_AIRPORT = Object.freeze({
  iata: "OUD",
  icao: "GMFO",
  name: "Oujda-Angads",
  lat: 34.786111,
  lon: -1.925556,
});
const ENDPOINT =
  "https://fr24api.flightradar24.com/api/live/flight-positions/full";
const DEFAULT_LIMIT = 20;
const MAX_STALE_MS = 5 * 60 * 1000;

function text(value, length = 64) {
  return typeof value === "string"
    ? value.trim().slice(0, length) || null
    : null;
}
function number(value, min, max) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
    ? value
    : null;
}
function date(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}
function normalize(record, mode) {
  if (!record || typeof record !== "object") return null;
  const id = text(record.fr24_id);
  const latitude = number(record.lat, -90, 90);
  const longitude = number(record.lon, -180, 180);
  const positionAt = date(record.timestamp);
  if (
    !id ||
    !/^[a-z\d_-]+$/i.test(id) ||
    latitude === null ||
    longitude === null ||
    !positionAt
  )
    return null;
  const origin = text(record.orig_iata, 4) || text(record.orig_icao, 4);
  const destination = text(record.dest_iata, 4) || text(record.dest_icao, 4);
  const inbound =
    record.dest_icao === TRACKING_AIRPORT.icao ||
    record.dest_iata === TRACKING_AIRPORT.iata;
  const outbound =
    record.orig_icao === TRACKING_AIRPORT.icao ||
    record.orig_iata === TRACKING_AIRPORT.iata;
  // Sandbox responses ignore the airport filter: keep them, explicitly marked sandbox.
  if (mode === "live" && !inbound && !outbound) return null;
  return {
    id,
    number: text(record.flight),
    callsign: text(record.callsign),
    registration: text(record.reg),
    aircraft: text(record.type),
    origin,
    destination,
    direction: inbound ? "arrival" : outbound ? "departure" : "other",
    latitude,
    longitude,
    heading: number(record.track, 0, 360),
    altitudeFeet: number(record.alt, -2000, 100000),
    speedKnots: number(record.gspeed, 0, 2000),
    positionAt,
    estimatedArrival: date(record.eta),
  };
}

export function createTrackingService(settings = {}, dependencies = {}) {
  const fetchImpl = dependencies.fetchImpl || globalThis.fetch;
  const now = dependencies.now || Date.now;
  const mode = settings.mode || "disabled";
  const token = typeof settings.token === "string" ? settings.token.trim() : "";
  const seconds = Number(settings.refreshSeconds);
  const refreshSeconds = Number.isFinite(seconds)
    ? Math.min(300, Math.max(60, Math.floor(seconds)))
    : 60;
  const timeoutMs = Number.isFinite(settings.timeoutMs)
    ? Math.max(10, Math.min(10000, settings.timeoutMs))
    : 10000;
  const requestedLimit = Number(settings.limit);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(300, Math.floor(requestedLimit)))
    : DEFAULT_LIMIT;
  let snapshot = null;
  let pending = null;
  let retryAt = 0;
  let lastReason = null;

  function response(status, reason = null, source = null) {
    const timestamp = now();
    return {
      provider: "flightradar24",
      status,
      mode: ["live", "sandbox"].includes(mode) ? mode : "disabled",
      reason,
      airport: { ...TRACKING_AIRPORT },
      fetchedAt: source?.fetchedAt || null,
      refreshAfterSeconds: Math.max(
        refreshSeconds,
        Math.ceil((retryAt - timestamp) / 1000),
      ),
      limit,
      truncated: source?.truncated || false,
      flights: (source?.flights || []).map((flight) => ({
        ...flight,
        positionStale:
          status === "stale" ||
          timestamp - Date.parse(flight.positionAt) > 120000 ||
          Date.parse(flight.positionAt) > timestamp + 60000,
      })),
    };
  }
  function failureResponse() {
    if (snapshot && now() - Date.parse(snapshot.fetchedAt) <= MAX_STALE_MS)
      return response("stale", lastReason, snapshot);
    snapshot = null;
    return response("unavailable", lastReason);
  }
  async function refresh() {
    try {
      const url = new URL(ENDPOINT);
      url.searchParams.set("airports", "both:" + TRACKING_AIRPORT.icao);
      url.searchParams.set("limit", String(limit));
      const upstream = await fetchImpl(url.toString(), {
        headers: {
          Accept: "application/json",
          "Accept-Version": "v1",
          Authorization: "Bearer " + token,
        },
        signal: AbortSignal.timeout(timeoutMs),
        redirect: "error",
      });
      if (!upstream.ok) {
        const reason = [401, 403].includes(upstream.status)
          ? "credentials"
          : [402, 429].includes(upstream.status)
            ? "quota"
            : "provider_error";
        const retry = Number(upstream.headers.get("retry-after"));
        const backoff =
          reason === "credentials" || reason === "quota" ? 300 : refreshSeconds;
        throw Object.assign(new Error("Tracking provider unavailable"), {
          reason,
          retrySeconds:
            Number.isFinite(retry) && retry > 0
              ? Math.min(3600, Math.max(backoff, retry))
              : backoff,
        });
      }
      const body = await upstream.json();
      if (!body || !Array.isArray(body.data) || body.data.length > 500)
        throw new Error("Invalid tracking response");
      const flights = [];
      const ids = new Set();
      for (const row of body.data.slice(0, limit)) {
        const flight = normalize(row, mode);
        if (flight && !ids.has(flight.id)) {
          flights.push(flight);
          ids.add(flight.id);
        }
      }
      // Distinguish corrupt responses from a real, successful empty result.
      if (
        body.data.length &&
        !body.data.some((row) => normalize(row, "sandbox"))
      )
        throw new Error("Invalid tracking records");
      snapshot = {
        fetchedAt: new Date(now()).toISOString(),
        flights,
        truncated: body.data.length >= limit,
      };
      lastReason = null;
      retryAt = 0;
      return response(mode, null, snapshot);
    } catch (error) {
      lastReason =
        error.reason ||
        (["TimeoutError", "AbortError"].includes(error.name)
          ? "timeout"
          : "provider_error");
      retryAt = now() + (error.retrySeconds || refreshSeconds) * 1000;
      return failureResponse();
    }
  }
  return {
    async getFlights() {
      if (!["live", "sandbox", "disabled"].includes(mode))
        return response("not_configured", "configuration");
      if (mode === "disabled" || !token)
        return response(
          "not_configured",
          mode === "disabled" ? null : "credentials",
        );
      if (
        !lastReason &&
        snapshot &&
        now() - Date.parse(snapshot.fetchedAt) < refreshSeconds * 1000
      )
        return response(mode, null, snapshot);
      if (now() < retryAt) return failureResponse();
      // All visitors share one provider request and one snapshot per Node process.
      if (!pending)
        pending = refresh().finally(() => {
          pending = null;
        });
      return pending;
    },
  };
}
