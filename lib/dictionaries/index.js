import { defaultLocale, isLocale } from "@/lib/i18n";
import en from "./en";
import vi from "./vi";

const dictionaries = { en, vi };

/**
 * @param {string} locale
 * @returns {import('./types').Dictionary}
 */
export function getDictionary(locale) {
  if (isLocale(locale)) return dictionaries[locale];
  return dictionaries[defaultLocale];
}
