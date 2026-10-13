import { TRACKING_AIRPORT } from "./tracking.js";

// Anonymous OpenSky: a fixed 25-square-degree box costs one state credit.
// A 120 NM circle around OUD fits entirely inside this box.
const ENDPOINT =
  "https://opensky-network.org/api/states/all?lamin=32.3&lomin=-4.4&lamax=37.3&lomax=0.6";
const MAX_AGE = 300000;
const LIMIT = 500;
const finite = (v, min, max) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max
    ? v
    : null;
const bounded = (v, fallback, min, max) =>
  v !== undefined && v !== "" && Number.isFinite(Number(v))
    ? Math.max(min, Math.min(max, Math.floor(Number(v))))
    : fallback;
function distanceNm(lat, lon) {
  const rad = (v) => (v * Math.PI) / 180;
  const a =
    Math.sin(rad(lat - TRACKING_AIRPORT.lat) / 2) ** 2 +
    Math.cos(rad(lat)) *
      Math.cos(rad(TRACKING_AIRPORT.lat)) *
      Math.sin(rad(lon - TRACKING_AIRPORT.lon) / 2) ** 2;
  return 3440.065 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
function normalize(row, timestamp) {
  if (
    !Array.isArray(row) ||
    row.length < 14 ||
    typeof row[0] !== "string" ||
    !/^[a-f\d]{6}$/i.test(row[0])
  )
    return null;
  const latitude = finite(row[6], 32.3, 37.3);
  const longitude = finite(row[5], -4.4, 0.6);
  const position = finite(row[3], 1, 8640000000000);
  if (
    latitude === null ||
    longitude === null ||
    position === null ||
    distanceNm(latitude, longitude) > 120 ||
    timestamp - position * 1000 > MAX_AGE ||
    position * 1000 > timestamp + 60000
  )
    return null;
  const meters = finite(row[7], -600, 30000);
  const velocity = finite(row[9], 0, 1100);
  return {
    id: row[0].toLowerCase(),
    number: null,
    callsign:
      typeof row[1] === "string" ? row[1].trim().slice(0, 64) || null : null,
    registration: null,
    aircraft: null,
    origin: null,
    destination: null,
    direction: "other",
    latitude,
    longitude,
    heading: finite(row[10], 0, 360),
    altitudeFeet: meters === null ? null : meters / 0.3048,
    speedKnots: velocity === null ? null : velocity * 1.9438444924406,
    onGround: row[8] === true,
    positionAt: new Date(position * 1000).toISOString(),
    estimatedArrival: null,
  };
}
function retrySeconds(value, now) {
  if (!value) return 0;
  const trimmed = value.trim();
  const seconds = /^\d+(\.\d+)?$/.test(trimmed)
    ? Number(trimmed)
    : (Date.parse(trimmed) - now) / 1000;
  return Number.isFinite(seconds) && seconds > 0
    ? Math.min(86400, Math.ceil(seconds))
    : 0;
}
export function createOpenSkyTrackingService(settings = {}, dependencies = {}) {
  const fetchImpl = dependencies.fetchImpl || globalThis.fetch;
  const now = dependencies.now || Date.now;
  const interval = bounded(settings.refreshSeconds, 300, 300, 3600);
  const timeout = bounded(settings.timeoutMs, 10000, 10, 10000);
  let snapshot = null,
    pending = null,
    retryAt = 0,
    lastReason = null;
  function response(status, reason = null, source = null) {
    const timestamp = now();
    return {
      provider: "opensky",
      scope: "area",
      radiusNm: 120,
      mode: "live",
      status,
      reason,
      airport: { ...TRACKING_AIRPORT },
      fetchedAt: source?.fetchedAt || null,
      refreshAfterSeconds: Math.max(
        interval,
        Math.ceil((retryAt - timestamp) / 1000),
      ),
      limit: LIMIT,
      truncated: source?.truncated || false,
      flights: (source?.flights || [])
        .filter((f) => timestamp - Date.parse(f.positionAt) <= MAX_AGE)
        .map((f) => ({
          ...f,
          positionStale:
            status === "stale" || timestamp - Date.parse(f.positionAt) > 120000,
        })),
    };
  }
  function failed() {
    if (snapshot && now() - Date.parse(snapshot.fetchedAt) < MAX_AGE)
      return response("stale", lastReason, snapshot);
    snapshot = null;
    return response("unavailable", lastReason);
  }
  async function refresh() {
    let reason = "provider_error",
      backoff = interval;
    try {
      const upstream = await fetchImpl(ENDPOINT, {
        headers: { Accept: "application/json" },
        redirect: "error",
        signal: AbortSignal.timeout(timeout),
      });
      if (!upstream.ok) {
        reason =
          upstream.status === 429
            ? "quota"
            : [401, 403].includes(upstream.status)
              ? "access_denied"
              : "provider_error";
        backoff = Math.max(
          interval,
          upstream.status === 429 ? 3600 : 0,
          retrySeconds(upstream.headers.get("retry-after"), now()),
          retrySeconds(
            upstream.headers.get("x-rate-limit-retry-after-seconds"),
            now(),
          ),
        );
        throw new Error("Tracking provider unavailable");
      }
      const body = await upstream.json();
      const timestamp = now();
      const providerTime = finite(body?.time, 1, 8640000000000);
      if (
        !body ||
        providerTime === null ||
        timestamp - providerTime * 1000 > 120000 ||
        providerTime * 1000 > timestamp + 60000 ||
        !(body.states === null || Array.isArray(body.states)) ||
        body.states?.length > 10000
      )
        throw new Error("Invalid tracking response");
      const records = body.states || [];
      // Reject malformed payloads, but allow valid records with no usable position.
      if (
        records.length &&
        !records.some(
          (row) =>
            Array.isArray(row) &&
            row.length >= 14 &&
            typeof row[0] === "string" &&
            /^[a-f\d]{6}$/i.test(row[0]),
        )
      )
        throw new Error("Invalid tracking records");
      const unique = new Map();
      for (const row of records) {
        const flight = normalize(row, timestamp);
        if (
          flight &&
          (!unique.has(flight.id) ||
            unique.get(flight.id).positionAt < flight.positionAt)
        )
          unique.set(flight.id, flight);
      }
      snapshot = {
        fetchedAt: new Date(timestamp).toISOString(),
        flights: [...unique.values()].slice(0, LIMIT),
        truncated: unique.size > LIMIT,
      };
      retryAt = 0;
      lastReason = null;
      return response("live", null, snapshot);
    } catch (error) {
      lastReason = ["TimeoutError", "AbortError"].includes(error?.name)
        ? "timeout"
        : reason;
      retryAt = now() + backoff * 1000;
      return failed();
    }
  }
  return {
    async getFlights() {
      if (
        !lastReason &&
        snapshot &&
        now() - Date.parse(snapshot.fetchedAt) < interval * 1000
      )
        return response("live", null, snapshot);
      if (now() < retryAt) return failed();
      if (!pending)
        pending = refresh().finally(() => {
          pending = null;
        });
      return pending;
    },
  };
}
