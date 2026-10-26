import Image from "next/image";
import Link from "next/link";
import { formatRoomMoney } from "@/lib/rooms";

/**
 * @param {{
 *   locale: import('@/lib/i18n').Locale,
 *   rooms: import('@/lib/rooms').RoomEntry[],
 *   copy: Record<string, string>
 * }} props
 */
export default function RoomList({ locale, rooms, copy }) {
  return (
    <ol className="rooms__list">
      {rooms.map((room, index) => {
        const detailHref = `/${locale}/rooms/${room.id}`;
        const bookHref = `/${locale}/book?villa=${room.id}`;
        return (
          <li key={room.id} className="room-row">
            <Link
              className="room-row__media"
              href={detailHref}
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={room.image}
                alt=""
                fill
                priority={index < 2}
                sizes="(min-width: 900px) 58vw, 100vw"
                style={{ objectFit: "cover" }}
              />
            </Link>
            <div className="room-row__body">
              <p className="room-row__index">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="room-row__name">
                <Link href={detailHref}>{room.name}</Link>
              </h2>
              <p className="room-row__line">{room.line}</p>
              <p className="room-row__amenities">
                {room.amenities.slice(0, 4).join(" · ")}
              </p>
              <p className="room-row__rate">
                {room.nightlyRateCents == null ? (
                  copy.rateOnRequest
                ) : (
                  <>
                    {copy.fromRate}{" "}
                    <strong>
                      {formatRoomMoney(
                        room.nightlyRateCents,
                        room.currency,
                        locale,
                      )}
                    </strong>{" "}
                    / {copy.perNight}
                  </>
                )}
              </p>
              <div className="room-row__actions">
                <Link className="btn" href={bookHref}>
                  {copy.bookThis}
                </Link>
                <Link className="link-plain" href={detailHref}>
                  {copy.viewVilla}
                  <span className="sr-only"> — {room.name}</span>
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
