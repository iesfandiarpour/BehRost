import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminUsers, db } from "@/db";

export const COOKIE = "behrost_admin";
const key = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET در تنظیمات محیطی وجود ندارد یا کوتاه است");
  return new TextEncoder().encode(s);
};

export async function createSession(userId: number) {
  const token = await new SignJWT({ uid: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 86400 });
}
export async function destroySession() {
  (await cookies()).delete(COOKIE);
}
export async function getAdmin() {
  const t = (await cookies()).get(COOKIE)?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, key());
    const u = db.select().from(adminUsers).where(eq(adminUsers.id, Number(payload.uid))).get();
    return u ? { id: u.id, username: u.username } : null;
  } catch {
    return null;
  }
}
/** در هر صفحه و هر action مدیریت صدا زده می‌شود (علاوه بر proxy) */
export async function requireAdmin() {
  const a = await getAdmin();
  if (!a) redirect("/admin/login");
  return a;
}
