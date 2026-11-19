"use server";
import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import { db, orders, products } from "@/db";
import { paymentRedirect } from "@/lib/payment";

export type CartLine = { id: number; slug: string; name: string; price: number; priceIsSample: boolean; stock: number; image: string | null };

/** اطلاعات تازه‌ی محصولات سبد خرید (قیمت و موجودی همیشه از دیتابیس خوانده می‌شود، نه از مرورگر) */
export async function cartLookup(ids: number[]): Promise<CartLine[]> {
  const clean = [...new Set(ids.filter((n) => Number.isInteger(n)))].slice(0, 50);
  if (clean.length === 0) return [];
  return db.select().from(products).where(inArray(products.id, clean)).all()
    .filter((p) => p.published)
    .map((p) => ({ id: p.id, slug: p.slug, name: p.name, price: p.price, priceIsSample: p.priceIsSample, stock: p.stock, image: p.image }));
}

export type CheckoutState = { ok: boolean; error?: string; fields?: Record<string, string>; values?: Record<string, string> };

const FAD = "۰۱۲۳۴۵۶۷۸۹";
const digits = (s: string) => s.replace(/[۰-۹]/g, (d) => String(FAD.indexOf(d))).replace(/[\s-]/g, "");
const schema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید").max(80),
  phone: z.string().transform(digits).pipe(z.string().regex(/^09\d{9}$/, "شماره‌ی موبایل را مثل 09123456789 وارد کنید")),
  province: z.string().trim().min(2, "استان را وارد کنید").max(60),
  city: z.string().trim().min(2, "شهر را وارد کنید").max(60),
  address: z.string().trim().min(8, "آدرس را کامل وارد کنید").max(400),
  postal: z.string().transform(digits).refine((v) => v === "" || /^\d{10}$/.test(v), "کدپستی باید ۱۰ رقم باشد"),
  note: z.string().trim().max(500).optional(),
});
const cartSchema = z.array(z.object({ id: z.number().int(), qty: z.number().int().min(1).max(50) })).min(1).max(30);

const hits = new Map<string, number[]>();

export async function createOrder(_prev: CheckoutState, fd: FormData): Promise<CheckoutState> {
  if (fd.get("website")) return { ok: false, error: "درخواست نامعتبر است." };
  const values = Object.fromEntries([...fd.entries()].filter(([k, v]) => typeof v === "string" && k !== "cart" && k !== "website")) as Record<string, string>;
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3600_000);
  if (recent.length >= 10) return { ok: false, values, error: "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید." };

  let cart;
  try { cart = cartSchema.parse(JSON.parse(String(fd.get("cart") ?? "[]"))); } catch { return { ok: false, values, error: "سبد خرید خالی یا نامعتبر است." }; }
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] = i.message;
    return { ok: false, values, error: "لطفاً موارد مشخص‌شده را اصلاح کنید.", fields };
  }

  const rows = db.select().from(products).where(inArray(products.id, cart.map((c) => c.id))).all();
  const lines = [];
  for (const c of cart) {
    const p = rows.find((r) => r.id === c.id);
    if (!p || !p.published) return { ok: false, values, error: "یکی از محصولات سبد دیگر موجود نیست." };
    if (p.stock < c.qty) return { ok: false, values, error: `موجودی «${p.name}» کافی نیست (موجودی: ${p.stock}).` };
    lines.push({ productId: p.id, name: p.name, qty: c.qty, price: p.price });
  }
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const number = "BR-" + randomBytes(4).toString("hex").toUpperCase();
  const { name, phone, province, city, address, postal, note } = parsed.data;
  db.insert(orders).values({ number, customer: { name, phone, province, city, address, postal, note: note ?? "" }, items: lines, total, status: "pending" }).run();
  hits.set(ip, [...recent, now]);
  redirect(paymentRedirect(number));
}
