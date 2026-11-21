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

export function getProduct(slug: string) {
  return db.select().from(products).where(eq(products.slug, slug)).get();
}
export const CATEGORIES: Record<string, string> = { nutrient: "محلول غذایی بهرست", micro: "ریزمغذی", npk: "کود NPK" };

import { desc } from "drizzle-orm";
import { posts } from "@/db";
export function getPosts(limit = 100) {
  return db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt)).limit(limit).all();
}
export function getPost(slug: string) {
  return db.select().from(posts).where(eq(posts.slug, slug)).get();
}
