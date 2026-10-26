"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Mobile book bar — only after the in-page book CTA leaves the viewport,
 * so it never covers the first-screen title or mid-page headings.
 * @param {{
 *   bookHref: string,
 *   rateLabel: string,
 *   bookLabel: string,
 *   watchSelector?: string,
 * }} props
 */
export default function RoomBookDock({
  bookHref,
  rateLabel,
  bookLabel,
  watchSelector = ".room__actions .room__book",
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.querySelector(watchSelector);
    if (!target || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "-8px 0px 0px 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [watchSelector]);

  if (!visible) return null;

  return (
    <section className="room__dock" aria-label={bookLabel}>
      <p className="room__dock-rate">{rateLabel}</p>
      <Link className="btn room__book" href={bookHref}>
        {bookLabel}
      </Link>
    </section>
  );
}
