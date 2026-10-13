import { createTrackingService, TRACKING_AIRPORT } from "./tracking.js";
import { createAdsbTrackingService } from "./adsbTracking.js";
import { createOpenSkyTrackingService } from "./openSkyTracking.js";

export function createTracker(settings = {}, dependencies = {}) {
  const provider = settings.provider ?? "opensky";
  if (provider === "opensky")
    return createOpenSkyTrackingService(settings.opensky, dependencies);
  if (provider === "adsb_lol")
    return createAdsbTrackingService(settings.adsb, dependencies);
  if (provider === "flightradar24") {
    const service = createTrackingService(settings.fr24, dependencies);
    return {
      async getFlights() {
        return {
          ...(await service.getFlights()),
          scope: "airport_routes",
          radiusNm: null,
        };
      },
    };
  }
  return {
    async getFlights() {
      return {
        provider: "none",
        scope: null,
        radiusNm: null,
        status: "not_configured",
        mode: "disabled",
        reason: provider === "disabled" ? null : "configuration",
        airport: { ...TRACKING_AIRPORT },
        fetchedAt: null,
        refreshAfterSeconds: 300,
        limit: 0,
        truncated: false,
        flights: [],
      };
    },
  };
}
