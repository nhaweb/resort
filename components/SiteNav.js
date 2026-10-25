"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useDictionary } from "@/components/LocaleProvider";

export default function SiteNav() {
  const { nav, site, ui } = useDictionary();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="nav">
        <a className="nav__brand" href="#top">
          {site.name}
        </a>
        <nav className="nav__links" aria-label={ui.primaryNav}>
          {nav.map((item) => (
            <a key={item.href} className="link-plain" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <LanguageSwitcher />
          <a className="btn nav__cta" href="#stay">
            {ui.enquire}
          </a>
        </div>
        <button
          type="button"
          className="nav__menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(true)}
        >
          {ui.menu}
        </button>
      </header>

      <div
        id="mobile-nav"
        className={`nav-drawer${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <button
          type="button"
          className="link-plain"
          onClick={() => setOpen(false)}
        >
          {ui.close}
        </button>
        {nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <button
          type="button"
          className="btn"
          onClick={() => {
            setOpen(false);
            window.location.hash = "stay";
          }}
        >
          {ui.enquire}
        </button>
      </div>
    </>
  );
}
