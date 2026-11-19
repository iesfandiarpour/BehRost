import { toFa } from "@/lib/format";

const FAD = "۰۱۲۳۴۵۶۷۸۹";
const ARD = "٠١٢٣٤٥٦٧٨٩";

/** ورودی کاربر (حتی با ارقام فارسی و ممیز «٫») را به عدد تبدیل می‌کند */
export function parseNum(s: string): number | undefined {
  const t = s
    .trim()
    .replace(/[۰-۹]/g, (d) => String(FAD.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARD.indexOf(d)))
    .replace(/[٫,،]/g, ".")
    .replace(/\s/g, "");
  if (t === "") return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}
export const fmt = (n: number, d = 2) => toFa(Number(n.toFixed(d)).toString()).replace(".", "٫");

export type Level = "ok" | "warn" | "bad" | "info";
export type Finding = { key: string; title: string; value: string; level: Level; text: string };
