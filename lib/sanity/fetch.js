import { cacheLife, cacheTag } from "next/cache";
import { getDictionary } from "@/lib/dictionaries";
import { getSanityClient } from "./client";
import { sanityImageUrl } from "./image";

/**
 * Marketing content helpers. Each prefers Sanity and falls back to the
 * dictionary (`lib/dictionaries/*`) when Sanity env is missing, the request
 * fails, or the document is empty. Transactional data (rates, capacity,
 * availability) never comes from Sanity.
 *
 * Revalidate on publish with `revalidateTag("sanity", "max")` (Sanity webhook).
 *
 * @typedef {import('@/lib/i18n').Locale} Locale
 * @typedef {import('@/lib/rooms').MarketingVilla} MarketingVilla
 */

const VILLAS_QUERY = `*[_type == "villa" && defined(villaId)]{
  villaId, name, line, description, amenities, materials, aspect, mainImage, images
}`;
const GALLERY_QUERY = `*[_type == "gallery"][0]{ eyebrow, title, description, images }`;
const FAQ_QUERY = `*[_type == "faq"][0]{ title, items }`;

/**
 * @param {string} query
 * @returns {Promise<unknown>} null when Sanity is unconfigured or fails
 */
async function runQuery(query) {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("[sanity] fetch failed, using dictionary fallback", error);
    return null;
  }
}

/** @returns {Promise<Record<string, any>[] | null>} */
async function fetchVillaDocs() {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  const docs = await runQuery(VILLAS_QUERY);
  return Array.isArray(docs) ? docs : null;
}

/** @returns {Promise<Record<string, any> | null>} */
async function fetchGalleryDoc() {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return /** @type {Record<string, any> | null} */ (
    await runQuery(GALLERY_QUERY)
  );
}

/** @returns {Promise<Record<string, any> | null>} */
async function fetchFaqDoc() {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return /** @type {Record<string, any> | null} */ (await runQuery(FAQ_QUERY));
}

/**
 * Picks a translation from a `localeString`/`localeText` object, falling back
 * to the other locales, then to `fallback`.
 *
 * @template T
 * @param {Record<string, string> | null | undefined} field
 * @param {Locale} locale
 * @param {T} fallback
 * @returns {string | T}
 */
function pick(field, locale, fallback) {
  for (const key of [locale, "vi", "en"]) {
    const value = field?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

/**
 * @param {Record<string, any> | null | undefined} image Sanity image with `alt`
 * @param {Locale} locale
 * @param {{ src: string, alt: string }} fallback
 * @param {number} [width]
 */
function pickImage(image, locale, fallback, width) {
  const src = sanityImageUrl(image, { width });
  if (!src) return fallback;
  return { src, alt: pick(image?.alt, locale, fallback.alt) };
}

/**
 * Merges a Sanity villa document onto its dictionary entry.
 *
 * @param {MarketingVilla} base
 * @param {Record<string, any>} doc
 * @param {Locale} locale
 * @returns {MarketingVilla}
 */
function mergeVilla(base, doc, locale) {
  const main = pickImage(doc.mainImage, locale, {
    src: base.image,
    alt: base.alt,
  });

  const amenities = Array.isArray(doc.amenities)
    ? doc.amenities.map((item) => pick(item, locale, "")).filter(Boolean)
    : [];

  const extraImages = Array.isArray(doc.images)
    ? doc.images
        .map((image) => pickImage(image, locale, { src: "", alt: "" }, 1200))
        .filter((image) => image.src)
    : [];

  return {
    ...base,
    name:
      typeof doc.name === "string" && doc.name.trim() ? doc.name : base.name,
    line: pick(doc.line, locale, base.line),
    description: pick(doc.description, locale, base.description),
    materials: pick(doc.materials, locale, base.materials),
    aspect: doc.aspect || base.aspect,
    image: main.src,
    alt: main.alt,
    amenities: amenities.length ? amenities : base.amenities,
    images: extraImages.length ? extraImages : base.images,
  };
}

/**
 * Villa marketing copy for a locale: dictionary order, Sanity overrides.
 * Sanity villas whose `villaId` is not in the dictionary are ignored because
 * they cannot be booked.
 *
 * @param {Locale} locale
 * @returns {Promise<MarketingVilla[]>}
 */
export async function getMarketingVillas(locale) {
  const base = getDictionary(locale).villas;
  const docs = await fetchVillaDocs();
  if (!docs?.length) return base;

  const byId = new Map(docs.map((doc) => [doc.villaId, doc]));
  return base.map((villa) => {
    const doc = byId.get(villa.id);
    return doc ? mergeVilla(villa, doc, locale) : villa;
  });
}

/**
 * @param {Locale} locale
 * @param {string} id
 * @returns {Promise<MarketingVilla | undefined>}
 */
export async function getMarketingVilla(locale, id) {
  const villas = await getMarketingVillas(locale);
  return villas.find((villa) => villa.id === id);
}

/**
 * FAQ block (same shape as `dictionary.faq`) with Sanity items when present.
 *
 * @param {Locale} locale
 */
export async function getMarketingFaq(locale) {
  const base = getDictionary(locale).faq;
  const doc = await fetchFaqDoc();
  if (!doc) return base;

  const items = Array.isArray(doc.items)
    ? doc.items
        .map((item) => ({
          q: pick(item.question, locale, ""),
          a: pick(item.answer, locale, ""),
        }))
        .filter((item) => item.q && item.a)
    : [];

  return {
    ...base,
    title: pick(doc.title, locale, base.title),
    items: items.length ? items : base.items,
  };
}

/**
 * Gallery block (same shape as `dictionary.gallery`). Layout hints (`aspect`,
 * `span`) are taken from the dictionary entry at the same index.
 *
 * @param {Locale} locale
 */
export async function getMarketingGallery(locale) {
  const base = getDictionary(locale).gallery;
  const doc = await fetchGalleryDoc();
  if (!doc) return base;

  const images = Array.isArray(doc.images)
    ? doc.images
        .map((image, index) => {
          const layout = base.images[index % base.images.length] || {};
          const src = sanityImageUrl(image);
          if (!src) return null;
          return {
            id: String(index + 1).padStart(2, "0"),
            src,
            alt: pick(image.alt, locale, ""),
            caption: pick(image.caption, locale, ""),
            aspect: layout.aspect || "landscape",
            span: layout.span || { cols: 4, rows: 1 },
          };
        })
        .filter(Boolean)
    : [];

  return {
    ...base,
    eyebrow: pick(doc.eyebrow, locale, base.eyebrow),
    title: pick(doc.title, locale, base.title),
    description: pick(doc.description, locale, base.description),
    images: images.length ? images : base.images,
  };
}
