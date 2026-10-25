"use client";

import Image from "next/image";
import { useDictionary } from "@/components/LocaleProvider";

export default function About() {
  const { about } = useDictionary();

  return (
    <section className="section" aria-labelledby="about-title">
      <div className="frame about">
        <div className="about__copy reveal">
          <h2 id="about-title" className="about__title">
            {about.title}
          </h2>
          <p className="about__lead">{about.lead}</p>
        </div>
        <div className="about__media reveal">
          <Image
            src={about.image.src}
            alt={about.image.alt}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="reveal">
          <div className="about__tile">
            <Image
              src={about.tile.src}
              alt={about.tile.alt}
              width={900}
              height={600}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <dl className="about__facts">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
