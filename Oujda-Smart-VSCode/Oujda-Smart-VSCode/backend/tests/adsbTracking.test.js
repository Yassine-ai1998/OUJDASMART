import test from "node:test";
import assert from "node:assert/strict";
import { createAdsbTrackingService as createRawAdsbTrackingService } from "../src/services/adsbTracking.js";

const createAdsbTrackingService = (settings = {}, dependencies = {}) =>
  createRawAdsbTrackingService(
    { contact: "operator@example.test", ...settings },
    dependencies,
  );
const start = Date.parse("2026-10-08T12:00:00Z");
const aircraft = (overrides = {}) => ({
  hex: "ABC123",
  flight: " RAM123  ",
  r: "CN-TEST",
  t: "B738",
  lat: 34.8,
  lon: -1.9,
  alt_baro: 22000,
  gs: 350.5,
  track: 130,
  seen_pos: 10.5,
  ...overrides,
});
const body = (ac = [], overrides = {}) => ({
  now: start,
  msg: "No error",
  ac,
  ...overrides,
});
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
const serviceFor = (data, settings = {}) =>
  createAdsbTrackingService(settings, {
    now: () => start,
    fetchImpl: async () => json(data),
  });

test("ADSB uses the official point endpoint without credentials, normalizes and shares concurrent requests/cache", async () => {
  let clock = start,
    calls = 0;
  const tracker = createAdsbTrackingService(
    {},
    {
      now: () => clock,
      fetchImpl: async (url, options) => {
        calls++;
        assert.equal(
          url,
          "https://api.adsb.lol/v2/point/34.786111/-1.925556/150",
        );
        assert.deepEqual(options.headers, {
          Accept: "application/json",
          "User-Agent": "OujdaSmart/1.0 (+mailto:operator@example.test)",
        });
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        await new Promise((resolve) => setTimeout(resolve, 10));
        return json(body([aircraft()], { now: clock }));
      },
    },
  );
  const results = await Promise.all(
    Array.from({ length: 25 }, () => tracker.getFlights()),
  );
  assert.equal(calls, 1);
  const result = results[0];
  assert.equal(result.provider, "adsb_lol");
  assert.equal(result.scope, "area");
  assert.equal(result.mode, "live");
  assert.equal(result.status, "live");
  assert.equal(result.radiusNm, 150);
  assert.equal(result.flights[0].id, "abc123");
  assert.equal(result.flights[0].callsign, "RAM123");
  assert.equal(result.flights[0].number, null);
  assert.equal(result.flights[0].origin, null);
  assert.equal(result.flights[0].destination, null);
  assert.equal(result.flights[0].estimatedArrival, null);
  assert.equal(result.flights[0].direction, "other");
  assert.equal(result.flights[0].positionAt, "2026-10-08T11:59:49.500Z");
  assert.equal(result.flights[0].altitudeFeet, 22000);
  assert.equal(result.flights[0].speedKnots, 350.5);
  assert.equal(result.flights[0].positionStale, false);
  result.flights[0].callsign = "caller mutation";
  assert.equal((await tracker.getFlights()).flights[0].callsign, "RAM123");
  clock += 59999;
  await tracker.getFlights();
  assert.equal(calls, 1);
  clock++;
  await tracker.getFlights();
  assert.equal(calls, 2);
});

test("ADSB drops unusable, distant and expired positions, keeps the freshest duplicate and handles ground/non-ICAO targets", async () => {
  const result = await serviceFor(
    body([
      aircraft(),
      aircraft({ hex: "abc123", seen_pos: 5 }),
      aircraft({ hex: "~DEF456", alt_baro: "ground", gs: 0 }),
      aircraft({ hex: "aaaaaa", lat: 80 }),
      aircraft({ hex: "bbbbbb", lat: 200 }),
      aircraft({ hex: "cccccc", seen_pos: 301 }),
      aircraft({ hex: "dddddd", seen_pos: undefined }),
      aircraft({ hex: "eeeeee", seen_pos: -1 }),
      aircraft({
        hex: "ffffff",
        lat: undefined,
        lon: undefined,
        lastPosition: { lat: 34.8, lon: -1.9 },
      }),
      aircraft({ hex: "bad-id" }),
      aircraft({ hex: "123456", lat: "34.8" }),
    ]),
  ).getFlights();
  assert.equal(result.status, "live");
  assert.deepEqual(
    result.flights.map((flight) => flight.id),
    ["abc123", "~def456"],
  );
  assert.equal(result.flights[0].positionAt, "2026-10-08T11:59:55.000Z");
  assert.equal(result.flights[1].onGround, true);
  assert.equal(result.flights[1].altitudeFeet, null);
  assert.equal(result.flights[1].speedKnots, 0);
});

test("ADSB validates provider timestamp and explicit errors while allowing legitimate empty responses", async () => {
  assert.equal((await serviceFor(body()).getFlights()).status, "live");
  for (const invalid of [
    {},
    body([], { now: undefined }),
    body([], { now: start / 1000 }),
    body([], { now: start - 120001 }),
    body([], { now: start + 120001 }),
    body([], { now: String(start) }),
    body([], { ac: null }),
    body([], { msg: "Upstream failure private details" }),
    body([], { error: "failure" }),
  ]) {
    const result = await serviceFor(invalid).getFlights();
    assert.equal(result.status, "unavailable");
    assert.equal(result.reason, "provider_error");
    assert.deepEqual(result.flights, []);
    assert.equal(JSON.stringify(result).includes("private details"), false);
  }
  const future = await serviceFor(
    body([aircraft({ seen_pos: 0 })], { now: start + 90000 }),
  ).getFlights();
  assert.equal(future.flights[0].positionStale, true);
  const old = await serviceFor(
    body([aircraft({ seen_pos: 121 })]),
  ).getFlights();
  assert.equal(old.flights[0].positionStale, true);
});

test("ADSB failure backoff retains labelled cache briefly and removes expired positions and snapshots", async () => {
  let clock = start,
    calls = 0;
  const tracker = createAdsbTrackingService(
    {},
    {
      now: () => clock,
      fetchImpl: async () =>
        ++calls === 1
          ? json(body([aircraft()]))
          : json({ msg: "provider internals" }, 429, { "retry-after": "400" }),
    },
  );
  await tracker.getFlights();
  clock += 61000;
  const stale = await tracker.getFlights();
  assert.equal(stale.status, "stale");
  assert.equal(stale.reason, "quota");
  assert.equal(stale.refreshAfterSeconds, 400);
  assert.equal(stale.flights[0].positionStale, true);
  assert.equal(stale.fetchedAt, new Date(start).toISOString());
  assert.equal(JSON.stringify(stale).includes("provider internals"), false);
  clock = start + 295000;
  const agedPositions = await tracker.getFlights();
  assert.equal(agedPositions.status, "stale");
  assert.deepEqual(agedPositions.flights, []);
  clock = start + 300001;
  const expired = await tracker.getFlights();
  assert.equal(expired.status, "unavailable");
  assert.equal(expired.fetchedAt, null);
  assert.equal(calls, 2);
  clock = start + 461001;
  await tracker.getFlights();
  assert.equal(calls, 3);
});

test("ADSB handles numeric/date Retry-After with bounded fallback and never retries during backoff", async () => {
  for (const [retry, expected] of [
    ["120", 300],
    [new Date(start + 450000).toUTCString(), 450],
    ["99999", 3600],
    ["nonsense", 300],
    ["", 300],
  ]) {
    let calls = 0;
    const tracker = createAdsbTrackingService(
      {},
      {
        now: () => start,
        fetchImpl: async () => {
          calls++;
          return json({}, 429, { "retry-after": retry });
        },
      },
    );
    const result = await tracker.getFlights();
    assert.equal(result.refreshAfterSeconds, expected);
    await tracker.getFlights();
    assert.equal(calls, 1);
  }
});

test("ADSB bounds configuration and caps only valid unique flights", async () => {
  for (const [settings, radius, interval] of [
    [{ radiusNm: 2, refreshSeconds: 3 }, 25, 60],
    [{ radiusNm: 999, refreshSeconds: 999 }, 250, 300],
    [{ radiusNm: "72.9", refreshSeconds: "99.9" }, 72, 99],
    [{ radiusNm: "", refreshSeconds: "" }, 150, 60],
  ]) {
    const result = await serviceFor(body(), settings).getFlights();
    assert.equal(result.radiusNm, radius);
    assert.equal(result.refreshAfterSeconds, interval);
  }
  const result = await serviceFor(
    body(
      Array.from({ length: 501 }, (_, index) =>
        aircraft({
          hex: index.toString(16).padStart(6, "0"),
        }),
      ),
    ),
  ).getFlights();
  assert.equal(result.limit, 500);
  assert.equal(result.flights.length, 500);
  assert.equal(result.truncated, true);
  const duplicates = await serviceFor(
    body(Array.from({ length: 501 }, () => aircraft())),
  ).getFlights();
  assert.equal(duplicates.flights.length, 1);
  assert.equal(duplicates.truncated, false);
});

test("ADSB timeout and malformed JSON become safe unavailable responses", async () => {
  const tracker = createAdsbTrackingService(
    { timeoutMs: 10 },
    {
      now: () => start,
      fetchImpl: async (_url, options) => {
        await new Promise((resolve) => setTimeout(resolve, 30));
        options.signal.throwIfAborted();
        return json(body());
      },
    },
  );
  assert.equal((await tracker.getFlights()).reason, "timeout");
  const invalidJson = createAdsbTrackingService(
    {},
    {
      now: () => start,
      fetchImpl: async () => new Response("private upstream response"),
    },
  );
  const result = await invalidJson.getFlights();
  assert.equal(result.status, "unavailable");
  assert.equal(result.reason, "provider_error");
  assert.equal(JSON.stringify(result).includes("private upstream"), false);
});

test("ADSB requires a valid server contact and never publishes it", async () => {
  let calls = 0;
  for (const contact of [
    undefined,
    "",
    "not-email",
    "a@b.test\r\nX: injected",
  ]) {
    const t = createRawAdsbTrackingService(
      { contact },
      {
        fetchImpl: async () => {
          calls++;
          throw new Error("Network forbidden");
        },
      },
    );
    const result = await t.getFlights();
    assert.equal(result.status, "not_configured");
    assert.equal(result.reason, "contact_required");
  }
  assert.equal(calls, 0);
  const t = createAdsbTrackingService(
    {},
    { now: () => start, fetchImpl: async () => json(body()) },
  );
  assert.ok(
    !JSON.stringify(await t.getFlights()).includes("operator@example.test"),
  );
  const denied = createAdsbTrackingService(
    {},
    { now: () => start, fetchImpl: async () => json({}, 403) },
  );
  const r = await denied.getFlights();
  assert.equal(r.reason, "access_denied");
  assert.equal(r.refreshAfterSeconds, 300);
});
