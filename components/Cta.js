"use client";

import Image from "next/image";
import { useDictionary } from "@/components/LocaleProvider";

export default function Cta() {
  const { cta } = useDictionary();

  return (
    <section className="cta section--flush" aria-labelledby="cta-title">
      <div className="cta__media">
        <Image
          src={cta.image.src}
          alt={cta.image.alt}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="cta__copy reveal">
        <h2 id="cta-title" className="cta__title">
          {cta.title}
        </h2>
        <p className="cta__body">{cta.body}</p>
        <a className="btn btn--paper" href={cta.href}>
          {cta.button}
        </a>
      </div>
    </section>
  );
}
