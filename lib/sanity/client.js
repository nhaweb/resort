import { createClient } from "next-sanity";

export const SANITY_API_VERSION = "2025-01-01";

export function sanityProjectId() {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
}

export function sanityDataset() {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || "";
}

/** True when both project id and dataset are set. */
export function isSanityConfigured() {
  return Boolean(sanityProjectId() && sanityDataset());
}

/** @type {import('next-sanity').SanityClient | null} */
let client = null;

/**
 * Read-only client, or `null` when Sanity env is missing (callers fall back
 * to the dictionary). Uses the CDN and published content only.
 */
export function getSanityClient() {
  if (!isSanityConfigured()) return null;
  if (!client) {
    client = createClient({
      projectId: sanityProjectId(),
      dataset: sanityDataset(),
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
      perspective: "published",
    });
  }
  return client;
}
