import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { dictionary } from "../contexts/translations";

const publicRoutes = {
  "/": ["metaHomeTitle", "metaHomeDescription"],
  "/flights": ["flights", "metaFlightsDescription"],
  "/tracking": ["tracking", "metaTrackingDescription"],
  "/services": ["services", "metaServicesDescription"],
  "/faq": ["faq", "metaFaqDescription"],
  "/assistant": ["assistant", "metaAssistantDescription"],
  "/complaints": ["complaints", "metaComplaintsDescription"],
  "/login": ["login", "metaLoginDescription"],
  "/register": ["register", "metaRegisterDescription"],
  "/account": ["account", "metaAccountDescription"],
};
const adminRoutes = {
  "/admin": "dashboard",
  "/admin/flights": "flights",
  "/admin/services": "services",
  "/admin/faq": "faq",
  "/admin/knowledge": "knowledge",
  "/admin/complaints": "complaints",
  "/admin/conversations": "conversations",
  "/admin/analytics": "analytics",
};

function setMeta(attribute, name, content) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.append(element);
  }
  element.setAttribute("content", content);
}

export default function RouteMetadata({ lang }) {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const route = pathname.replace(/\/+$/, "") || "/";
  const translate = (key) =>
    dictionary[key]?.[lang] || dictionary[key]?.fr || key;
  const adminTitle = adminRoutes[route];
  const [titleKey, descriptionKey] =
    publicRoutes[route] ||
    (/^\/flights\/[^/]+$/.test(route)
      ? ["metaFlightTitle", "metaFlightsDescription"]
      : adminTitle
        ? [adminTitle, "metaAdminDescription"]
        : ["metaNotFoundTitle", "metaNotFoundDescription"]);
  const title = `${adminTitle ? `${translate("admin")} · ` : ""}${translate(titleKey)} | Oujda Smart`;
  const description = translate(descriptionKey);
  const isPrivate =
    route.startsWith("/admin") ||
    ["/account", "/login", "/register", "/assistant", "/complaints"].includes(
      route,
    ) ||
    titleKey === "metaNotFoundTitle";

  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      isPrivate ? "noindex, nofollow" : "index, follow",
    );
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:site_name", "Oujda Smart");
    setMeta("property", "og:type", "website");
    setMeta(
      "property",
      "og:locale",
      { fr: "fr_MA", en: "en_GB", ar: "ar_MA" }[lang],
    );
  }, [title, description, lang, isPrivate]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    let heading;
    let previousTabIndex;
    const frame = requestAnimationFrame(() => {
      heading =
        document.querySelector("main h1") || document.querySelector("main");
      if (!heading) return;
      previousTabIndex = heading.getAttribute("tabindex");
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      if (!heading) return;
      if (previousTabIndex === null) heading.removeAttribute("tabindex");
      else heading.setAttribute("tabindex", previousTabIndex);
    };
  }, [pathname]);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {translate("pageLoaded")}: {title}
    </div>
  );
}
