import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Globe2,
  MapPin,
  PlaneTakeoff,
  Sparkles,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { airportIdentityCopy } from "../contexts/airportIdentityCopy";

export default function AirportHero({
  variant = "home",
  title,
  description,
  children,
}) {
  const { lang } = useApp();
  const copy = airportIdentityCopy[lang] || airportIdentityCopy.fr;
  const home = variant === "home";
  return (
    <section className={`airport-hero airport-hero-${variant}`}>
      <img
        className="airport-hero-photo"
        src="/oujda-angads.jpg"
        alt={copy.photoAlt}
        width="2661"
        height="2033"
        fetchPriority="high"
      />
      <div className="airport-hero-shade" aria-hidden="true" />
      <div className="airport-hero-content">
        <span className="airport-hero-eyebrow">
          <span />
          {copy.eyebrow}
        </span>
        <h1>
          {home ? (
            <>
              {copy.title}
              <br />
              <em>{copy.accent}</em>
            </>
          ) : (
            title
          )}
        </h1>
        <p>{description || (home ? copy.intro : copy.flightsIntro)}</p>
        {home ? (
          <div className="airport-hero-actions">
            <Link className="airport-hero-primary" to="/flights">
              <PlaneTakeoff size={18} />
              {copy.explore}
              <ArrowUpRight size={18} />
            </Link>
            <Link className="airport-hero-secondary" to="/assistant">
              <Sparkles size={17} />
              {copy.assistant}
            </Link>
          </div>
        ) : (
          children && <div className="airport-hero-actions">{children}</div>
        )}
        {home && (
          <div className="airport-hero-languages">
            <Globe2 size={15} />
            <span>{copy.languages}</span>
          </div>
        )}
      </div>
      <div className="airport-hero-stamp" aria-hidden="true">
        <span>{copy.airport}</span>
        <strong>OUD</strong>
        <span>GMFO · MOROCCO</span>
      </div>
      <div className="airport-hero-footer">
        <span className="airport-hero-location">
          <MapPin size={14} />
          {copy.location}
        </span>
        <span className="airport-photo-credit">
          <a
            href="https://commons.wikimedia.org/wiki/File:Aeroport_Oujda_Angads_2024.jpg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${copy.credit} — ${copy.photo}`}
          >
            {copy.photo}
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-SA 4.0
          </a>
        </span>
      </div>
    </section>
  );
}
