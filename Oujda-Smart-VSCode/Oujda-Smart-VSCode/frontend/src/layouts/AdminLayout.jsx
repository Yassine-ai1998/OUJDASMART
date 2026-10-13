import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  MessageCircle,
  HelpCircle,
  ChartColumn,
  BookOpen,
  Layers,
  MessagesSquare,
  ArrowUpRight,
  LogOut,
  Globe,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import { Brand } from "../components/UI";
export default function AdminLayout() {
  const { t, lang, setLang, user, setUser } = useApp(),
    navigate = useNavigate();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand />
        <span className="admin-label">{t("admin")}</span>
        <nav>
          {[
            ["", "dashboard", LayoutDashboard],
            ["flights", "flights", Plane],
            ["services", "services", Layers],
            ["faq", "faq", HelpCircle],
            ["knowledge", "knowledge", BookOpen],
            ["complaints", "complaints", MessageCircle],
            ["conversations", "conversations", MessagesSquare],
            ["analytics", "analytics", ChartColumn],
          ].map(([path, k, Icon]) => (
            <NavLink end to={"/admin" + (path ? "/" + path : "")} key={k}>
              <Icon size={19} />
              {t(k)}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/">
            {t("passengerView")}
            <ArrowUpRight size={16} />
          </Link>
          <button
            onClick={async () => {
              await api.post("/auth/logout", {});
              setUser(null);
              navigate("/");
            }}
          >
            <LogOut size={17} />
            {t("logout")}
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <span>
            {t("airport")} <span className="demo-pill">{t("academic")}</span>
          </span>
          <div>
            <label className="language-picker">
              <Globe size={16} />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Language"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
            </label>
            <span className="user-avatar">{user.name[0]}</span>
            <strong>{user.name}</strong>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
        <footer className="admin-footer">{t("footer")}</footer>
      </div>
    </div>
  );
}
