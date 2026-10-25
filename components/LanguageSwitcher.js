"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { locales } from "@/lib/i18n";

const labels = { vi: "VI", en: "EN" };

export default function LanguageSwitcher() {
  const locale = useLocale();
  const { ui } = useDictionary();
  const pathname = usePathname() || `/${locale}`;

  const rest = pathname.replace(/^\/(vi|en)/, "") || "";

  return (
    <nav className="lang-switch" aria-label={ui.language}>
      {locales.map((code, index) => (
        <span key={code} className="lang-switch__item">
          {index > 0 ? (
            <span className="lang-switch__sep" aria-hidden="true">
              /
            </span>
          ) : null}
          <Link
            href={`/${code}${rest}`}
            className={`lang-switch__link${code === locale ? " is-active" : ""}`}
            hrefLang={code}
            lang={code}
            aria-current={code === locale ? "page" : undefined}
          >
            {labels[code]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
