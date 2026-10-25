export const locales = ["vi", "en"];
export const defaultLocale = "vi";
export const localeCookie = "NEXT_LOCALE";

/**
 * @typedef {'vi' | 'en'} Locale
 */

/** @param {string} value @returns {value is Locale} */
export function isLocale(value) {
  return locales.includes(/** @type {Locale} */ (value));
}

/**
 * @param {string | null | undefined} acceptLanguage
 * @returns {Locale}
 */
export function matchLocale(acceptLanguage) {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qValue] = part.trim().split(";q=");
      return {
        tag: tag.toLowerCase(),
        q: qValue ? Number(qValue) : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    if (tag.startsWith("vi")) return "vi";
    if (tag.startsWith("en")) return "en";
  }

  return defaultLocale;
}
