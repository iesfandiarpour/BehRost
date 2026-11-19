import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const now = sql`(unixepoch())`;

/** تنظیمات کلی سایت (اطلاعات تماس، شبکه‌های اجتماعی، فوتر، ...) به‌صورت کلید و مقدار JSON */
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull(),
});

/** بخش‌های هر صفحه (hero، ابزارها، مراحل مشاوره، ...) */
export const sections = sqliteTable("sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  page: text("page").notNull(),
  type: text("type").notNull(),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  data: text("data", { mode: "json" }).notNull(),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // nutrient | npk | micro
  summary: text("summary").notNull().default(""),
  description: text("description").notNull().default(""),
  specs: text("specs", { mode: "json" }), // مشخصات فنی (جدول عناصر، نسبت NPK، ...)
  price: integer("price").notNull().default(0), // تومان
  priceIsSample: integer("price_is_sample", { mode: "boolean" }).notNull().default(true),
  stock: integer("stock").notNull().default(0),
  image: text("image"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at").notNull().default(now),
});

/** راهنمای تغذیه‌ی هر محصول (خیار، گوجه، فلفل) به تفکیک مرحله‌ی رشد */
export const cropGuides = sqliteTable("crop_guides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  intro: text("intro").notNull().default(""),
  stages: text("stages", { mode: "json" }).notNull(), // [{ name, macro:{N,P,K,Ca,Mg,S} }]
  micro: text("micro", { mode: "json" }).notNull(), // {Fe,Cu,Mn,Zn,B,Mo}
  published: integer("published", { mode: "boolean" }).notNull().default(true),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  cover: text("cover"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  publishedAt: integer("published_at"),
  createdAt: integer("created_at").notNull().default(now),
});

/** پیام‌های فرم تماس و درخواست‌های مشاوره */
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind").notNull(), // contact | consult
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  body: text("body").notNull().default(""),
  payload: text("payload", { mode: "json" }), // محصول، منطقه، خاک، آب، ...
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull().default(now),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull().unique(),
  customer: text("customer", { mode: "json" }).notNull(), // نام، تلفن، آدرس
  items: text("items", { mode: "json" }).notNull(), // [{ productId, name, qty, price }]
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"), // pending | paid | shipped | done | canceled
  paymentRef: text("payment_ref"),
  createdAt: integer("created_at").notNull().default(now),
});

export const pageSeo = sqliteTable("page_seo", {
  path: text("path").primaryKey(),
  title: text("title"),
  description: text("description"),
  ogImage: text("og_image"),
});

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  path: text("path").notNull(),
  alt: text("alt").notNull().default(""),
  width: integer("width"),
  height: integer("height"),
  bytes: real("bytes"),
  createdAt: integer("created_at").notNull().default(now),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at").notNull().default(now),
});
