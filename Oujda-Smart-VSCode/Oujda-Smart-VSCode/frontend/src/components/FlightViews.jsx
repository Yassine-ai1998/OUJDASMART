import { NavLink } from "react-router-dom";
import { ListFilter, Radar } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import "../airport-navigation.css";

export default function FlightViews() {
  const { t } = useApp();
  return (
    <nav className="airport-view-nav" aria-label={t("flights")}>
      <NavLink to="/flights" end>
        <ListFilter size={17} />
        {t("airportBoardView")}
      </NavLink>
      <NavLink to="/tracking" end>
        <Radar size={17} />
        {t("aircraftMapView")}
      </NavLink>
    </nav>
  );
}
