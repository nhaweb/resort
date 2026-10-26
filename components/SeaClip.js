"use client";

import { useEffect, useRef, useState } from "react";

export default function SeaClip({ alt = "Ocean waves on a coastal beach" }) {
  const ref = useRef(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduce(mq.matches);
      const el = ref.current;
      if (!el) return;
      if (mq.matches) {
        el.pause();
      } else {
        el.play().catch(() => {});
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="sea-clip">
      {reduce ? (
        // biome-ignore lint/performance/noImgElement: poster fallback for reduced motion
        <img src="/video/waves-poster.jpg" alt={alt} width={854} height={480} />
      ) : (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/waves-poster.jpg"
          width={854}
          height={480}
          tabIndex={-1}
        >
          <source src="/video/waves.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}
