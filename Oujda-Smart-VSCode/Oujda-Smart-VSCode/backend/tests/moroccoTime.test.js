import test from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import {
  moroccoTimeZone,
  MOROCCO_SCHEDULED_CLOCK_SQL,
} from "../src/utils/moroccoTime.js";

const clock = (value) =>
  new Date(value).toLocaleTimeString("en-GB", {
    timeZone: moroccoTimeZone(value),
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

test("Morocco formatting applies the exact 2026 transition and retains historical Ramadan rules", () => {
  assert.equal(clock("2026-09-20T00:59:59Z"), "01:59");
  assert.equal(clock("2026-09-20T01:00:00Z"), "01:00");
  assert.equal(clock("2026-09-29T08:15:00Z"), "08:15");
  assert.equal(clock("2026-01-10T08:15:00Z"), "09:15");
  assert.equal(clock("2026-02-20T08:15:00Z"), "08:15");
});

test("The public after filter excludes AT700 at 08:15 and includes FR713 at 09:25", async () => {
  // No application DB import or data directory: this database exists only in RAM.
  const db = new PGlite();
  try {
    const result = await db.query(
      `WITH flights (number, scheduled_at) AS (VALUES
        ('AT700', TIMESTAMPTZ '2026-09-29T08:15:00Z'),
        ('AT830', TIMESTAMPTZ '2026-09-29T08:30:00Z'),
        ('FR713', TIMESTAMPTZ '2026-09-29T09:25:00Z')
      )
      SELECT number FROM flights
      WHERE ${MOROCCO_SCHEDULED_CLOCK_SQL} >= $1
      ORDER BY scheduled_at`,
      ["08:30"],
    );
    assert.deepEqual(result.rows.map((flight) => flight.number), [
      "AT830",
      "FR713",
    ]);

    const transition = await db.query(
      `WITH flights (scheduled_at) AS (VALUES
        (TIMESTAMPTZ '2026-09-20T00:59:59Z'),
        (TIMESTAMPTZ '2026-09-20T01:00:00Z'),
        (TIMESTAMPTZ '2026-01-10T08:15:00Z'),
        (TIMESTAMPTZ '2026-02-20T08:15:00Z')
      )
      SELECT ${MOROCCO_SCHEDULED_CLOCK_SQL} AS local_time
      FROM flights ORDER BY scheduled_at`,
    );
    assert.deepEqual(transition.rows.map((flight) => flight.local_time), [
      "09:15",
      "08:15",
      "01:59",
      "01:00",
    ]);
  } finally {
    await db.close();
  }
});
