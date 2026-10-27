"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { useDictionary } from "@/components/LocaleProvider";

gsap.registerPlugin(useGSAP);

export const INTRO_DONE_EVENT = "orilla:intro-done";

function markIntroDone() {
  document.documentElement.classList.remove("is-intro");
  document.documentElement.classList.add("intro-done");
  const page = document.querySelector(".page");
  if (page) page.inert = false;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Short branded cover for the landing page. Hides hero setup flash,
 * waits for the hero image + fonts, then fades away.
 * Plays on every landing visit (reduced motion excepted).
 */
export default function PageLoader() {
  const { site, ui } = useDictionary();
  const root = useRef(null);
  const [active, setActive] = useState(true);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // Hydration owns the exit timeline — disable the CSS no-JS fallback.
      el.style.animation = "none";

      document.documentElement.classList.remove("intro-done", "intro-seen");

      if (prefersReducedMotion()) {
        markIntroDone();
        setActive(false);
        return;
      }

      document.documentElement.classList.add("is-intro");
      const page = document.querySelector(".page");
      if (page) page.inert = true;

      const brand = el.querySelector(".page-loader__brand");
      const line = el.querySelector(".page-loader__line");
      const place = el.querySelector(".page-loader__place");
      const heroImg = document.querySelector(".hero__media img");

      gsap.set([brand, place], { autoAlpha: 0, y: 8 });
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .to(brand, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .to(place, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.08);

      let cancelled = false;
      const startedAt = performance.now();
      const MIN_MS = 600;
      const CAP_MS = 2000;
      /** @type {ReturnType<typeof setTimeout>[]} */
      const timers = [];

      const waitAssets = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        heroImg?.decode?.().catch(() => undefined) ??
          (heroImg?.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                if (!heroImg) {
                  resolve();
                  return;
                }
                heroImg.addEventListener("load", () => resolve(), {
                  once: true,
                });
                heroImg.addEventListener("error", () => resolve(), {
                  once: true,
                });
              })),
        new Promise((resolve) => {
          timers.push(window.setTimeout(resolve, MIN_MS));
        }),
      ]);

      const capped = Promise.race([
        waitAssets.then(() => "ready"),
        new Promise((resolve) => {
          timers.push(window.setTimeout(() => resolve("cap"), CAP_MS));
        }),
      ]);

      const progressTween = gsap.to(line, {
        scaleX: 0.72,
        duration: 1.1,
        ease: "power1.out",
      });

      capped.then(() => {
        if (cancelled) return;

        const elapsed = performance.now() - startedAt;
        const remain = Math.max(0, MIN_MS - elapsed);

        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            progressTween.kill();

            gsap
              .timeline({
                defaults: { ease: "power2.out" },
                onComplete: () => {
                  if (cancelled) return;
                  markIntroDone();
                  setActive(false);
                },
              })
              .to(line, { scaleX: 1, duration: 0.25, ease: "power2.out" }, 0)
              .to(
                [brand, place],
                {
                  autoAlpha: 0,
                  y: -12,
                  duration: 0.35,
                  stagger: 0.04,
                  ease: "power2.in",
                },
                0.15,
              )
              .to(
                el,
                { autoAlpha: 0, duration: 0.45, ease: "power1.out" },
                0.35,
              );
          }, remain),
        );
      });

      return () => {
        cancelled = true;
        for (const id of timers) window.clearTimeout(id);
        progressTween.kill();
        document.documentElement.classList.remove("is-intro");
        if (page) page.inert = false;
      };
    },
    { scope: root },
  );

  if (!active) return null;

  return (
    <output ref={root} className="page-loader" aria-live="polite">
      <div className="page-loader__inner">
        <p className="page-loader__brand" aria-hidden="true">
          {site.name}
        </p>
        <span className="page-loader__line" aria-hidden="true" />
        <p className="page-loader__place" aria-hidden="true">
          {ui.loadingPlace}
        </p>
      </div>
      <span className="sr-only">{ui.loadingPml}</span>
    </output>
  );
}
