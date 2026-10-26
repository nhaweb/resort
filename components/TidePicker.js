"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";

export default function TidePicker() {
  const locale = useLocale();
  const { tides, ui, villas } = useDictionary();
  const [active, setActive] = useState(tides[0].id);
  const labelId = useId();
  const current = tides.find((t) => t.id === active) ?? tides[0];

  useEffect(() => {
    setActive(tides[0].id);
  }, [tides]);

  return (
    <section id="tide" className="section tide" aria-labelledby="tide-title">
      <div className="frame">
        <h2 id="tide-title" className="tide__title reveal">
          {ui.tideTitle}
        </h2>
        <p className="tide__lead reveal">{ui.tideLead}</p>

        <fieldset className="tide__controls reveal">
          <legend id={labelId} className="sr-only">
            {ui.tideLegend}
          </legend>
          {tides.map((tide) => (
            <button
              key={tide.id}
              type="button"
              className="tide__btn"
              aria-pressed={active === tide.id}
              onClick={() => setActive(tide.id)}
            >
              {tide.label}
            </button>
          ))}
        </fieldset>

        <div className="tide__panel reveal" aria-live="polite">
          <div className="tide__media">
            <Image
              key={current.image}
              src={current.image}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="tide__info">
            <p className="tide__hours">{current.hours}</p>
            <h3>{current.label}</h3>
            <p>{current.path}</p>
            <p>{current.light}</p>
            <div className="tide__tags">
              {current.recommend.map((name) => {
                const villa = villas.find((item) => item.name === name);
                if (!villa) {
                  return (
                    <span key={name} className="tide__tag">
                      {name}
                    </span>
                  );
                }
                return (
                  <Link
                    key={villa.id}
                    className="tide__tag"
                    href={`/${locale}/rooms/${villa.id}`}
                  >
                    {villa.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
