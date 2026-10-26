"use client";

import Image from "next/image";
import { useDictionary } from "@/components/LocaleProvider";
import { instrumentSerif } from "@/lib/fonts";

export default function About() {
  const { about } = useDictionary();

  return (
    <section
      id="about"
      className="section section--tight-top about-section"
      aria-labelledby="about-title"
    >
      <div className="frame about reveal">
        <div className="about__text">
          <h2
            id="about-title"
            className={`about__title ${instrumentSerif.className}`}
          >
            {about.title}
          </h2>
          <p className="about__lead">{about.lead}</p>
        </div>

        <div className="about__media">
          <Image
            src={about.tile.src}
            alt={about.tile.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 50vw"
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
        </div>

        <dl className="about__facts">
          {about.facts.map((fact) => (
            <div key={fact.label} className="about__fact">
              <dt>{fact.label}</dt>
              <dd className={instrumentSerif.className}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
