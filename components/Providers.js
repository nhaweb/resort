"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { INTRO_DONE_EVENT } from "@/components/PageLoader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function isAlreadyOnScreen(el) {
  const rect = el.getBoundingClientRect();
  // Treat anything intersecting the first screen (with a little slack) as already visible
  return rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
}

function introPending() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  return Boolean(document.querySelector(".page-loader"));
}

export default function Providers({ children }) {
  const root = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return undefined;

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.1,
      syncTouch: false,
      anchors: true,
      autoRaf: false,
      stopInertiaOnNavigate: true,
    });

    window.__resortLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis", "lenis-smooth");

    const onIntroDone = () => {
      lenis.start();
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener(INTRO_DONE_EVENT, onIntroDone);

    // Stop scroll only while the landing intro is still covering the page.
    // If the intro already finished (fast cache / skipped), keep Lenis running.
    if (introPending()) {
      lenis.stop();
    }

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", refresh);
    const settle = window.setTimeout(refresh, 250);

    return () => {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
      window.removeEventListener(INTRO_DONE_EVENT, onIntroDone);
      gsap.ticker.remove(ticker);
      if (window.__resortLenis === lenis) window.__resortLenis = undefined;
      lenis.destroy();
    };
  }, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;

      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      });

      const items = gsap.utils.toArray(".reveal");
      for (const el of items) {
        const parts = el.querySelectorAll(
          "h2, h3, p, dl, .btn, figure, li, details, .sea-clip",
        );
        const targets = parts.length ? parts : [el];

        // Already on the first screen: leave fully visible, never hide then re-show
        if (isAlreadyOnScreen(el)) {
          gsap.set(targets, { clearProps: "opacity,visibility,transform" });
          continue;
        }

        // Below the fold: hide now, then play once when scrolled into view
        gsap.from(targets, {
          autoAlpha: 0,
          y: 18,
          duration: 0.7,
          stagger: 0.05,
          ease: "power2.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      }

      const driftMedia = document.querySelector(".intro__media");
      const drift = driftMedia?.querySelector("img");
      if (drift && driftMedia && !isAlreadyOnScreen(driftMedia)) {
        gsap.fromTo(
          drift,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: driftMedia,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <div ref={root} className="page">
      {children}
    </div>
  );
}
