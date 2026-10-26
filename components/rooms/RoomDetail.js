import Image from "next/image";
import Link from "next/link";
import RoomBookDock from "@/components/rooms/RoomBookDock";
import RoomStageMedia from "@/components/rooms/RoomStageMedia";
import SeaClip from "@/components/SeaClip";
import { formatRoomMoney, getRoomCatalog } from "@/lib/rooms";

/** Cove stills used only to fill the stage when a villa has few of its own. */
const COVE_STILLS = [
  {
    src: "/images/orilla-shore.jpg",
    alt: "Pale sand shore between limestone cliffs on the private cove",
  },
  {
    src: "/images/orilla-pool.jpg",
    alt: "Cliffside plunge pool above turquoise water at dusk",
  },
  {
    src: "/images/orilla-aerial.jpg",
    alt: "Aerial view of limestone cove and cliff villas",
  },
  {
    src: "/images/orilla-cliff-portrait.jpg",
    alt: "Carved limestone openings above the water",
  },
];

/**
 * @param {{ src: string, alt: string }[]} list
 * @param {{ src: string, alt?: string }} image
 */
function pushUnique(list, image) {
  if (!image?.src) return;
  if (list.some((item) => item.src === image.src)) return;
  list.push({ src: image.src, alt: image.alt || "" });
}

/**
 * @param {import('@/lib/rooms').RoomEntry} room
 */
function stageImagesFor(room) {
  /** @type {{ src: string, alt: string }[]} */
  const out = [];
  pushUnique(out, { src: room.image, alt: room.alt });
  for (const image of room.images) pushUnique(out, image);
  for (const still of COVE_STILLS) {
    if (out.length >= 5) break;
    pushUnique(out, still);
  }
  return out;
}

/**
 * @param {import('@/lib/i18n').Locale} locale
 * @param {import('@/lib/rooms').RoomEntry} room
 */
function relatedVillas(locale, room) {
  const catalog = getRoomCatalog(locale).filter(
    (villa) => villa.id !== room.id,
  );
  const sameAspect = catalog.filter((villa) => villa.aspect === room.aspect);
  const pool = sameAspect.length >= 2 ? sameAspect : catalog;
  return pool.slice(0, 3);
}

/**
 * @param {string} aspect
 * @param {Record<string, string>} copy
 */
function aspectLabel(aspect, copy) {
  const key = `aspect${aspect.charAt(0).toUpperCase()}${aspect.slice(1)}`;
  const facing = copy[key] || aspect;
  return copy.aspectFacing.replace("{aspect}", facing);
}

/**
 * @param {{
 *   locale: import('@/lib/i18n').Locale,
 *   room: import('@/lib/rooms').RoomEntry,
 *   copy: Record<string, string>,
 *   siteName: string,
 * }} props
 */
export default function RoomDetail({ locale, room, copy, siteName }) {
  const bookHref = `/${locale}/book?villa=${room.id}`;
  const roomsHref = `/${locale}/rooms`;
  const stages = stageImagesFor(room);
  const related = relatedVillas(locale, room);
  const materials = room.materials
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);
  const rateLabel =
    room.nightlyRateCents == null
      ? copy.rateOnRequest
      : `${formatRoomMoney(room.nightlyRateCents, room.currency, locale)} / ${copy.perNight}`;

  return (
    <article className="room">
      <div className="room__split">
        <div className="room__fixed">
          <Link className="room__back link-plain" href={roomsHref}>
            <span aria-hidden="true">←</span> {copy.backToRooms}
          </Link>
          <RoomStageMedia images={stages} villaName={room.name} />
        </div>

        <div className="room__scroll">
          <header className="room__hero reveal">
            <h1 className="room__title">{room.name}</h1>
            <p className="room__line">
              {room.line} {aspectLabel(room.aspect, copy)}.
            </p>

            <div className="room__rate-block">
              <p className="room__rate">
                {room.nightlyRateCents == null ? (
                  rateLabel
                ) : (
                  <>
                    <span className="room__rate-from">{copy.fromRate}</span>{" "}
                    <strong>
                      {formatRoomMoney(
                        room.nightlyRateCents,
                        room.currency,
                        locale,
                      )}
                    </strong>{" "}
                    <span className="room__rate-unit">/ {copy.perNight}</span>
                  </>
                )}
              </p>
              {room.maxGuests == null ? null : (
                <p className="room__guests">
                  {copy.maxGuests.replace("{max}", String(room.maxGuests))}
                </p>
              )}
            </div>

            <div className="room__actions">
              <Link className="btn room__book" href={bookHref}>
                {copy.bookThis}
              </Link>
              <Link className="link-plain" href={roomsHref}>
                {copy.browseRooms}
              </Link>
            </div>
          </header>

          <section className="room__intro reveal" aria-labelledby="room-stay">
            <h2 id="room-stay" className="room__section-title">
              {copy.stayTitle}
            </h2>
            <p className="room__description">{room.description}</p>
          </section>

          <section
            className="room__materials reveal"
            aria-labelledby="room-materials"
          >
            <h2 id="room-materials" className="room__section-title">
              {copy.materialsTitle}
            </h2>
            <ul className="room__material-list">
              {materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section
            className="room__sheet reveal"
            aria-labelledby="room-amenities"
          >
            <h2 id="room-amenities" className="room__sheet-title">
              {copy.amenitiesTitle}
            </h2>
            <p className="room__sheet-note">
              {siteName} · {room.name}
            </p>
            <ul className="room__amenities">
              {room.amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="room__cove reveal" aria-labelledby="room-cove">
        <div className="room__cove-copy">
          <h2 id="room-cove" className="room__section-title">
            {copy.coveTitle}
          </h2>
          <p className="room__cove-lead">{copy.coveLead}</p>
        </div>
        <div className="room__cove-media">
          <SeaClip alt={copy.coveClipAlt} />
          <div className="room__cove-stills">
            {stages.slice(1, 4).map((image) => (
              <figure key={image.src} className="room__cove-still">
                <Image
                  src={image.src}
                  alt={image.alt || room.name}
                  fill
                  sizes="(min-width: 900px) 28vw, 80vw"
                  style={{ objectFit: "cover" }}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section
          className="room__related reveal"
          aria-labelledby="room-related"
        >
          <div className="room__related-head">
            <h2 id="room-related" className="room__section-title">
              {copy.relatedTitle}
            </h2>
            <p className="room__related-lead">{copy.relatedLead}</p>
          </div>
          <ul className="room__related-list">
            {related.map((villa) => (
              <li key={villa.id}>
                <Link
                  className="room__related-card"
                  href={`/${locale}/rooms/${villa.id}`}
                >
                  <span className="room__related-media">
                    <Image
                      src={villa.image}
                      alt=""
                      fill
                      sizes="(min-width: 900px) 30vw, 80vw"
                      style={{ objectFit: "cover" }}
                    />
                  </span>
                  <span className="room__related-body">
                    <span className="room__related-name">{villa.name}</span>
                    <span className="room__related-line">{villa.line}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="room__close reveal" aria-labelledby="room-close">
        <div className="room__close-media">
          <Image
            src={room.image}
            alt={room.alt}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="room__close-copy">
          <h2 id="room-close" className="room__close-title">
            {copy.closeTitle}
          </h2>
          <p className="room__close-body">
            {copy.closeBody.replace("{name}", room.name)}
          </p>
          <Link className="btn room__book" href={bookHref}>
            {copy.bookThis}
          </Link>
        </div>
      </section>

      <RoomBookDock
        bookHref={bookHref}
        rateLabel={rateLabel}
        bookLabel={copy.bookThis}
      />
    </article>
  );
}
