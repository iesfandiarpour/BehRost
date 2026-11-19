"use client";
import Link from "next/link";
import type { Finding } from "@/lib/tools/num";

export function NumField({ label, unit, value, onChange }: { label: string; unit?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="fld">
      <span>{label}{unit && <em>{unit}</em>}</span>
      <input inputMode="decimal" dir="ltr" value={value} onChange={(e) => onChange(e.target.value)} placeholder="—" />
    </label>
  );
}

const DOT = { ok: "✓", warn: "!", bad: "✕", info: "i" } as const;

export function Results({ items }: { items: Finding[] }) {
  if (items.length === 0) return <p className="empty">مقدارها را وارد کنید تا نتیجه این‌جا نمایش داده شود.</p>;
  return (
    <ul className="res">
      {items.map((f) => (
        <li key={f.key} className={`lv-${f.level}`}>
          <span className="dot">{DOT[f.level]}</span>
          <div>
            <b>{f.title}</b>
            <span className="val" dir="auto">{f.value}</span>
            <p>{f.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ConsultCta() {
  return (
    <div className="ctabox">
      <p>برای برنامه‌ی کوددهی اختصاصی، نتیجه را برای کارشناسان پیوند گستر پارسان بفرستید.</p>
      <Link className="btn p" href="/consult">دریافت مشاوره</Link>
    </div>
  );
}
