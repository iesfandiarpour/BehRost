import { fmt, type Finding } from "./num";

/**
 * تفسیر کیفیت آب آبیاری بر اساس راهنمای FAO Irrigation & Drainage Paper 29 Rev.1
 * (Ayers & Westcot, 1985). غلظت یون‌ها بر حسب meq/L، بور و نیترات‌نیتروژن بر حسب mg/L، EC بر حسب dS/m.
 */
export type WaterIn = {
  ec?: number; ph?: number; na?: number; ca?: number; mg?: number; cl?: number; hco3?: number; b?: number; no3n?: number;
};
/** وزن هم‌ارز (g/eq) برای تبدیل mg/L به meq/L */
export const EQW = { na: 22.99, ca: 20.04, mg: 12.15, cl: 35.45, hco3: 61.02 } as const;

// جدول نفوذپذیری FAO: برای هر دامنه‌ی SAR، حدی از EC که بالاتر از آن مشکلی نیست (hi) و پایین‌تر از آن مشکل شدید است (lo)
const INFILTRATION: [number, number, number][] = [
  [3, 0.7, 0.2], [6, 1.2, 0.4], [12, 1.9, 0.5], [20, 2.9, 1.3], [40, 5.0, 2.9],
];

export const sar = (w: WaterIn) =>
  w.na !== undefined && w.ca !== undefined && w.mg !== undefined && w.ca + w.mg > 0
    ? w.na / Math.sqrt((w.ca + w.mg) / 2)
    : undefined;

export function interpretWater(w: WaterIn): Finding[] {
  const out: Finding[] = [];
  const S = sar(w);

  if (w.ec !== undefined) {
    const l = w.ec < 0.7 ? "ok" : w.ec <= 3 ? "warn" : "bad";
    out.push({ key: "ec", title: "شوری آب (EC)", value: `${fmt(w.ec)} dS/m`, level: l,
      text: l === "ok" ? "بدون محدودیت از نظر شوری." : l === "warn" ? "محدودیت کم تا متوسط؛ برای گیاهان حساس مثل خیار و گوجه نیاز به مدیریت آبشویی و تغذیه دارد." : "محدودیت شدید؛ فقط برای گیاهان بسیار مقاوم و با آبشویی مناسب." });
  }
  if (w.ph !== undefined) {
    const ok = w.ph >= 6.5 && w.ph <= 8.4;
    out.push({ key: "ph", title: "اسیدیته‌ی آب (pH)", value: fmt(w.ph, 1), level: ok ? "ok" : "warn",
      text: ok ? "در دامنه‌ی عادی (۶٫۵ تا ۸٫۴) است." : "خارج از دامنه‌ی عادی است؛ علت (بی‌کربنات، آلودگی یا اسید) بررسی شود." });
  }
  if (S !== undefined) {
    out.push({ key: "sar", title: "نسبت جذب سدیم (SAR)", value: fmt(S), level: "info", text: "از روی Na، Ca و Mg حساب شد (SAR استاندارد، بدون تعدیل بی‌کربنات)." });
    if (w.ec !== undefined) {
      const row = INFILTRATION.find(([max]) => S <= max);
      if (!row) {
        out.push({ key: "inf", title: "خطر کاهش نفوذپذیری خاک", value: "SAR > ۴۰", level: "bad", text: "خارج از دامنه‌ی جدول FAO؛ خطر شدید." });
      } else {
        const [, hi, lo] = row;
        const l = w.ec >= hi ? "ok" : w.ec < lo ? "bad" : "warn";
        out.push({ key: "inf", title: "خطر کاهش نفوذپذیری خاک (SAR و EC)", value: `EC ${fmt(w.ec)} در برابر حد ${fmt(hi, 1)}`, level: l,
          text: l === "ok" ? "خطر کاهش نفوذپذیری ندارد." : l === "warn" ? "خطر کم تا متوسط؛ افزودن گچ یا اسیدی‌کردن آب و مدیریت آبیاری را بررسی کنید." : "خطر شدید کاهش نفوذپذیری؛ اصلاح آب یا خاک (گچ) لازم است." });
      }
    }
    const l = S < 3 ? "ok" : S <= 9 ? "warn" : "bad";
    out.push({ key: "na", title: "سمیت سدیم (آبیاری سطحی، گیاهان حساس)", value: `SAR ${fmt(S)}`, level: l,
      text: l === "ok" ? "بدون محدودیت." : l === "warn" ? "محدودیت کم تا متوسط برای گیاهان حساس." : "محدودیت شدید." });
  }
  if (w.cl !== undefined) {
    const l = w.cl < 4 ? "ok" : w.cl <= 10 ? "warn" : "bad";
    out.push({ key: "cl", title: "کلر", value: `${fmt(w.cl)} meq/L`, level: l,
      text: l === "ok" ? "بدون محدودیت (آبیاری سطحی)." : l === "warn" ? "محدودیت کم تا متوسط؛ در آبیاری بارانی حد پایین‌تر (۳ meq/L) است." : "محدودیت شدید برای گیاهان حساس." });
  }
  if (w.hco3 !== undefined) {
    const l = w.hco3 < 1.5 ? "ok" : w.hco3 <= 8.5 ? "warn" : "bad";
    out.push({ key: "hco3", title: "بی‌کربنات", value: `${fmt(w.hco3)} meq/L`, level: l,
      text: l === "ok" ? "بدون محدودیت." : "در کودآبیاری pH محلول را بالا می‌برد و باعث رسوب و گرفتگی قطره‌چکان‌ها می‌شود؛ اسیدی‌کردن آب پیشنهاد می‌شود (ابزار محاسبه‌ی اسید آبیاری به‌زودی اضافه می‌شود)." });
  }
  if (w.b !== undefined) {
    const l = w.b < 0.7 ? "ok" : w.b <= 3 ? "warn" : "bad";
    out.push({ key: "b", title: "بور", value: `${fmt(w.b)} mg/L`, level: l,
      text: l === "ok" ? "بدون محدودیت." : l === "warn" ? "محدودیت کم تا متوسط؛ در گیاهان حساس سمیت بور ممکن است؛ در برنامه‌ی تغذیه بور اضافه نشود." : "محدودیت شدید." });
  }
  if (w.no3n !== undefined) {
    const l = w.no3n < 5 ? "ok" : w.no3n <= 30 ? "warn" : "bad";
    out.push({ key: "no3", title: "نیترات (NO₃-N)", value: `${fmt(w.no3n)} mg/L`, level: l,
      text: l === "ok" ? "بدون محدودیت." : "نیتروژن آب در برنامه‌ی کوددهی باید از نیاز گیاه کم شود." });
  }
  return out;
}
