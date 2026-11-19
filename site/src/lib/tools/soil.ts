import { fmt, type Finding } from "./num";

/**
 * تفسیر آزمایش خاک. مراجع:
 * - شوری عصاره‌ی اشباع: USDA Handbook 60 (Richards, 1954)؛ سدیمی: ESP > ۱۵٪
 * - حد بحرانی P (اولسن) ۱۵ و K (استات آمونیوم) ۱۸۰ mg/kg: Shahbazi & Besharati (2013)؛ حد زراعی P اولسن ۲۶ mg/kg و حد زیست‌محیطی حدود ۶۳: متاآنالیز خاک‌های آهکی ایران (Environ. Monit. Assess., 2023)
 * - حد بحرانی Zn و Fe (DTPA): ۰٫۷۵ و ۴٫۵ mg/kg (Shahbazi & Besharati, 2013)؛ Mn و Cu: Lindsay & Norvell (1978)
 * این حدها عمومی‌اند و برای سبزی گلخانه‌ای ممکن است بالاتر باشند؛ توصیه‌ی نهایی با کارشناس است.
 */
export type SoilIn = {
  ec?: number; ph?: number; oc?: number; cce?: number; esp?: number;
  p?: number; k?: number; zn?: number; fe?: number; mn?: number; cu?: number;
};

export function interpretSoil(s: SoilIn): Finding[] {
  const out: Finding[] = [];
  if (s.ec !== undefined) {
    const l = s.ec < 2 ? "ok" : s.ec < 4 ? "warn" : "bad";
    const name = s.ec < 2 ? "غیرشور" : s.ec < 4 ? "کمی شور" : s.ec < 8 ? "شور" : s.ec < 16 ? "نسبتاً شدیداً شور" : "بسیار شور";
    out.push({ key: "ec", title: "شوری خاک (ECe عصاره‌ی اشباع)", value: `${fmt(s.ec)} dS/m`, level: l,
      text: `${name}. ${l === "ok" ? "اثر شوری ناچیز است." : "عملکرد گیاهان حساس مثل خیار و گوجه کاهش می‌یابد؛ آبشویی و مدیریت آبیاری لازم است."}` });
  }
  if (s.ph !== undefined) {
    const l = s.ph >= 6 && s.ph <= 7.5 ? "ok" : "warn";
    out.push({ key: "ph", title: "اسیدیته‌ی خاک (pH)", value: fmt(s.ph, 1), level: s.ph > 8.5 ? "bad" : l,
      text: s.ph < 6 ? "اسیدی؛ ممکن است آهک‌دهی لازم باشد." : s.ph <= 7.5 ? "در دامنه‌ی مناسب برای سبزی‌هاست." : s.ph <= 8.5 ? "قلیایی (حالت رایج خاک‌های آهکی ایران)؛ فراهمی Fe، Zn، Mn و P کم می‌شود." : "بسیار قلیایی؛ احتمال سدیمی‌بودن را بررسی کنید." });
  }
  if (s.cce !== undefined) {
    out.push({ key: "cce", title: "کربنات کلسیم معادل (CCE)", value: `${fmt(s.cce, 1)}٪`, level: s.cce > 5 ? "warn" : "ok",
      text: s.cce > 5 ? "آهکی؛ تثبیت فسفر و کمبود آهن و روی محتمل است." : "آهکی نیست." });
  }
  if (s.esp !== undefined) {
    out.push({ key: "esp", title: "درصد سدیم تبادلی (ESP)", value: `${fmt(s.esp, 1)}٪`, level: s.esp > 15 ? "bad" : "ok",
      text: s.esp > 15 ? "سدیمی؛ اصلاح با گچ و آبشویی لازم است." : "سدیمی نیست." });
  }
  if (s.oc !== undefined) {
    const l = s.oc < 1 ? "warn" : "ok";
    out.push({ key: "oc", title: "کربن آلی", value: `${fmt(s.oc)}٪`, level: l,
      text: s.oc < 1 ? "کم (کمتر از ۱٪ حالت رایج خاک‌های ایران است)؛ افزودن مواد آلی توصیه می‌شود." : s.oc < 2 ? "متوسط." : "مناسب." });
  }
  if (s.p !== undefined) {
    const l = s.p < 15 ? "bad" : s.p < 26 ? "warn" : s.p <= 63 ? "ok" : "warn";
    out.push({ key: "p", title: "فسفر قابل جذب (اولسن)", value: `${fmt(s.p, 1)} mg/kg`, level: l,
      text: s.p < 15 ? "کمتر از حد بحرانی (۱۵)؛ پاسخ به کود فسفره محتمل است." : s.p < 26 ? "بین حد بحرانی و حد زراعی (۲۶)؛ پاسخ به کود فسفره ممکن است." : s.p <= 63 ? "کافی." : "بسیار زیاد (بالاتر از حد زیست‌محیطی حدود ۶۳)؛ کود فسفره نیاز نیست و خطر آبشویی دارد." });
  }
  if (s.k !== undefined) {
    const l = s.k < 180 ? "bad" : s.k < 250 ? "warn" : "ok";
    out.push({ key: "k", title: "پتاسیم قابل جذب (استات آمونیوم)", value: `${fmt(s.k, 0)} mg/kg`, level: l,
      text: s.k < 180 ? "کمتر از حد بحرانی (۱۸۰)؛ پاسخ به کود پتاسه محتمل است." : s.k < 250 ? "متوسط؛ برای سبزی‌های پرمصرف مثل گوجه و فلفل پتاسیم تکمیلی مفید است." : "کافی." });
  }
  const micro: [keyof SoilIn, string, number, string][] = [
    ["zn", "روی (DTPA)", 0.75, "Zn"], ["fe", "آهن (DTPA)", 4.5, "Fe"], ["mn", "منگنز (DTPA)", 1.0, "Mn"], ["cu", "مس (DTPA)", 0.2, "Cu"],
  ];
  for (const [k, title, crit, sym] of micro) {
    const v = s[k];
    if (v === undefined) continue;
    out.push({ key: k, title, value: `${fmt(v)} mg/kg`, level: v < crit ? "bad" : "ok",
      text: v < crit ? `کمتر از حد بحرانی (${fmt(crit)}) ${sym}؛ مصرف ریزمغذی توصیه می‌شود.` : "کافی." });
  }
  return out;
}
