import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Info } from "lucide-react";
import "leaflet/dist/leaflet.css";

const airportFallback = [34.786111, -1.925556];
const safeCoordinates = (lat, lon) =>
  Number.isFinite(lat) &&
  Number.isFinite(lon) &&
  Math.abs(lat) <= 90 &&
  Math.abs(lon) <= 180;
function airportCoordinates(airport) {
  return safeCoordinates(airport?.lat, airport?.lon)
    ? [airport.lat, airport.lon]
    : airportFallback;
}
function positionIsOld(flight, now) {
  const at = Date.parse(flight.positionAt);
  return flight.positionStale || !Number.isFinite(at) || now - at > 120_000;
}
function positionTime(flight, lang, copy) {
  const date = new Date(flight.positionAt);
  return !flight.positionAt || Number.isNaN(date.getTime())
    ? copy.positionUnknown
    : new Intl.DateTimeFormat(lang, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Africa/Casablanca",
      }).format(date);
}
function popupContent(flight, copy, lang, now) {
  const popup = document.createElement("div");
  popup.className = "tracking-map-popup";
  popup.dir = lang === "ar" ? "rtl" : "ltr";
  const heading = document.createElement("strong");
  heading.textContent =
    flight.number || flight.callsign || flight.registration || "—";
  heading.dir = "ltr";
  const route = document.createElement("p");
  const hasRoute = flight.origin && flight.destination;
  route.textContent = hasRoute
    ? `${flight.origin} → ${flight.destination}`
    : copy.routeUnknown;
  route.dir = hasRoute || lang !== "ar" ? "ltr" : "rtl";
  const timestamp = document.createElement("small");
  timestamp.textContent = `${copy.position}: ${positionTime(flight, lang, copy)}`;
  const status = document.createElement("small");
  status.className = positionIsOld(flight, now) ? "old" : "";
  status.textContent = positionIsOld(flight, now)
    ? copy.oldPosition
    : copy.currentPosition;
  popup.append(heading, route, timestamp, status);
  return popup;
}
function planeIcon(flight, selected, now) {
  const element = document.createElement("span");
  element.className = "tracking-plane-symbol";
  const heading = Number.isFinite(flight.heading) ? flight.heading : 0;
  element.style.transform = `rotate(${heading}deg)`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const shape = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );
  shape.setAttribute(
    "points",
    "12,1 14,10 22,15 22,18 14,15 14,20 17,22 17,23 7,23 7,22 10,20 10,15 2,18 2,15 10,10",
  );
  svg.append(shape);
  element.append(svg);
  return L.divIcon({
    html: element,
    className: `tracking-plane-marker${selected ? " selected" : ""}${positionIsOld(flight, now) ? " old" : ""}`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -19],
  });
}
export default function TrackingMap({
  airport,
  flights,
  selectedId,
  selectionVersion,
  centerVersion,
  onSelect,
  copy,
  lang,
  now,
  scope,
  radiusNm,
}) {
  const container = useRef(null);
  const map = useRef(null);
  const airportMarker = useRef(null);
  const areaCircle = useRef(null);
  const areaFitted = useRef(false);
  const markers = useRef(new Map());
  const activeCopy = useRef(copy);
  const selectCallback = useRef(onSelect);
  const lastSelection = useRef(null);
  const initialCenterVersion = useRef(centerVersion);
  const [tileError, setTileError] = useState(false);
  activeCopy.current = copy;
  selectCallback.current = onSelect;
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const instance = L.map(container.current, {
      center: airportCoordinates(airport),
      zoom: 7,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      scrollWheelZoom: false,
      zoomAnimation: !reduceMotion,
      fadeAnimation: !reduceMotion,
      markerZoomAnimation: !reduceMotion,
      attributionControl: true,
    });
    map.current = instance;
    L.control
      .zoom({
        position: "topright",
        zoomInTitle: activeCopy.current.zoomIn,
        zoomOutTitle: activeCopy.current.zoomOut,
      })
      .addTo(instance);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      referrerPolicy: "strict-origin-when-cross-origin",
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 0,
    })
      .on("tileerror", () => setTileError(true))
      .addTo(instance);
    airportMarker.current = L.circleMarker(airportCoordinates(airport), {
      radius: 7,
      color: "#fff",
      weight: 3,
      fillColor: "#174e47",
      fillOpacity: 1,
    }).addTo(instance);
    const observer = new ResizeObserver(() =>
      instance.invalidateSize({ pan: false }),
    );
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      markers.current.clear();
      instance.remove();
      map.current = null;
      airportMarker.current = null;
      areaCircle.current = null;
    };
  }, []);
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    if (scope !== "area") {
      areaCircle.current?.remove();
      areaCircle.current = null;
      areaFitted.current = false;
      return;
    }
    const meters = radiusNm * 1852;
    if (!areaCircle.current) {
      areaCircle.current = L.circle(airportCoordinates(airport), {
        radius: meters,
        color: "#447969",
        weight: 1.5,
        dashArray: "6 5",
        fillColor: "#81aa92",
        fillOpacity: 0.07,
        interactive: false,
        className: "tracking-area-circle",
      }).addTo(instance);
    } else
      areaCircle.current
        .setLatLng(airportCoordinates(airport))
        .setRadius(meters);
    if (!areaFitted.current) {
      instance.fitBounds(areaCircle.current.getBounds(), {
        padding: [18, 18],
        maxZoom: 7,
        animate: false,
      });
      areaFitted.current = true;
    }
  }, [scope, radiusNm, airport?.lat, airport?.lon]);
  useEffect(() => {
    if (!map.current) return;
    const label = document.createElement("span");
    label.textContent = `${airport?.iata || "OUD"} · ${copy.airport}`;
    airportMarker.current
      ?.setLatLng(airportCoordinates(airport))
      .bindTooltip(label, { direction: "bottom", offset: [0, 7] });
    const zoomIn = container.current.querySelector(".leaflet-control-zoom-in");
    const zoomOut = container.current.querySelector(
      ".leaflet-control-zoom-out",
    );
    if (zoomIn) {
      zoomIn.title = copy.zoomIn;
      zoomIn.setAttribute("aria-label", copy.zoomIn);
    }
    if (zoomOut) {
      zoomOut.title = copy.zoomOut;
      zoomOut.setAttribute("aria-label", copy.zoomOut);
    }
  }, [airport, copy]);
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    const present = new Set();
    for (const flight of flights) {
      if (!safeCoordinates(flight.latitude, flight.longitude)) continue;
      present.add(flight.id);
      let marker = markers.current.get(flight.id);
      const title = `${copy.select} ${flight.number || flight.callsign || flight.registration || flight.id}`;
      if (!marker) {
        marker = L.marker([flight.latitude, flight.longitude], {
          icon: planeIcon(flight, flight.id === selectedId, now),
          title,
          alt: title,
          keyboard: true,
          riseOnHover: true,
        }).addTo(instance);
        marker.on("click", () => selectCallback.current(flight.id));
        marker.on("popupopen", () => {
          const close = marker
            .getPopup()
            ?.getElement()
            ?.querySelector(".leaflet-popup-close-button");
          if (close) {
            close.setAttribute("aria-label", activeCopy.current.close);
            close.title = activeCopy.current.close;
          }
        });
        markers.current.set(flight.id, marker);
      } else
        marker
          .setLatLng([flight.latitude, flight.longitude])
          .setIcon(planeIcon(flight, flight.id === selectedId, now));
      marker.getElement()?.setAttribute("aria-label", title);
      marker.getElement()?.setAttribute("title", title);
      const content = popupContent(flight, copy, lang, now);
      if (marker.getPopup()) marker.setPopupContent(content);
      else
        marker.bindPopup(content, {
          autoPan: false,
          maxWidth: 265,
          minWidth: 180,
        });
      const closeButton = marker
        .getPopup()
        ?.getElement()
        ?.querySelector(".leaflet-popup-close-button");
      if (closeButton) {
        closeButton.setAttribute("aria-label", copy.close);
        closeButton.title = copy.close;
      }
    }
    for (const [id, marker] of markers.current)
      if (!present.has(id)) {
        marker.remove();
        markers.current.delete(id);
      }
  }, [flights, selectedId, copy, lang, now]);
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    if (!selectedId) {
      instance.closePopup();
      lastSelection.current = null;
      return;
    }
    const marker = markers.current.get(selectedId);
    if (
      marker &&
      lastSelection.current !== `${selectedId}:${selectionVersion}`
    ) {
      lastSelection.current = `${selectedId}:${selectionVersion}`;
      instance.setView(marker.getLatLng(), Math.max(instance.getZoom(), 7), {
        animate: false,
      });
      marker.openPopup();
    }
  }, [selectedId, selectionVersion]);
  useEffect(() => {
    if (initialCenterVersion.current === centerVersion) return;
    initialCenterVersion.current = centerVersion;
    if (scope === "area" && areaCircle.current)
      map.current?.fitBounds(areaCircle.current.getBounds(), {
        padding: [18, 18],
        maxZoom: 7,
        animate: false,
      });
    else
      map.current?.setView(airportCoordinates(airport), 7, { animate: false });
  }, [centerVersion, airport, scope]);
  return (
    <div className="tracking-map-wrap">
      <div
        ref={container}
        className="tracking-map"
        role="region"
        aria-label={copy.map}
        aria-describedby="tracking-map-help"
        dir="ltr"
      />
      <p id="tracking-map-help" className="sr-only">
        {copy.mapHelp}
      </p>
      {tileError && (
        <div className="tracking-tile-warning" role="status">
          <Info size={14} />
          <span>{copy.mapUnavailable}</span>
        </div>
      )}
    </div>
  );
}
