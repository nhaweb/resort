"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { INTRO_DONE_EVENT } from "@/components/PageLoader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero() {
  const locale = useLocale();
  const { hero, ui } = useDictionary();
  const root = useRef(null);
  const ctaHref = hero.ctaHref.startsWith("#")
    ? hero.ctaHref
    : `/${locale}${hero.ctaHref.startsWith("/") ? hero.ctaHref : `/${hero.ctaHref}`}`;

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const stage = root.current;
      if (!stage) return;

      if (reduce) {
        stage.classList.add("is-reduced", "is-ready");
        return;
      }

      const pin = stage.querySelector(".hero__stage");
      const mask = stage.querySelector(".hero__mask");
      const media = stage.querySelector(".hero__media");
      const uiEl = stage.querySelector(".hero__ui");
      const uiKids = uiEl ? gsap.utils.toArray(uiEl.children) : [];
      const desktop = window.matchMedia("(min-width: 900px)");

      // Transform-only expand: scale mask down, counter-scale media.
      // Avoids clip-path flicker while keeping the "window opens" effect.
      const startScale = () => (desktop.matches ? 0.36 : 0.72);

      const applyStart = () => {
        const s = startScale();
        gsap.set(mask, { scale: s, force3D: true });
        gsap.set(media, { scale: 1 / s, force3D: true });
      };

      applyStart();

      const revealUi = () => {
        stage.classList.add("is-ready");
        if (!uiKids.length) return;
        gsap.fromTo(
          uiKids,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: "auto",
          },
        );
      };

      gsap.set(uiKids, { autoAlpha: 0, y: 16 });
      const onIntroDone = () => revealUi();
      if (document.documentElement.classList.contains("intro-done")) {
        revealUi();
      } else {
        window.addEventListener(INTRO_DONE_EVENT, onIntroDone, { once: true });
      }

      const tl = gsap.timeline({
        defaults: { ease: "none", force3D: true },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=90%",
          pin: true,
          pinType: "transform",
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: applyStart,
        },
      });

      tl.to(mask, { scale: 1, duration: 1 }, 0)
        .to(media, { scale: 1, duration: 1 }, 0)
        .to(
          uiEl,
          {
            autoAlpha: 0,
            y: -24,
            duration: 0.45,
          },
          0.35,
        );

      return () => {
        if (onIntroDone) {
          window.removeEventListener(INTRO_DONE_EVENT, onIntroDone);
        }
      };
    },
    { scope: root },
  );

  return (
    <section id="top" className="hero" ref={root} aria-label={hero.title}>
      <div className="hero__stage">
        <div className="hero__mask">
          <div className="hero__media">
            <Image
              src="/images/orilla-hero.jpg"
              alt={ui.heroAlt}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="hero__ui">
          <div className="hero__lead">
            <h1 className="hero__title">{hero.title}</h1>
            <p className="hero__under">{hero.under}</p>
          </div>
          <div className="hero__side">
            <p className="hero__support">{hero.support}</p>
            <Link className="btn hero__cta" href={ctaHref}>
              {hero.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
