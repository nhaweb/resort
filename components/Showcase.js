"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Showcase() {
  const locale = useLocale();
  const { villas, ui, rooms } = useDictionary();
  const root = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const section = root.current;
      if (!section) return;

      const track = section.querySelector(".showcase__track");
      const pin = section.querySelector(".showcase__pin");
      const cards = gsap.utils.toArray(".villa-card", section);
      const nameEl = section.querySelector(".showcase__caption-name");
      const lineEl = section.querySelector(".showcase__caption-line");
      const matEl = section.querySelector(".showcase__caption-materials");
      const linkEl = section.querySelector(".showcase__caption-link");

      let lastIndex = 0;
      /** While set, ignore scrub index changes (avoids click↔scroll fight). */
      let lockIndex = null;
      let lockTimer = 0;
      let scrollTween = null;
      let focusTween = null;

      const paint = (index) => {
        const villa = villas[index] ?? villas[0];
        if (nameEl) nameEl.textContent = villa.name;
        if (lineEl) lineEl.textContent = villa.line;
        if (matEl) matEl.textContent = villa.materials;
        if (linkEl) linkEl.setAttribute("href", `/${locale}/rooms/${villa.id}`);
        cards.forEach((card, i) => {
          const on = i === index;
          card.classList.toggle("is-active", on);
          card.setAttribute("aria-current", on ? "true" : "false");
        });
      };

      const indexFromProgress = (progress) =>
        Math.min(
          villas.length - 1,
          Math.round(progress * Math.max(villas.length - 1, 1)),
        );

      const releaseLock = () => {
        if (lockTimer) {
          window.clearTimeout(lockTimer);
          lockTimer = 0;
        }
        if (focusTween) {
          focusTween.kill();
          focusTween = null;
        }
        lockIndex = null;
      };

      /** User takes over — scroll scrub should drive focus again. */
      const onUserScrollIntent = () => {
        if (lockIndex == null) return;
        releaseLock();
      };

      const focusIndex = (index) => {
        const next = Math.max(0, Math.min(villas.length - 1, index));
        if (next === lastIndex && lockIndex == null) return;

        lastIndex = next;
        lockIndex = next;
        paint(next);

        if (reduce) {
          const card = cards[next];
          if (card) {
            const target =
              card.offsetLeft - (pin.clientWidth - card.offsetWidth) / 2;
            pin.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
          }
          releaseLock();
          return;
        }

        const st = scrollTween?.scrollTrigger;
        if (!st || villas.length <= 1) {
          releaseLock();
          return;
        }

        const progress = next / (villas.length - 1);
        const target = st.start + progress * (st.end - st.start);
        if (focusTween) focusTween.kill();
        if (lockTimer) window.clearTimeout(lockTimer);

        const finish = () => {
          lastIndex = next;
          paint(next);
          releaseLock();
        };

        // Safety: never leave scrub permanently locked if onComplete misses.
        lockTimer = window.setTimeout(finish, 900);

        const lenis = window.__resortLenis;
        if (lenis) {
          lenis.scrollTo(target, {
            duration: 0.7,
            easing: (t) => 1 - (1 - t) ** 3,
            onComplete: finish,
          });
          return;
        }

        const proxy = { y: st.scroll() };
        focusTween = gsap.to(proxy, {
          y: target,
          duration: 0.7,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: () => {
            st.scroll(proxy.y);
          },
          onComplete: finish,
        });
      };

      const onCardActivate = (event) => {
        const card = event.currentTarget;
        const index = cards.indexOf(card);
        if (index < 0) return;
        if (event.type === "keydown") {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
        }
        focusIndex(index);
      };

      cards.forEach((card) => {
        card.addEventListener("click", onCardActivate);
        card.addEventListener("keydown", onCardActivate);
      });

      const onKeyScrollIntent = (event) => {
        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "PageDown" ||
          event.key === "PageUp" ||
          event.key === "Home" ||
          event.key === "End" ||
          event.key === " "
        ) {
          onUserScrollIntent();
        }
      };

      window.addEventListener("wheel", onUserScrollIntent, { passive: true });
      window.addEventListener("touchmove", onUserScrollIntent, {
        passive: true,
      });
      window.addEventListener("keydown", onKeyScrollIntent);

      paint(0);

      if (reduce) {
        pin.style.overflowX = "auto";
        track.style.position = "relative";
        track.style.height = "100%";

        const syncFromScroll = () => {
          if (lockIndex != null) return;
          const max = Math.max(0, pin.scrollWidth - pin.clientWidth);
          if (max <= 0) return;
          const next = indexFromProgress(pin.scrollLeft / max);
          if (next !== lastIndex) {
            lastIndex = next;
            paint(next);
          }
        };
        pin.addEventListener("scroll", syncFromScroll, { passive: true });
        return () => {
          releaseLock();
          pin.removeEventListener("scroll", syncFromScroll);
          window.removeEventListener("wheel", onUserScrollIntent);
          window.removeEventListener("touchmove", onUserScrollIntent);
          window.removeEventListener("keydown", onKeyScrollIntent);
          cards.forEach((card) => {
            card.removeEventListener("click", onCardActivate);
            card.removeEventListener("keydown", onCardActivate);
          });
        };
      }

      const getScroll = () => Math.max(0, track.scrollWidth - pin.clientWidth);

      gsap.set(track, { force3D: true, x: 0 });

      scrollTween = gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${Math.min(getScroll(), window.innerHeight * 1.2)}`,
          pin: true,
          pinType: "transform",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = indexFromProgress(self.progress);
            if (lockIndex != null) {
              // Keep click target focused until animation ends or user scrolls.
              if (next === lockIndex && lastIndex !== next) {
                lastIndex = next;
                paint(next);
              }
              return;
            }
            if (next !== lastIndex) {
              lastIndex = next;
              paint(next);
            }
          },
        },
      });

      return () => {
        releaseLock();
        window.removeEventListener("wheel", onUserScrollIntent);
        window.removeEventListener("touchmove", onUserScrollIntent);
        window.removeEventListener("keydown", onKeyScrollIntent);
        cards.forEach((card) => {
          card.removeEventListener("click", onCardActivate);
          card.removeEventListener("keydown", onCardActivate);
        });
      };
    },
    { scope: root, dependencies: [villas, locale] },
  );

  return (
    <section
      id="villas"
      className="showcase section--flush"
      ref={root}
      aria-labelledby="villas-title"
    >
      <div className="frame showcase__intro">
        <h2 id="villas-title" className="showcase__title">
          {ui.showcaseTitle}
        </h2>
        <p className="showcase__intro-copy">{ui.showcaseIntro}</p>
        <Link className="link-plain showcase__browse" href={`/${locale}/rooms`}>
          {rooms.browseRooms} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="showcase__pin">
        <div className="showcase__bg" aria-hidden="true">
          <Image
            src="/images/orilla-aerial.jpg"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div className="showcase__scrim" />
        </div>
        <div className="showcase__track">
          {villas.map((villa, i) => (
            <article
              key={villa.id}
              className={`villa-card${i === 0 ? " is-active" : ""}`}
              aria-current={i === 0 ? "true" : "false"}
              aria-label={villa.name}
              role="button"
              tabIndex={0}
            >
              <Image
                src={villa.image}
                alt={villa.alt}
                fill
                sizes="420px"
                style={{ objectFit: "cover" }}
              />
            </article>
          ))}
        </div>
        <div className="showcase__caption" aria-live="polite">
          <p className="showcase__caption-name">{villas[0].name}</p>
          <p className="showcase__caption-line">{villas[0].line}</p>
          <p className="showcase__caption-materials">{villas[0].materials}</p>
          <Link
            className="showcase__caption-link"
            href={`/${locale}/rooms/${villas[0].id}`}
          >
            {rooms.viewVilla} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
