import { TRACKING_AIRPORT } from "./tracking.js";

const ENDPOINT = "https://api.adsb.lol/v2/point";
const LIMIT = 500;
const MAX_SNAPSHOT_AGE_MS = 120000;
const MAX_POSITION_AGE_MS = 300000;
const MAX_CACHE_AGE_MS = 300000;

function boundedSetting(value, fallback, min, max) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(min, Math.min(max, Math.floor(parsed)))
    : fallback;
}
function number(value, min, max) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
    ? value
    : null;
}
function text(value, length = 64) {
  return typeof value === "string"
    ? value.trim().slice(0, length) || null
    : null;
}
function distanceNm(latitude, longitude) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const a =
    Math.sin(radians(latitude - TRACKING_AIRPORT.lat) / 2) ** 2 +
    Math.cos(radians(TRACKING_AIRPORT.lat)) *
      Math.cos(radians(latitude)) *
      Math.sin(radians(longitude - TRACKING_AIRPORT.lon) / 2) ** 2;
  return 3440.065 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
function normalize(record, providerNow, receivedAt, radiusNm) {
  if (!record || typeof record !== "object") return null;
  const id = text(record.hex)?.toLowerCase();
  const latitude = number(record.lat, -90, 90);
  const longitude = number(record.lon, -180, 180);
  const seenPos = number(record.seen_pos, 0, Number.MAX_SAFE_INTEGER);
  if (
    !id ||
    !/^~?[a-f\d]{6}$/.test(id) ||
    latitude === null ||
    longitude === null ||
    seenPos === null
  )
    return null;
  // Only measured positions are used; lastPosition and extrapolation are deliberately ignored.
  const positionTimestamp = providerNow - seenPos * 1000;
  if (
    !Number.isFinite(positionTimestamp) ||
    positionTimestamp <= 0 ||
    receivedAt - positionTimestamp > MAX_POSITION_AGE_MS ||
    distanceNm(latitude, longitude) > radiusNm
  )
    return null;
  return {
    id,
    number: null,
    callsign: text(record.flight),
    registration: text(record.r),
    aircraft: text(record.t),
    origin: null,
    destination: null,
    direction: "other",
    latitude,
    longitude,
    heading: number(record.track, 0, 360),
    altitudeFeet: number(record.alt_baro, -2000, 100000),
    onGround: record.alt_baro === "ground",
    speedKnots: number(record.gs, 0, 2000),
    positionAt: new Date(positionTimestamp).toISOString(),
    estimatedArrival: null,
  };
}
function retryDelay(header, timestamp, fallback, minimum) {
  if (typeof header !== "string" || !header.trim()) return fallback;
  const value = header.trim();
  const seconds = /^\d+(?:\.\d+)?$/.test(value)
    ? Number(value)
    : (Date.parse(value) - timestamp) / 1000;
  return Number.isFinite(seconds) && seconds > 0
    ? Math.min(3600, Math.max(minimum, Math.ceil(seconds)))
    : fallback;
}

// Public ADSB.lol data is fetched once per process and never written to the demo database.
export function createAdsbTrackingService(settings = {}, dependencies = {}) {
  const candidate =
    typeof settings.contact === "string" ? settings.contact.trim() : "";
  const contact =
    candidate.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) &&
    !/[\r\n<>]/.test(candidate)
      ? candidate
      : null;
  const fetchImpl = dependencies.fetchImpl || globalThis.fetch;
  const now = dependencies.now || Date.now;
  const radiusNm = boundedSetting(settings.radiusNm, 150, 25, 250);
  const refreshSeconds = boundedSetting(settings.refreshSeconds, 60, 60, 300);
  const timeoutMs = boundedSetting(settings.timeoutMs, 10000, 10, 10000);
  const endpoint = `${ENDPOINT}/${TRACKING_AIRPORT.lat}/${TRACKING_AIRPORT.lon}/${radiusNm}`;
  let snapshot = null;
  let pending = null;
  let retryAt = 0;
  let lastReason = null;

  function response(status, reason = null, source = null) {
    const timestamp = now();
    return {
      provider: "adsb_lol",
      scope: "area",
      radiusNm,
      mode: "live",
      status,
      reason,
      airport: { ...TRACKING_AIRPORT },
      fetchedAt: source?.fetchedAt || null,
      refreshAfterSeconds: Math.max(
        refreshSeconds,
        Math.ceil((retryAt - timestamp) / 1000),
      ),
      limit: LIMIT,
      truncated: source?.truncated || false,
      flights: (source?.flights || [])
        .filter(
          (flight) =>
            timestamp - Date.parse(flight.positionAt) <= MAX_POSITION_AGE_MS,
        )
        .map((flight) => ({
          ...flight,
          positionStale:
            status === "stale" ||
            timestamp - Date.parse(flight.positionAt) > MAX_SNAPSHOT_AGE_MS ||
            Date.parse(flight.positionAt) > timestamp + 60000,
        })),
    };
  }
  function failureResponse() {
    if (snapshot && now() - Date.parse(snapshot.fetchedAt) <= MAX_CACHE_AGE_MS)
      return response("stale", lastReason, snapshot);
    snapshot = null;
    return response("unavailable", lastReason);
  }
  async function refresh() {
    let reason = "provider_error";
    let retrySeconds = refreshSeconds;
    try {
      const upstream = await fetchImpl(endpoint, {
        headers: {
          Accept: "application/json",
          "User-Agent": "OujdaSmart/1.0 (+mailto:" + contact + ")",
        },
        redirect: "error",
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!upstream.ok) {
        reason =
          upstream.status === 429
            ? "quota"
            : [401, 403].includes(upstream.status)
              ? "access_denied"
              : "provider_error";
        retrySeconds = retryDelay(
          upstream.headers.get("retry-after"),
          now(),
          [401, 403, 429].includes(upstream.status) ? 300 : refreshSeconds,
          [401, 403, 429].includes(upstream.status)
            ? Math.max(300, refreshSeconds)
            : refreshSeconds,
        );
        throw new Error("Tracking provider unavailable");
      }
      const body = await upstream.json();
      const receivedAt = now();
      const providerNow = number(body?.now, 1, 8640000000000000);
      if (
        !body ||
        !Array.isArray(body.ac) ||
        providerNow === null ||
        Math.abs(receivedAt - providerNow) > MAX_SNAPSHOT_AGE_MS ||
        (body.msg !== undefined && body.msg !== "No error") ||
        body.error
      )
        throw new Error("Invalid tracking response");
      const unique = new Map();
      for (const record of body.ac) {
        const flight = normalize(record, providerNow, receivedAt, radiusNm);
        if (!flight) continue;
        const previous = unique.get(flight.id);
        if (!previous || flight.positionAt > previous.positionAt)
          unique.set(flight.id, flight);
      }
      snapshot = {
        fetchedAt: new Date(receivedAt).toISOString(),
        flights: [...unique.values()].slice(0, LIMIT),
        truncated: unique.size > LIMIT,
      };
      lastReason = null;
      retryAt = 0;
      return response("live", null, snapshot);
    } catch (error) {
      lastReason = ["TimeoutError", "AbortError"].includes(error?.name)
        ? "timeout"
        : reason;
      retryAt = now() + retrySeconds * 1000;
      return failureResponse();
    }
  }
  return {
    async getFlights() {
      if (!contact) return response("not_configured", "contact_required");
      if (
        !lastReason &&
        snapshot &&
        now() - Date.parse(snapshot.fetchedAt) < refreshSeconds * 1000
      )
        return response("live", null, snapshot);
      if (now() < retryAt) return failureResponse();
      if (!pending)
        pending = refresh().finally(() => {
          pending = null;
        });
      return pending;
    },
  };
}
