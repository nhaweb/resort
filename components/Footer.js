"use client";

import Link from "next/link";
import { useDictionary, useLocale } from "@/components/LocaleProvider";

export default function Footer() {
  const locale = useLocale();
  const { credits, nav, site, ui } = useDictionary();
  const homeHref = `/${locale}`;

  function navHref(href) {
    if (href.startsWith("#")) return `${homeHref}${href}`;
    if (href.startsWith("/")) {
      return href.startsWith(`/${locale}`) ? href : `${homeHref}${href}`;
    }
    return href;
  }

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
                <Link href={navHref(item.href)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{ui.footerContact}</h3>
          <ul>
            <li>
              <Link href={`mailto:${site.email}`}>{site.email}</Link>
            </li>
            <li>
              <Link href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>
                {site.phone}
              </Link>
            </li>
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
        <p className="footer__legal">
          <Link href={`/${locale}/policies`}>{ui.footerPolicies}</Link>
          {" · "}
          <Link href={`/${locale}/privacy`}>{ui.footerPrivacy}</Link>
        </p>
        <p className="footer__legal">{ui.footerLegal}</p>
        <p className="footer__credits">
          {ui.footerImagery}:{" "}
          {credits.map((c) => `${c.title} (${c.note})`).join(" · ")}.{" "}
          {ui.footerFootage}:{" "}
          <Link href="https://commons.wikimedia.org/wiki/File:Ocean_waves_at_L%C3%A6kjavik_beach,_Iceland.webm">
            {ui.footerFootageCredit}
          </Link>
          ,{" "}
          <Link href="https://creativecommons.org/licenses/by/3.0">
            CC BY 3.0
          </Link>
          , via Wikimedia Commons. {ui.footerStillsNote}
        </p>
      </div>
    </footer>
  );
}
