"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, pageSeo, sections, siteSettings } from "@/db";
import { requireAdmin } from "@/lib/auth";

const s = (fd: FormData, k: string, max = 600) => String(fd.get(k) ?? "").trim().slice(0, max);
const done = (path: string, msg = "ذخیره شد") => { revalidatePath("/", "layout"); redirect(`${path}?ok=${encodeURIComponent(msg)}`); };

function patchSection(type: string, visible: boolean, merge: (d: Record<string, unknown>) => Record<string, unknown>) {
  const row = db.select().from(sections).where(and(eq(sections.page, "home"), eq(sections.type, type))).get();
  if (!row) return;
  db.update(sections).set({ visible, data: merge(row.data as Record<string, unknown>) }).where(eq(sections.id, row.id)).run();
}

export async function saveHero(fd: FormData) {
  await requireAdmin();
  patchSection("hero", fd.get("visible") === "on", (d) => ({
    ...d, eyebrow: s(fd, "eyebrow"), titleLine1: s(fd, "titleLine1"), titleLine2: s(fd, "titleLine2"), text: s(fd, "text", 800),
    primaryButton: { label: s(fd, "pLabel", 60), href: s(fd, "pHref", 200) || "/tools" },
    secondaryButton: { label: s(fd, "sLabel", 60), href: s(fd, "sHref", 200) || "/consult" },
  }));
  done("/admin/content");
}
export async function saveSteps(fd: FormData) {
  await requireAdmin();
  patchSection("steps", fd.get("visible") === "on", (d) => ({
    ...d, title: s(fd, "title"), subtitle: s(fd, "subtitle"),
    steps: [1, 2, 3, 4].map((i) => ({ title: s(fd, `t${i}`, 80), text: s(fd, `x${i}`, 300) })).filter((x) => x.title),
  }));
  done("/admin/content");
}
export async function saveTools(fd: FormData) {
  await requireAdmin();
  patchSection("tools", fd.get("visible") === "on", (d) => ({ ...d, title: s(fd, "title") }));
  done("/admin/content");
}
export async function saveSeo(fd: FormData) {
  await requireAdmin();
  const title = s(fd, "title", 120), description = s(fd, "description", 300);
  db.insert(pageSeo).values({ path: "/", title, description }).onConflictDoUpdate({ target: pageSeo.path, set: { title, description } }).run();
  done("/admin/content");
}

const FAD = "۰۱۲۳۴۵۶۷۸۹";
const dg = (v: string) => v.replace(/[۰-۹]/g, (d) => String(FAD.indexOf(d))).replace(/[\s-]/g, "");
const lines = (v: string) => v.split(/\r?\n/).map((x) => dg(x)).filter(Boolean);
const set = (key: string, value: unknown) => db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value } }).run();

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const mobiles = lines(s(fd, "mobiles", 400)), landlines = lines(s(fd, "landlines", 400));
  if (mobiles.some((m) => !/^09\d{9}$/.test(m))) redirect("/admin/settings?err=" + encodeURIComponent("هر شماره‌ی موبایل باید ۱۱ رقم و مثل 09123456789 باشد"));
  if (landlines.some((m) => !/^0\d{10}$/.test(m))) redirect("/admin/settings?err=" + encodeURIComponent("شماره‌ی ثابت را با کد شهر و بدون خط تیره بنویسید، مثل 03431312012"));
  const cur = db.select().from(siteSettings).all().reduce<Record<string, Record<string, unknown>>>((a, r) => ({ ...a, [r.key]: r.value as Record<string, unknown> }), {});
  set("contact", { ...cur.contact, mobiles, landlines, address: s(fd, "address", 300), email: s(fd, "email", 120), hours: s(fd, "hours", 120) });
  set("social", { ...cur.social, instagram: s(fd, "instagram", 80), website: s(fd, "website", 120) });
  set("brand", { ...cur.brand, supervision: s(fd, "supervision", 200) });
  set("footer", { ...cur.footer, about: s(fd, "about", 500) });
  done("/admin/settings");
}
