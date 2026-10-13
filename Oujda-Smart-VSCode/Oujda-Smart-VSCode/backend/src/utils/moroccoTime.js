// IANA Africa/Casablanca returns to UTC at 02:00 local (+01) on 2026-09-20.
// Node/ICU and embedded PostgreSQL can ship older timezone data, so apply the
// same transition explicitly in formatting and SQL, retaining historical rules.
// Source: https://data.iana.org/time-zones/tzdb/africa (Africa/Casablanca).
const MOROCCO_UTC_START = "2026-09-20T01:00:00Z";
const moroccoUtcStartMs = Date.parse(MOROCCO_UTC_START);

export function moroccoTimeZone(value) {
  return new Date(value).getTime() >= moroccoUtcStartMs
    ? "UTC"
    : "Africa/Casablanca";
}

// Only internal constants are interpolated; filter values stay SQL parameters.
export const MOROCCO_SCHEDULED_CLOCK_SQL = `TO_CHAR(
  CASE WHEN scheduled_at >= TIMESTAMPTZ '${MOROCCO_UTC_START}'
    THEN scheduled_at AT TIME ZONE 'UTC'
    ELSE scheduled_at AT TIME ZONE 'Africa/Casablanca'
  END, 'HH24:MI')`;
