"use client";

import Image from "next/image";
import { useDictionary } from "@/components/LocaleProvider";

export default function Faq() {
  const { cta, faq } = useDictionary();

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="frame faq">
        <div className="reveal">
          <h2 id="faq-title" className="faq__title">
            {faq.title}
          </h2>
          <ul className="faq__facts">
            {faq.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <div>
            {faq.items.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span className="faq__chev" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <p style={{ marginTop: "2rem" }}>
            <a className="btn" href={cta.href}>
              {cta.button}
            </a>
          </p>
        </div>
        <div className="faq__photos reveal" aria-hidden="false">
          <div className="faq__tall">
            <Image
              src={faq.imageTall.src}
              alt={faq.imageTall.alt}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="faq__square">
            <Image
              src={faq.imageSquare.src}
              alt={faq.imageSquare.alt}
              fill
              sizes="200px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
