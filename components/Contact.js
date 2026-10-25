"use client";

import Image from "next/image";
import { useDictionary } from "@/components/LocaleProvider";

export default function Contact() {
  const { contact, cta, site, hero } = useDictionary();

  return (
    <section
      id="stay"
      className="contact section--flush"
      aria-labelledby="contact-title"
    >
      <div className="contact__media">
        <Image
          src={contact.image.src}
          alt={contact.image.alt}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="contact__card reveal">
        <h2 id="contact-title">{contact.title}</h2>
        {site.address.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p>
          <a className="link-plain" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
        <p>{site.phone}</p>
        <div className="contact__hours">
          {site.hours.map((row) => (
            <div key={row.days}>
              <span>{row.days}</span>
              <span>{row.time}</span>
            </div>
          ))}
        </div>
        <p>{site.boat}</p>
        <a className="btn" href={cta.href}>
          {hero.cta}
        </a>
      </div>
    </section>
  );
}
