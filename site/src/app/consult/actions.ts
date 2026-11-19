"use server";
import { headers } from "next/headers";
import { z } from "zod";
import { db, messages } from "@/db";

export type ConsultState = { ok: boolean; error?: string; fields?: Record<string, string> };

const FAD = "۰۱۲۳۴۵۶۷۸۹";
const digits = (s: string) => s.replace(/[۰-۹]/g, (d) => String(FAD.indexOf(d))).replace(/\s|-/g, "");

const schema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید").max(80),
  phone: z.string().transform(digits).pipe(z.string().regex(/^09\d{9}$/, "شماره‌ی موبایل را مثل 09123456789 وارد کنید")),
  farmType: z.enum(["greenhouse", "orchard", "field"], { error: "نوع کشت را انتخاب کنید" }),
  crop: z.string().trim().max(80).optional(),
  region: z.string().trim().max(120).optional(),
  soil: z.string().trim().max(120).optional(),
  water: z.string().trim().max(120).optional(),
  note: z.string().trim().max(2000).optional(),
});

// محدودیت ساده‌ی تعداد ارسال (در حافظه): ۵ درخواست در ساعت برای هر آی‌پی
const hits = new Map<string, number[]>();

export async function submitConsult(_prev: ConsultState, fd: FormData): Promise<ConsultState> {
  if (fd.get("website")) return { ok: true }; // honeypot: ربات‌ها
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3600_000);
  if (recent.length >= 5) return { ok: false, error: "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید." };

  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] = i.message;
    return { ok: false, error: "لطفاً موارد مشخص‌شده را اصلاح کنید.", fields };
  }
  const { name, phone, note, ...rest } = parsed.data;
  db.insert(messages).values({ kind: "consult", name, phone, body: note ?? "", payload: rest }).run();
  hits.set(ip, [...recent, now]);
  return { ok: true };
}
