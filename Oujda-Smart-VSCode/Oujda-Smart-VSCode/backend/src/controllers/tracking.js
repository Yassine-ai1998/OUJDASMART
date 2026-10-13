import { z } from "zod";
import { createTracker } from "../services/trackingProvider.js";
import { fail } from "../utils/helpers.js";
const tracker = createTracker({
  provider: process.env.TRACKING_PROVIDER,
  opensky: { refreshSeconds: process.env.OPENSKY_REFRESH_SECONDS },
  adsb: {
    contact: process.env.ADSB_CONTACT,
    radiusNm: process.env.ADSB_RADIUS_NM,
    refreshSeconds: process.env.ADSB_REFRESH_SECONDS,
  },
  fr24: {
    mode: process.env.FR24_MODE,
    token: process.env.FR24_API_TOKEN,
    refreshSeconds: process.env.FR24_REFRESH_SECONDS,
    limit: process.env.FR24_LIMIT,
  },
});
const querySchema = z
  .object({ direction: z.enum(["all", "arrival", "departure"]).optional() })
  .strict();
export async function trackingFlights(req, res) {
  const { direction = "all" } = querySchema.parse(req.query);
  const result = await tracker.getFlights();
  if (result.scope === "area" && direction !== "all")
    throw fail(
      400,
      "Cette source ne fournit pas les arrivées et départs de l’aéroport.",
    );
  res.json({
    ...result,
    flights: result.flights.filter(
      (f) => direction === "all" || f.direction === direction,
    ),
  });
}
