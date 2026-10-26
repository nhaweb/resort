"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * Sticky stage photograph with slow crossfade (signature move).
 * Tap / click advances; reduced motion holds the first frame.
 * @param {{
 *   images: { src: string, alt: string }[],
 *   villaName: string,
 * }} props
 */
export default function RoomStageMedia({ images, villaName }) {
  const slides = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce || slides.length < 2) return;
    const first = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 1400);
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5600);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [reduce, slides.length]);

  const advance = useCallback(() => {
    if (slides.length < 2) return;
    setIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <button
      type="button"
      className="room__stage"
      onClick={advance}
      aria-label={
        slides.length > 1
          ? `${villaName} — view ${index + 1} of ${slides.length}. Activate for next view.`
          : villaName
      }
    >
      {slides.map((image, i) => (
        <div
          key={image.src}
          className={
            i === index ? "room__stage-frame is-active" : "room__stage-frame"
          }
          aria-hidden={i === index ? undefined : true}
        >
          <Image
            src={image.src}
            alt={image.alt || villaName}
            fill
            priority={i === 0}
            sizes="(min-width: 900px) 50vw, 100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
    </button>
  );
}
