"use server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminUsers, db } from "@/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";

const tries = new Map<string, number[]>();

export async function login(fd: FormData) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (tries.get(ip) ?? []).filter((t) => now - t < 15 * 60_000);
  if (recent.length >= 8) redirect("/admin/login?err=" + encodeURIComponent("تلاش‌های ناموفق زیاد بود؛ ۱۵ دقیقه بعد دوباره امتحان کنید."));
  const u = db.select().from(adminUsers).where(eq(adminUsers.username, String(fd.get("username") ?? "").trim())).get();
  const ok = u ? await bcrypt.compare(String(fd.get("password") ?? ""), u.passwordHash) : await bcrypt.compare("x", "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi");
  if (!u || !ok) {
    tries.set(ip, [...recent, now]);
    redirect("/admin/login?err=" + encodeURIComponent("نام کاربری یا رمز عبور درست نیست."));
  }
  await createSession(u.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(fd: FormData) {
  const a = await requireAdmin();
  const u = db.select().from(adminUsers).where(eq(adminUsers.id, a.id)).get();
  const cur = String(fd.get("current") ?? ""), next = String(fd.get("next") ?? ""), again = String(fd.get("again") ?? "");
  const back = (m: string, k: "ok" | "err") => redirect(`/admin/account?${k}=${encodeURIComponent(m)}`);
  if (!u || !(await bcrypt.compare(cur, u.passwordHash))) back("رمز فعلی درست نیست.", "err");
  if (next.length < 10) back("رمز جدید باید حداقل ۱۰ کاراکتر باشد.", "err");
  if (next !== again) back("تکرار رمز جدید یکسان نیست.", "err");
  db.update(adminUsers).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(adminUsers.id, a.id)).run();
  back("رمز عبور تغییر کرد.", "ok");
}
