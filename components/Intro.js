"use client";

import Image from "next/image";
import { useDictionary } from "@/components/LocaleProvider";
import SeaClip from "@/components/SeaClip";

export default function Intro() {
  const { intro, ui } = useDictionary();

  return (
    <section className="section" aria-labelledby="intro-title">
      <div className="frame intro">
        <div className="intro__copy reveal">
          <h2 id="intro-title" className="intro__title">
            {intro.title}
          </h2>
          <p className="intro__body">{intro.body}</p>
        </div>
        <div className="intro__media reveal">
          <Image
            src={intro.image.src}
            alt={intro.image.alt}
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <div className="frame intro__clip reveal">
        <SeaClip alt={ui.seaClipAlt} />
        <p className="intro__clip-caption">{ui.introClipCaption}</p>
      </div>
    </section>
  );
}
