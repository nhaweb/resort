"use client";

import { useDictionary } from "@/components/LocaleProvider";

export default function Rhythm() {
  const { rhythm } = useDictionary();

  return (
    <section className="section rhythm" aria-labelledby="rhythm-title">
      <div className="frame rhythm__inner">
        <div className="rhythm__sticky reveal">
          <h2 id="rhythm-title" className="rhythm__title">
            {rhythm.title}
          </h2>
          <p className="rhythm__lead">{rhythm.lead}</p>
        </div>
        <ol className="rhythm__steps">
          {rhythm.steps.map((step) => (
            <li key={step.verb} className="reveal">
              <h3 className="rhythm__verb">{step.verb}</h3>
              <p className="rhythm__text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
