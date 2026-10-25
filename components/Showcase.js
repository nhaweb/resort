"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { useDictionary } from "@/components/LocaleProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Showcase() {
  const { villas, ui } = useDictionary();
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
      const nameEl = section.querySelector(".showcase__caption-name");
      const lineEl = section.querySelector(".showcase__caption-line");
      const matEl = section.querySelector(".showcase__caption-materials");

      const paint = (index) => {
        const villa = villas[index] ?? villas[0];
        if (nameEl) nameEl.textContent = villa.name;
        if (lineEl) lineEl.textContent = villa.line;
        if (matEl) matEl.textContent = villa.materials;
      };

      paint(0);

      if (reduce) {
        pin.style.overflowX = "auto";
        track.style.position = "relative";
        track.style.height = "100%";
        return;
      }

      const getScroll = () => Math.max(0, track.scrollWidth - pin.clientWidth);

      let lastIndex = 0;
      gsap.set(track, { force3D: true, x: 0 });

      gsap.to(track, {
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
            const next = Math.min(
              villas.length - 1,
              Math.round(self.progress * (villas.length - 1)),
            );
            if (next !== lastIndex) {
              lastIndex = next;
              paint(next);
            }
          },
        },
      });
    },
    { scope: root, dependencies: [villas] },
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
          {villas.map((villa) => (
            <article key={villa.id} className="villa-card">
              <Image
                src={villa.image}
                alt={villa.alt}
                fill
                sizes="400px"
                style={{ objectFit: "cover" }}
              />
            </article>
          ))}
        </div>
        <div className="showcase__caption" aria-live="polite">
          <p className="showcase__caption-name">{villas[0].name}</p>
          <p className="showcase__caption-line">{villas[0].line}</p>
          <p className="showcase__caption-materials">{villas[0].materials}</p>
        </div>
      </div>
    </section>
  );
}
