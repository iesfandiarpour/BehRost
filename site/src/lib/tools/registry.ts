export type ToolMeta = { slug: string; title: string; desc: string; icon: string; ready: boolean };

export const TOOLS: ToolMeta[] = [
  { slug: "soil-water-interpretation", title: "تفسیر آزمایش خاک و آب", icon: "🧪", ready: true,
    desc: "نتیجه‌ی آزمایش آب آبیاری و خاک را وارد کنید تا مشکلات احتمالی شوری، سدیم، بی‌کربنات و کمبود عناصر مشخص شود." },
  { slug: "nutrient-solution", title: "محاسبه‌گر محلول غذایی (EC، pH، استوک A/B)", icon: "💧", ready: true,
    desc: "حجم استوک A و B و غلظت عناصر هر مرحله‌ی رشد خیار، گوجه و فلفل را برای حجم محلول خود بسنجید." },
  { slug: "product-advisor", title: "پیشنهاد محصول بر اساس منطقه، اقلیم، خاک و آب", icon: "🗺️", ready: false, desc: "به‌زودی." },
  { slug: "vpd-acid", title: "محاسبه‌ی VPD گلخانه و اسید آبیاری", icon: "🌡️", ready: false, desc: "به‌زودی." },
  { slug: "oxide-converter", title: "تبدیل اکسید به عنصر (P₂O₅، K₂O)", icon: "🔁", ready: false, desc: "به‌زودی." },
  { slug: "deficiency", title: "تشخیص کمبود عناصر از روی علائم برگ", icon: "🍃", ready: false, desc: "به‌زودی." },
  { slug: "crop-guides", title: "راهنمای تغذیه‌ی خیار، گوجه و فلفل به تفکیک مرحله", icon: "🌱", ready: false, desc: "به‌زودی." },
];
