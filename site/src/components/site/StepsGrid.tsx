"use client";
import { useEffect, useRef, useState } from "react";
import { toFa } from "@/lib/format";

export default function StepsGrid({ steps }: { steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`steps${on ? " on" : ""}`}>
      <div className="line" />
      {steps.map((s, i) => (
        <div className="step" key={s.title}>
          <div className="num">{toFa(i + 1)}</div>
          <b>{s.title}</b>
          <p>{s.text}</p>
        </div>
      ))}
    </div>
  );
}
