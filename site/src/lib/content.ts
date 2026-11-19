import { asc, eq } from "drizzle-orm";
import { db, products, sections, siteSettings } from "@/db";

export type Brand = {
  name: string; nameEn: string; company: string; supervision: string; logo: string; companyLogo: string;
};
export type Contact = { mobiles: string[]; landlines: string[]; address: string; email: string };

export function getSetting<T>(key: string): T {
  const row = db.select().from(siteSettings).where(eq(siteSettings.key, key)).get();
  return row?.value as T;
}
export function getSections(page: string) {
  return db.select().from(sections).where(eq(sections.page, page)).orderBy(asc(sections.order)).all().filter((s) => s.visible);
}
export function getProducts() {
  return db.select().from(products).where(eq(products.published, true)).orderBy(asc(products.sortOrder)).all();
}
