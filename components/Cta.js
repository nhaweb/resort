"use client";

import Image from "next/image";
import Link from "next/link";
import { useDictionary, useLocale } from "@/components/LocaleProvider";

export default function Cta() {
  const locale = useLocale();
  const { cta } = useDictionary();
  const href = cta.href.startsWith("mailto:")
    ? cta.href
    : `/${locale}${cta.href.startsWith("/") ? cta.href : `/${cta.href}`}`;

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
        <Link className="btn btn--paper" href={href}>
          {cta.button}
        </Link>
      </div>
    </section>
  );
}
