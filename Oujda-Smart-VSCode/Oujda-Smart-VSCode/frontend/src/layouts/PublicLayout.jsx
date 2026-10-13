import { useState, useEffect } from "react";
import {
  NavLink,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Globe,
  UserRound,
  Menu,
  X,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  Plane,
  MessageCircle,
  LogOut,
  House,
  PlaneTakeoff,
  Radar,
  Sparkles,
} from "lucide-react";
import { Brand } from "../components/UI";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import { travelCopy } from "../contexts/travelCopy";
export default function PublicLayout() {
  const { t, lang, setLang, user, setUser } = useApp();
  const copy = travelCopy[lang] || travelCopy.fr;
  const [menu, setMenu] = useState(false),
    location = useLocation(),
    navigate = useNavigate();
  useEffect(() => {
    setMenu(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!menu) return;
    document
      .querySelector("#primary-navigation a")
      ?.focus({ preventScroll: true });
    const close = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.getElementById("mobile-menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  return (
    <div className="public-shell">
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>
      <div className="utility-bar">
        <div className="container">
          <span>
            <MapPin size={13} />
            {t("airport")}
          </span>
          <span>
            <ShieldCheck size={13} />
            {t("academic")}
            <i />
            {location.pathname === "/tracking" ? t("tracking") : t("noLive")}
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav
            id="primary-navigation"
            aria-label={copy.navigation}
            className={menu ? "open" : ""}
          >
            {[
              ["/", "home"],
              ["/flights", "flights"],
              ["/services", "services"],
              ["/assistant", "assistant"],
              ["/tracking", "tracking"],
              ["/complaints", "complaints"],
            ].map(([url, k]) => (
              <NavLink end={url === "/"} key={url} to={url}>
                {t(k)}
                {k === "assistant" && <span className="ai-dot" />}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <label className="language-picker">
              <Globe size={17} />
              <select
                aria-label="Language / Langue / اللغة"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
            </label>
            <Link className="btn account-btn" to={user ? "/account" : "/login"}>
              <UserRound size={16} />
              <span>{t(user ? "account" : "login")}</span>
            </Link>
            <button
              className="icon-btn mobile-menu"
              id="mobile-menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? copy.closeMenu : copy.menu}
              aria-expanded={menu}
              aria-controls="primary-navigation"
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <div id="main-content" tabIndex={-1}>
        <Outlet />
      </div>
      <footer className="site-footer">
        <div className="container footer-main">
          <div>
            <Brand />
            <p>
              {t("airport")}
              <br />
              {copy.footerLine}
            </p>
          </div>
          <div>
            <h4>{t("quickAccess")}</h4>
            <Link to="/flights">{t("flights")}</Link>
            <Link to="/tracking">{t("tracking")}</Link>
            <Link to="/services">{t("services")}</Link>
            <Link to="/faq">{t("faq")}</Link>
          </div>
          <div>
            <h4>{t("assistance")}</h4>
            <Link to="/assistant">{t("assistant")}</Link>
            <Link to="/complaints">{t("complaints")}</Link>
            <Link to={user?.role === "ADMIN" ? "/admin" : "/login"}>
              {t("admin")}
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="footer-academic">
            <ShieldCheck size={22} />
            <strong>{t("academic")}</strong>
            <p>{t("footer")}</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Oujda Smart ·{" "}
            {t(location.pathname === "/tracking" ? "tracking" : "demo")}
          </span>
          <span>FR · العربية · EN</span>
        </div>
      </footer>
      <nav className="mobile-bottom-nav" aria-label={copy.mobileNavigation}>
        {[
          ["/", "home", House],
          ["/flights", "flights", PlaneTakeoff],
          ["/assistant", "assistant", Sparkles],
          ["/tracking", "tracking", Radar],
          [user ? "/account" : "/login", "account", UserRound],
        ].map(([url, label, Icon]) => (
          <NavLink end={url === "/"} to={url} key={label}>
            <Icon size={20} />
            <span>{t(label)}</span>
          </NavLink>
        ))}
      </nav>
      {location.pathname !== "/assistant" && (
        <Link
          className="floating-chat"
          to="/assistant"
          aria-label={t("assistant")}
        >
          <MessageCircle size={24} />
        </Link>
      )}
    </div>
  );
}
