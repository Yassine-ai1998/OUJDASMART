import test from "node:test";
import assert from "node:assert/strict";
import { createOpenSkyTrackingService } from "../src/services/openSkyTracking.js";
import { createTracker } from "../src/services/trackingProvider.js";
const start = Date.parse("2026-10-08T20:00:00Z");
const row = (changes = {}) =>
  Object.assign(
    [
      "abc123",
      " DEMO12 ",
      "Test",
      start / 1000 - 10,
      start / 1000,
      -1.9,
      34.8,
      3048,
      false,
      100,
      120,
      0,
      null,
      3100,
      "1000",
      false,
      0,
    ],
    changes,
  );
const body = (states = [row()], time = start / 1000) => ({ time, states });
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers });
test("OpenSky anonymous fixed request, unit conversion, no invented routes, singleflight and five-minute cache", async () => {
  let clock = start,
    calls = 0;
  const service = createOpenSkyTrackingService(
    { refreshSeconds: 1 },
    {
      now: () => clock,
      fetchImpl: async (url, options) => {
        calls++;
        const parsed = new URL(url);
        assert.equal(parsed.origin, "https://opensky-network.org");
        assert.equal(parsed.pathname, "/api/states/all");
        const q = parsed.searchParams;
        assert.ok(
          (q.get("lamax") - q.get("lamin")) *
            (q.get("lomax") - q.get("lomin")) <=
            25,
        );
        assert.deepEqual(options.headers, { Accept: "application/json" });
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        await new Promise((resolve) => setTimeout(resolve, 10));
        return json(body([row({ 3: clock / 1000 - 10 })], clock / 1000));
      },
    },
  );
  const results = await Promise.all(
    Array.from({ length: 20 }, () => service.getFlights()),
  );
  assert.equal(calls, 1);
  const result = results[0],
    f = result.flights[0];
  assert.equal(result.provider, "opensky");
  assert.equal(result.radiusNm, 120);
  assert.equal(result.scope, "area");
  assert.equal(result.status, "live");
  assert.equal(result.refreshAfterSeconds, 300);
  assert.equal(f.callsign, "DEMO12");
  assert.equal(f.altitudeFeet, 10000);
  assert.ok(Math.abs(f.speedKnots - 194.38444924406) < 0.00001);
  for (const key of [
    "number",
    "registration",
    "aircraft",
    "origin",
    "destination",
    "estimatedArrival",
  ])
    assert.equal(f[key], null);
  assert.equal(f.direction, "other");
  assert.equal(f.positionStale, false);
  f.callsign = "mutated";
  assert.equal((await service.getFlights()).flights[0].callsign, "DEMO12");
  clock += 299000;
  assert.equal((await service.getFlights()).flights.length, 0);
  assert.equal(calls, 1);
  clock += 1000;
  assert.equal((await service.getFlights()).flights.length, 1);
  assert.equal(calls, 2);
});
test("OpenSky filters invalid, old, future and distant positions and keeps freshest duplicates", async () => {
  const records = [
    row(),
    row({ 3: start / 1000 - 5 }),
    row({ 0: "bcd123", 7: null, 8: true, 9: 0 }),
    row({ 0: "ccc123", 5: 0.5, 6: 37 }),
    row({ 0: "ddd123", 3: start / 1000 - 301 }),
    row({ 0: "eee123", 3: start / 1000 + 61 }),
    row({ 0: "fff123", 6: null }),
    row({ 0: "bad", 5: -1.9 }),
    row({ 0: "fff321", 6: "34.8" }),
    row({ 0: "aaaaaa", 3: null }),
  ];
  const service = createOpenSkyTrackingService(
    {},
    { now: () => start, fetchImpl: async () => json(body(records)) },
  );
  const result = await service.getFlights();
  assert.deepEqual(
    result.flights.map((f) => f.id),
    ["abc123", "bcd123"],
  );
  assert.equal(
    result.flights[0].positionAt,
    new Date(start - 5000).toISOString(),
  );
  assert.equal(result.flights[1].altitudeFeet, null);
  assert.equal(result.flights[1].speedKnots, 0);
  assert.equal(result.flights[1].onGround, true);
});
test("OpenSky distinguishes valid empty responses from malformed or expired payloads", async () => {
  for (const data of [body([]), body(null)]) {
    const service = createOpenSkyTrackingService(
      {},
      { now: () => start, fetchImpl: async () => json(data) },
    );
    const result = await service.getFlights();
    assert.equal(result.status, "live");
    assert.equal(result.flights.length, 0);
  }
  for (const data of [
    {},
    { time: start / 1000 },
    body({}, start / 1000),
    body([{}]),
    body([], start / 1000 - 121),
    body([], start / 1000 + 61),
    body([], String(start / 1000)),
  ]) {
    const service = createOpenSkyTrackingService(
      {},
      { now: () => start, fetchImpl: async () => json(data) },
    );
    const result = await service.getFlights();
    assert.equal(result.status, "unavailable");
    assert.equal(result.reason, "provider_error");
  }
});
test("OpenSky honors quota headers and never serves expired positions after a provider failure", async () => {
  let clock = start,
    calls = 0;
  const service = createOpenSkyTrackingService(
    {},
    {
      now: () => clock,
      fetchImpl: async () =>
        ++calls === 1
          ? json(body())
          : json({ error: "provider private details" }, 429, {
              "x-rate-limit-retry-after-seconds": "7200",
            }),
    },
  );
  await service.getFlights();
  clock += 300000;
  const failed = await service.getFlights();
  assert.equal(failed.status, "unavailable");
  assert.equal(failed.reason, "quota");
  assert.equal(failed.refreshAfterSeconds, 7200);
  assert.equal(failed.fetchedAt, null);
  assert.deepEqual(failed.flights, []);
  await service.getFlights();
  assert.equal(calls, 2);
  assert.ok(!JSON.stringify(failed).includes("private details"));
  clock += 7200000;
  await service.getFlights();
  assert.equal(calls, 3);
});
test("OpenSky access rejection, HTTP-date Retry-After, timeout and invalid JSON are safe", async () => {
  let calls = 0;
  const service = createOpenSkyTrackingService(
    {},
    {
      now: () => start,
      fetchImpl: async () => {
        calls++;
        return json({}, 403, {
          "retry-after": new Date(start + 600000).toUTCString(),
        });
      },
    },
  );
  const denied = await service.getFlights();
  assert.equal(denied.reason, "access_denied");
  assert.equal(denied.refreshAfterSeconds, 600);
  await service.getFlights();
  assert.equal(calls, 1);
  const timeout = createOpenSkyTrackingService(
    { timeoutMs: 10 },
    {
      fetchImpl: async (_url, options) => {
        await new Promise((r) => setTimeout(r, 30));
        options.signal.throwIfAborted();
      },
    },
  );
  assert.equal((await timeout.getFlights()).reason, "timeout");
  const invalid = createOpenSkyTrackingService(
    {},
    { now: () => start, fetchImpl: async () => new Response("private error") },
  );
  assert.equal((await invalid.getFlights()).reason, "provider_error");
});
test("Provider selection is explicit and disabled or invalid settings never contact an external service", async () => {
  let calls = 0;
  for (const provider of [
    "disabled",
    "wrong",
    "",
    "flightradar24",
    "adsb_lol",
  ]) {
    const tracker = createTracker(
      { provider },
      {
        fetchImpl: async () => {
          calls++;
          throw new Error("Unexpected network");
        },
      },
    );
    assert.equal((await tracker.getFlights()).status, "not_configured");
  }
  assert.equal(calls, 0);
  const tracker = createTracker(
    {},
    { now: () => start, fetchImpl: async () => json(body([])) },
  );
  assert.equal((await tracker.getFlights()).provider, "opensky");
});
