import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { api } from "../services/api";
import { dictionary } from "./translations";
import RouteMetadata from "../components/RouteMetadata";
const Context = createContext(null);
const supportedLanguages = ["fr", "en", "ar"];
const languageStorageKey = "oas-lang";

function browserLanguage() {
  const preferences = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return (
    preferences
      .map((language) => language?.toLowerCase().split(/[-_]/)[0])
      .find((language) => supportedLanguages.includes(language)) || "fr"
  );
}

function initialLanguage() {
  try {
    const saved = localStorage.getItem(languageStorageKey);
    if (supportedLanguages.includes(saved)) return saved;
  } catch {
    // Browser language remains available when local storage is disabled.
  }
  return browserLanguage();
}

export function Provider({ children }) {
  const [lang, updateLang] = useState(initialLanguage),
    [user, setUser] = useState(null),
    [ready, setReady] = useState(false),
    [toast, setToast] = useState("");
  const timer = useRef(null);
  const setLang = useCallback((language) => {
    if (!supportedLanguages.includes(language)) return;
    updateLang(language);
    try {
      localStorage.setItem(languageStorageKey, language);
    } catch {
      // The selection still works for this visit in private browser modes.
    }
  }, []);
  useEffect(() => {
    const syncLanguage = (event) => {
      if (event.key !== languageStorageKey && event.key !== null) return;
      updateLang(initialLanguage());
    };
    window.addEventListener("storage", syncLanguage);
    return () => {
      window.removeEventListener("storage", syncLanguage);
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    api
      .get("/auth/me")
      .then(setUser)
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = (k) => dictionary[k]?.[lang] || dictionary[k]?.fr || k;
  const tr = (o) => o?.[lang] || o?.fr || "";
  const notify = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 4500);
  };
  return (
    <Context.Provider
      value={{ lang, setLang, t, tr, user, setUser, ready, notify }}
    >
      <RouteMetadata lang={lang} />
      {children}
      {toast && (
        <div
          className="toast"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {toast}
        </div>
      )}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
