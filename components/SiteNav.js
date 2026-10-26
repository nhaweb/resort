"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useDictionary, useLocale } from "@/components/LocaleProvider";

/**
 * @param {{ variant?: 'home' | 'page' }} props
 */
export default function SiteNav({ variant = "home" }) {
  const locale = useLocale();
  const { nav, site, ui } = useDictionary();
  const [open, setOpen] = useState(false);
  const bookHref = `/${locale}/book`;
  const homeHref = `/${locale}`;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function navHref(item) {
    const { href } = item;
    if (href.startsWith("#")) {
      return variant === "home" ? href : `${homeHref}${href}`;
    }
    if (href.startsWith("/")) {
      return href.startsWith(`/${locale}/`) || href === `/${locale}`
        ? href
        : `/${locale}${href}`;
    }
    return href;
  }

  return (
    <>
      <header className="nav">
        <Link
          className="nav__brand"
          href={variant === "home" ? "#top" : homeHref}
        >
          {site.name}
        </Link>
        <nav className="nav__links" aria-label={ui.primaryNav}>
          {nav.map((item) => (
            <Link key={item.href} className="link-plain" href={navHref(item)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav__actions">
          <LanguageSwitcher />
          <Link className="btn nav__cta" href={bookHref}>
            {ui.enquire}
          </Link>
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
          <Link
            key={item.href}
            href={navHref(item)}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link className="btn" href={bookHref} onClick={() => setOpen(false)}>
          {ui.enquire}
        </Link>
      </div>
    </>
  );
}
