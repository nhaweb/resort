"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instrument_Serif } from "next/font/google";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useDictionary } from "@/components/LocaleProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

function getFocusable(root) {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => {
    if (
      el.hasAttribute("disabled") ||
      el.getAttribute("aria-hidden") === "true" ||
      el.getAttribute("tabindex") === "-1"
    ) {
      return false;
    }
    const style = window.getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none";
  });
}

export default function Gallery() {
  const { gallery, ui } = useDictionary();
  const root = useRef(null);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocusRef = useRef(null);
  const titleId = useId();
  const dialogTitleId = useId();
  const [activeIndex, setActiveIndex] = useState(null);

  const images = gallery.images;
  const isOpen = activeIndex !== null;
  const active = isOpen ? images[activeIndex] : null;

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;

      const items = gsap.utils.toArray(".gallery__rise");
      if (!items.length) return;

      gsap.set(items, { autoAlpha: 0, y: 22 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "power2.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: root.current,
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: root },
  );

  function close() {
    setActiveIndex(null);
  }

  function openAt(index) {
    lastFocusRef.current = document.activeElement;
    setActiveIndex(index);
  }

  function showPrev() {
    setActiveIndex((i) =>
      i === null ? i : (i + images.length - 1) % images.length,
    );
  }

  function showNext() {
    setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    const previouslyFocused = lastFocusRef.current;
    const count = gallery.images.length;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(null);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((i) => (i === null ? i : (i + count - 1) % count));
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((i) => (i === null ? i : (i + 1) % count));
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const focusable = getFocusable(dialog);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, gallery.images.length]);

  return (
    <section
      id="gallery"
      className="section gallery"
      ref={root}
      aria-labelledby={titleId}
    >
      <div className="frame">
        <header className="gallery__header gallery__rise">
          <p className="gallery__eyebrow">{gallery.eyebrow}</p>
          <h2 id={titleId} className={`gallery__title ${serif.className}`}>
            {gallery.title}
          </h2>
          <p className="gallery__desc">{gallery.description}</p>
        </header>

        <ul className="gallery__grid">
          {images.map((image, index) => (
            <li
              key={image.id}
              className={`gallery__cell gallery__rise gallery__cell--c${image.span.cols} gallery__cell--r${image.span.rows} gallery__cell--${image.aspect}`}
            >
              <button
                type="button"
                className="gallery__item"
                onClick={() => openAt(index)}
                aria-label={ui.galleryOpen
                  .replace("{id}", image.id)
                  .replace("{caption}", image.caption)}
              >
                <span className="gallery__media" aria-hidden="true">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                    style={{ objectFit: "cover" }}
                  />
                </span>
                <span className="gallery__caption">
                  <span className="gallery__caption-num">{image.id}</span>
                  <span className="gallery__caption-sep" aria-hidden="true">
                    {" "}
                    —{" "}
                  </span>
                  <span className="gallery__caption-text">{image.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && active ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          ref={dialogRef}
          data-lenis-prevent
        >
          <button
            type="button"
            className="gallery-lightbox__backdrop"
            aria-label={ui.galleryClose}
            onClick={close}
            tabIndex={-1}
          />
          <div className="gallery-lightbox__panel">
            <div className="gallery-lightbox__toolbar">
              <p id={dialogTitleId} className="gallery-lightbox__label">
                <span className="gallery__caption-num">{active.id}</span>
                <span aria-hidden="true"> — </span>
                {active.caption}
              </p>
              <button
                type="button"
                className="gallery-lightbox__close"
                onClick={close}
                ref={closeBtnRef}
              >
                {ui.close}
              </button>
            </div>
            <div className="gallery-lightbox__stage">
              <Image
                src={active.src}
                alt={active.alt}
                width={1600}
                height={1066}
                sizes="100vw"
                className="gallery-lightbox__img"
                priority
              />
            </div>
            <div className="gallery-lightbox__nav">
              <button
                type="button"
                className="gallery-lightbox__btn"
                onClick={showPrev}
              >
                {ui.previous}
              </button>
              <p className="gallery-lightbox__count" aria-live="polite">
                {activeIndex + 1} / {images.length}
              </p>
              <button
                type="button"
                className="gallery-lightbox__btn"
                onClick={showNext}
              >
                {ui.next}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
