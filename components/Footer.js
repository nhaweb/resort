"use client";

import { useDictionary } from "@/components/LocaleProvider";

export default function Footer() {
  const { credits, nav, site, ui } = useDictionary();

  return (
    <footer className="footer">
      <div className="footer__cols">
        <div>
          <h3>{ui.footerVisit}</h3>
          <ul>
            {site.address.map((line) => (
              <li key={line}>{line}</li>
            ))}
            <li>{site.boat}</li>
          </ul>
        </div>
        <div>
          <h3>{ui.footerExplore}</h3>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{ui.footerContact}</h3>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>{site.phone}</li>
          </ul>
        </div>
        <div>
          <h3>{ui.footerHours}</h3>
          <ul>
            {site.hours.map((row) => (
              <li key={row.days}>
                {row.days}: {row.time}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="footer__mark">
          <svg viewBox="0 0 900 140" role="img" aria-label="Orilla">
            <title>Orilla</title>
            <text
              x="0"
              y="115"
              fill="currentColor"
              fontFamily="Switzer, system-ui, sans-serif"
              fontSize="140"
              letterSpacing="-6"
            >
              Orilla
            </text>
          </svg>
        </p>
        <p className="footer__legal">{ui.footerLegal}</p>
        <p className="footer__credits">
          {ui.footerImagery}:{" "}
          {credits.map((c) => `${c.title} (${c.note})`).join(" · ")}.{" "}
          {ui.footerFootage}:{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Ocean_waves_at_L%C3%A6kjavik_beach,_Iceland.webm">
            {ui.footerFootageCredit}
          </a>
          , <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>,
          via Wikimedia Commons. {ui.footerStillsNote}
        </p>
      </div>
    </footer>
  );
}
