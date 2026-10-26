import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityDataset, sanityProjectId } from "./client";

/**
 * Builds a CDN URL for a Sanity image field, honouring crop and hotspot.
 *
 * @param {unknown} source
 * @param {{ width?: number }} [options]
 * @returns {string | null}
 */
export function sanityImageUrl(source, { width = 1600 } = {}) {
  if (!source || !sanityProjectId() || !sanityDataset()) return null;
  try {
    return createImageUrlBuilder({
      projectId: sanityProjectId(),
      dataset: sanityDataset(),
    })
      .image(source)
      .width(width)
      .auto("format")
      .url();
  } catch {
    return null;
  }
}
