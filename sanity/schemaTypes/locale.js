import { defineField, defineType } from "sanity";
import { locales } from "../../lib/i18n";

const labels = { vi: "Tiếng Việt", en: "English" };

/** @param {'string' | 'text'} type */
function localeFields(type) {
  return locales.map((id) =>
    defineField({
      name: id,
      title: labels[id] || id,
      type,
      rows: type === "text" ? 4 : undefined,
    }),
  );
}

/** Field-level translations. The first locale (`vi`) is the fallback. */
export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fields: localeFields("string"),
});

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: localeFields("text"),
});
