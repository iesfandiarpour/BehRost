/**
 * پر کردن دیتابیس با محتوای بریف.
 * قیمت‌ها نمونه‌ی تقریبی‌اند (priceIsSample = true) و باید از پنل مدیریت با قیمت واقعی عوض شوند.
 */
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import {
  adminUsers,
  cropGuides,
  pageSeo,
  products,
  sections,
  siteSettings,
} from "../src/db/schema";

try {
  process.loadEnvFile(".env.local");
} catch {
  /* فایل env نبود؛ از متغیرهای محیط استفاده می‌شود */
}

async function setting(key: string, value: unknown) {
  await db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
}

async function main() {
  // ---------- ادمین ----------
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!password) throw new Error("INITIAL_ADMIN_PASSWORD در .env.local تنظیم نشده");
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
  if (existing.length === 0) {
    await db.insert(adminUsers).values({ username, passwordHash: await bcrypt.hash(password, 12) });
  }

  // ---------- تنظیمات کلی ----------
  await setting("brand", {
    name: "بهرست",
    nameEn: "BehRost",
    tagline: "مشاوره و تغذیه‌ی تخصصی گیاه",
    company: "پیوند گستر پارسان",
    companyEn: "Peyvand Gostar Parsan",
    supervision: "زیر نظر کارشناسان و متخصصان شرکت پیوند گستر پارسان",
    logo: "/behrost-logo.jpg",
    companyLogo: "/pgp-logo.jpg",
  });
  await setting("contact", {
    mobiles: ["09133839548", "09131937313", "09177909896"],
    landlines: ["03431312012", "03431312013", "03431312019"],
    address: "رفسنجان، بلوار ولایت، دانشگاه ولی‌عصر، مرکز رشد واحدهای فناور",
    hours: "",
    email: "peyvandgostar.parsan@gmail.com",
  });
  await setting("social", {
    instagram: "peyvand.gostar",
    website: "www.peyvandgostar.com",
  });
  await setting("footer", {
    about:
      "بهرست مشاوره‌ی تخصصی تغذیه‌ی گیاه برای گلخانه، باغ و مزرعه است و محصولات خود را زیر نظر شرکت پیوند گستر پارسان عرضه می‌کند.",
  });
  await setting("theme", {
    primary: "#1B9A4B",
    secondary: "#8DC63F",
    earth: "#6B3410",
    navy: "#0F2A4A",
    background: "#F7F5EF",
  });

  // ---------- صفحه‌ی اول ----------
  await db.delete(sections);
  await db.insert(sections).values([
    {
      page: "home",
      type: "hero",
      order: 1,
      data: {
        eyebrow: "بهرست | مشاوره‌ی تخصصی تغذیه‌ی گیاه",
        titleLine1: "کوددهی علمی،",
        titleLine2: "متناسب با خاک و آب شما",
        text: "برای گلخانه، باغ و مزرعه؛ از تفسیر آزمایش خاک و آب تا برنامه‌ی تغذیه‌ی هر مرحله از رشد، زیر نظر کارشناسان پیوند گستر پارسان.",
        primaryButton: { label: "ابزارهای رایگان", href: "/tools" },
        secondaryButton: { label: "دریافت مشاوره", href: "/consult" },
      },
    },
    {
      page: "home",
      type: "steps",
      order: 2,
      data: {
        title: "چهار مرحله تا برنامه‌ی کوددهی شما",
        subtitle: "از ثبت اطلاعات تا دریافت برنامه‌ی اختصاصی",
        steps: [
          { title: "ثبت اطلاعات", text: "محصول، منطقه، نوع خاک و نتایج آزمایش آب و خاک را ثبت می‌کنید." },
          { title: "تحلیل داده‌ها", text: "داده‌ها با ابزارهای بهرست تحلیل و مشکلات احتمالی مشخص می‌شود." },
          { title: "بررسی کارشناس", text: "نتیجه توسط کارشناسان پیوند گستر پارسان بررسی و تأیید می‌شود." },
          { title: "برنامه‌ی کوددهی", text: "برنامه‌ی تغذیه و مقادیر مصرف متناسب با گیاه شما ارائه می‌شود." },
        ],
      },
    },
    {
      page: "home",
      type: "tools",
      order: 3,
      data: {
        title: "ابزارهای رایگان بهرست",
        items: [
          { slug: "soil-water-interpretation", title: "تفسیر آزمایش خاک و آب", icon: "flask" },
          { slug: "nutrient-solution", title: "محاسبه‌گر محلول غذایی (EC، pH، استوک A/B)", icon: "droplets" },
          { slug: "product-advisor", title: "پیشنهاد محصول بر اساس منطقه، اقلیم، خاک و آب", icon: "map" },
          { slug: "vpd-acid", title: "محاسبه‌ی VPD گلخانه و اسید آبیاری", icon: "thermometer" },
          { slug: "oxide-converter", title: "تبدیل اکسید به عنصر (P₂O₅، K₂O، ...)", icon: "repeat" },
          { slug: "deficiency", title: "تشخیص کمبود عناصر از روی علائم برگ", icon: "leaf" },
          { slug: "crop-guides", title: "راهنمای تغذیه‌ی هر محصول به تفکیک مرحله‌ی رشد", icon: "sprout" },
        ],
      },
    },
  ]);

  // ---------- سئو ----------
  await db.delete(pageSeo);
  await db.insert(pageSeo).values([
    {
      path: "/",
      title: "بهرست | مشاوره و تغذیه‌ی تخصصی گیاه برای گلخانه، باغ و مزرعه",
      description:
        "مشاوره‌ی رایگان و تخصصی کوددهی، ابزارهای تفسیر آزمایش خاک و آب، و فروش کودهای NPK و محلول‌های غذایی بهرست.",
    },
  ]);

  // ---------- محصولات (قیمت‌ها نمونه) ----------
  await db.delete(products);
  await db.insert(products).values([
    {
      slug: "behrost-cucumber-nutrient",
      name: "محلول غذایی بهرست، خیار گلخانه‌ای",
      category: "nutrient",
      summary: "پکیج دو مرحله‌ای (استوک A و B) برای کشت هیدروپونیک و خاکی خیار.",
      description:
        "محلول غذایی بهرست بر اساس نیازهای مرحله‌ای خیار گلخانه‌ای در کشت‌های هیدروپونیک و خاکی تولید می‌شود. هر مرحله در دو استوک A و B عرضه می‌شود. برای تهیه‌ی ۵۰۰ لیتر محلول غذایی، دو لیتر استوک A به‌اضافه‌ی یک لیتر استوک B استفاده می‌شود.",
      price: 2500000,
      stock: 50,
      sortOrder: 1,
      image: "/products/label-cucumber.jpg",
    },
    {
      slug: "behrost-pepper-nutrient",
      name: "محلول غذایی بهرست، فلفل گلخانه‌ای",
      category: "nutrient",
      summary: "پکیج دو مرحله‌ای (استوک A و B) برای کشت هیدروپونیک و خاکی فلفل.",
      description:
        "محلول غذایی بهرست بر اساس نیازهای مرحله‌ای فلفل گلخانه‌ای در کشت‌های هیدروپونیک و خاکی تولید می‌شود. هر مرحله در دو استوک A و B عرضه می‌شود.",
      price: 2500000,
      stock: 50,
      sortOrder: 2,
      image: "/products/label-pepper.jpg",
    },
    {
      slug: "behrost-tomato-nutrient",
      name: "محلول غذایی بهرست، گوجه‌فرنگی گلخانه‌ای",
      category: "nutrient",
      summary: "پکیج سه مرحله‌ای (استوک A و B) برای کشت هیدروپونیک و خاکی گوجه‌فرنگی.",
      description:
        "محلول غذایی بهرست بر اساس نیازهای مرحله‌ای گوجه‌فرنگی در کشت‌های هیدروپونیک و خاکی تولید می‌شود. هر مرحله در دو استوک A و B عرضه می‌شود.",
      price: 2800000,
      stock: 50,
      sortOrder: 3,
      image: "/products/label-tomato.jpg",
    },
    {
      slug: "micro-6",
      name: "Micro 6، کود ریزمغذی گلخانه‌ای",
      category: "micro",
      summary: "فرمولاسیون غنی از شش عنصر کم‌مصرف (Fe، Cu، B، Mn، Zn، Mo)، بدون کلر.",
      description:
        "کل محتویات هر بسته‌ی کوچک داخل پاکت را در یک مخزن ۱۰۰۰۰ لیتری آب آبیاری حل کنید. این محصول حاوی کلر نیست.",
      specs: { Fe: 3.0, Cu: 0.07, B: 0.4, Mn: 0.8, Zn: 0.3, Mo: 0.05, unit: "% w/w" },
      price: 350000,
      stock: 100,
      sortOrder: 4,
      image: "/products/label-micro6.jpg",
    },
    ...[
      { n: "20-20-20", slug: "npk-20-20-20", img: "npk-bag-photo-1.jpg" },
      { n: "10-52-10", slug: "npk-10-52-10", img: "npk-bag-photo-2.jpg" },
      { n: "12-12-36", slug: "npk-12-12-36", img: "npk-bag-photo-3.jpg" },
      { n: "15-5-30", slug: "npk-15-5-30", img: "npk-bag-photo-4.jpg" },
    ].map((p, i) => ({
      slug: p.slug,
      name: `کود NPK ${p.n} (کیسه‌ی ۱۰ کیلوگرمی)`,
      category: "npk",
      summary: `کود ترکیبی NPK با نسبت ${p.n}.`,
      description: `کود ترکیبی NPK ${p.n} در بسته‌ی ۱۰ کیلوگرمی، تولید شرکت پیوند گستر پارسان.`,
      specs: { npk: p.n, weightKg: 10 },
      price: 1200000,
      stock: 100,
      sortOrder: 10 + i,
      image: `/products/${p.img}`,
    })),
  ]);

  // ---------- راهنمای مرحله‌ای تغذیه (از برچسب محصولات بهرست؛ mmol/L و µmol/L) ----------
  await db.delete(cropGuides);
  const gd = (N: number, P: number, K: number, Ca: number, Mg: number, S: number) => ({ N, P, K, Ca, Mg, S });
  await db.insert(cropGuides).values([
    {
      slug: "cucumber",
      name: "خیار گلخانه‌ای",
      intro: "محلول غذایی هر مرحله با نیاز رشدی گیاه در همان مرحله تطبیق داده شده است.",
      stages: [
        { name: "مرحله‌ی ۱", macro: gd(6.8, 0.65, 3, 1.6, 1, 0.75) },
        { name: "مرحله‌ی ۲", macro: gd(7.5, 2, 3.5, 3.5, 1.5, 0.8) },
      ],
      micro: { Fe: 26, Cu: 0.6, Mn: 10, Zn: 5, B: 27, Mo: 0.5 },
    },
    {
      slug: "pepper",
      name: "فلفل گلخانه‌ای",
      intro: "محلول غذایی هر مرحله با نیاز رشدی گیاه در همان مرحله تطبیق داده شده است.",
      stages: [
        { name: "مرحله‌ی ۱", macro: gd(12.5, 1.2, 5.5, 5, 1.8, 1.25) },
        { name: "مرحله‌ی ۲", macro: gd(11.3, 1.2, 6, 6, 1.6, 1) },
      ],
      micro: { Fe: 26, Cu: 0.75, Mn: 9, Zn: 4.3, B: 28, Mo: 0.5 },
    },
    {
      slug: "tomato",
      name: "گوجه‌فرنگی گلخانه‌ای",
      intro: "محلول غذایی هر مرحله با نیاز رشدی گیاه در همان مرحله تطبیق داده شده است.",
      stages: [
        { name: "مرحله‌ی ۱", macro: gd(5.2, 2.1, 3, 3, 1.5, 1.1) },
        { name: "مرحله‌ی ۲", macro: gd(7.5, 2.1, 3.5, 3.5, 1.5, 1.1) },
        { name: "مرحله‌ی ۳", macro: gd(10.5, 2.1, 5, 3.5, 1.5, 1.1) },
      ],
      micro: { Fe: 50, Cu: 3, Mn: 14, Zn: 4, B: 64, Mo: 0.5 },
    },
  ]);

  console.log("seed تمام شد.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
