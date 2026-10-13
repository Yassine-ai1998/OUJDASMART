import test from "node:test";
import assert from "node:assert/strict";
import { createTrackingService } from "../src/services/tracking.js";

const start = Date.parse("2026-10-01T14:00:00Z");
const fixture = (override = {}) => ({
  fr24_id: "abcd1234",
  flight: "TEST101",
  callsign: "DEMO101",
  lat: 35,
  lon: -2,
  track: 165,
  alt: 22000,
  gspeed: 340,
  timestamp: new Date(start - 10000).toISOString(),
  reg: "TEST-ONLY",
  type: "A320",
  orig_iata: "ORY",
  orig_icao: "LFPO",
  dest_iata: "OUD",
  dest_icao: "GMFO",
  eta: new Date(start + 900000).toISOString(),
  ...override,
});
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

test("Tracking disabled or missing credentials never calls the provider", async () => {
  let calls = 0;
  for (const settings of [
    {},
    { mode: "disabled", token: "secret" },
    { mode: "live" },
    { mode: "unknown", token: "secret" },
  ]) {
    const client = createTrackingService(settings, {
      fetchImpl: () => {
        calls++;
        throw new Error("unexpected network");
      },
    });
    const result = await client.getFlights();
    assert.equal(result.status, "not_configured");
    assert.deepEqual(result.flights, []);
    assert.equal(result.fetchedAt, null);
  }
  assert.equal(calls, 0);
});

test("Official request, normalization, airport isolation, duplicate removal and shared cache", async () => {
  let clock = start,
    calls = 0;
  const client = createTrackingService(
    { mode: "live", token: "test-secret" },
    {
      now: () => clock,
      fetchImpl: async (url, options) => {
        calls++;
        const parsed = new URL(url);
        assert.equal(parsed.origin, "https://fr24api.flightradar24.com");
        assert.equal(parsed.pathname, "/api/live/flight-positions/full");
        assert.equal(parsed.searchParams.get("airports"), "both:GMFO");
        assert.equal(parsed.searchParams.get("limit"), "20");
        assert.equal(options.headers.Authorization, "Bearer test-secret");
        assert.equal(options.headers["Accept-Version"], "v1");
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        await new Promise((resolve) => setTimeout(resolve, 10));
        return json({
          data: [
            fixture(),
            fixture(),
            fixture({
              fr24_id: "abcd5678",
              orig_iata: "OUD",
              orig_icao: "GMFO",
              dest_iata: "BRU",
              dest_icao: "EBBR",
            }),
            fixture({ fr24_id: "ffff", dest_iata: "CDG", dest_icao: "LFPG" }),
            fixture({ lat: 120 }),
          ],
        });
      },
    },
  );
  const responses = await Promise.all(
    Array.from({ length: 25 }, () => client.getFlights()),
  );
  assert.equal(calls, 1);
  const result = responses[0];
  assert.equal(result.status, "live");
  assert.equal(result.flights.length, 2);
  assert.deepEqual(
    result.flights.map((flight) => flight.direction),
    ["arrival", "departure"],
  );
  assert.equal(result.flights[0].altitudeFeet, 22000);
  assert.equal(result.flights[0].speedKnots, 340);
  assert.equal(result.flights[0].positionStale, false);
  assert.equal(JSON.stringify(result).includes("test-secret"), false);
  result.flights[0].number = "mutated by caller";
  assert.equal((await client.getFlights()).flights[0].number, "TEST101");
  clock += 59000;
  await client.getFlights();
  assert.equal(calls, 1);
  clock += 1001;
  await client.getFlights();
  assert.equal(calls, 2);
});

test("Failure returns labelled stale data, applies backoff and drops expired snapshots", async () => {
  let clock = start,
    calls = 0;
  const client = createTrackingService(
    { mode: "live", token: "private-key" },
    {
      now: () => clock,
      fetchImpl: async () =>
        ++calls === 1
          ? json({ data: [fixture()] })
          : json({ error: "private-key upstream detail" }, 429, {
              "retry-after": "400",
            }),
    },
  );
  await client.getFlights();
  clock += 61000;
  const stale = await client.getFlights();
  assert.equal(stale.status, "stale");
  assert.equal(stale.reason, "quota");
  assert.equal(stale.refreshAfterSeconds, 400);
  assert.equal(stale.flights[0].positionStale, true);
  assert.equal(stale.fetchedAt, new Date(start).toISOString());
  assert.equal(JSON.stringify(stale).includes("private-key"), false);
  await client.getFlights();
  assert.equal(calls, 2);
  clock = start + 301000;
  const expired = await client.getFlights();
  assert.equal(expired.status, "unavailable");
  assert.deepEqual(expired.flights, []);
  assert.equal(expired.fetchedAt, null);
  assert.equal(calls, 2);
  clock = start + 462000;
  await client.getFlights();
  assert.equal(calls, 3);
});

test("Sandbox remains explicitly static and may contain flights outside Oujda", async () => {
  const client = createTrackingService(
    { mode: "sandbox", token: "sandbox-token" },
    {
      now: () => start,
      fetchImpl: async () =>
        json({
          data: [
            fixture({
              dest_iata: "FUE",
              dest_icao: "GCFV",
              timestamp: "2024-10-10T08:08:12Z",
            }),
          ],
        }),
    },
  );
  const result = await client.getFlights();
  assert.equal(result.status, "sandbox");
  assert.equal(result.mode, "sandbox");
  assert.equal(result.flights[0].direction, "other");
  assert.equal(result.flights[0].positionStale, true);
});

test("Empty, invalid, old, future and truncated provider responses are distinguished", async () => {
  const make = (body, settings = {}) =>
    createTrackingService(
      { mode: "live", token: "test", ...settings },
      { now: () => start, fetchImpl: async () => json(body) },
    );
  const empty = await make({ data: [] }).getFlights();
  assert.equal(empty.status, "live");
  assert.equal(empty.flights.length, 0);
  for (const body of [
    { wrong: [] },
    { data: [{ lat: "bad" }] },
    { data: null },
  ])
    assert.equal((await make(body).getFlights()).status, "unavailable");
  const old = await make({
    data: [fixture({ timestamp: "2026-10-01T13:50:00Z" })],
  }).getFlights();
  assert.equal(old.flights[0].positionStale, true);
  const future = await make({
    data: [fixture({ timestamp: "2026-10-01T15:50:00Z" })],
  }).getFlights();
  assert.equal(future.flights[0].positionStale, true);
  const capped = await make(
    { data: [fixture(), fixture({ fr24_id: "bbbb" })] },
    { limit: 1 },
  ).getFlights();
  assert.equal(capped.flights.length, 1);
  assert.equal(capped.truncated, true);
  assert.equal(capped.limit, 1);
});

test("Timeouts and rejected credentials do not expose provider messages or retry immediately", async () => {
  let calls = 0;
  const credentials = createTrackingService(
    { mode: "live", token: "hidden" },
    {
      now: () => start,
      fetchImpl: async () => {
        calls++;
        return json({ message: "hidden" }, 401);
      },
    },
  );
  assert.equal((await credentials.getFlights()).reason, "credentials");
  await credentials.getFlights();
  assert.equal(calls, 1);
  const timeout = createTrackingService(
    { mode: "live", token: "hidden", timeoutMs: 10 },
    {
      fetchImpl: async (_url, options) => {
        await new Promise((resolve) => setTimeout(resolve, 30));
        options.signal.throwIfAborted();
        throw new Error("Abort signal did not expire");
      },
    },
  );
  const result = await timeout.getFlights();
  assert.equal(result.status, "unavailable");
  assert.equal(result.reason, "timeout");
});
