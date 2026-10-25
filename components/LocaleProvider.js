"use client";

import { createContext, useContext } from "react";

/** @typedef {import('@/lib/dictionaries/types').Dictionary} Dictionary */
/** @typedef {import('@/lib/i18n').Locale} Locale */

/** @type {import('react').Context<{ locale: Locale, dictionary: Dictionary } | null>} */
const LocaleContext = createContext(null);

/**
 * @param {{ locale: Locale, dictionary: Dictionary, children: import('react').ReactNode }} props
 */
export function LocaleProvider({ locale, dictionary, children }) {
  return (
    <LocaleContext.Provider value={{ locale, dictionary }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx.locale;
}

export function useDictionary() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useDictionary must be used within LocaleProvider");
  }
  return ctx.dictionary;
}
