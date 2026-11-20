"use server";
import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { z } from "zod";
import { db, products } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { intFrom } from "@/lib/format";

const schema = z.object({
  name: z.string().trim().min(2, "نام محصول را وارد کنید").max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "نشانی (slug) فقط حروف کوچک لاتین، عدد و خط تیره"),
  category: z.enum(["nutrient", "npk", "micro"], { error: "دسته را انتخاب کنید" }),
  summary: z.string().trim().max(300),
  description: z.string().trim().max(5000),
});

export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const idRaw = String(fd.get("id") ?? "new");
  const isNew = idRaw === "new";
  const back = (k: "ok" | "err", m: string) => redirect(`/admin/products/${isNew ? "new" : idRaw}?${k}=${encodeURIComponent(m)}`);

  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) back("err", parsed.error.issues[0].message);
  const d = parsed.data!;
  const price = intFrom(fd.get("price")), stock = intFrom(fd.get("stock")), sortOrder = intFrom(fd.get("sortOrder") ?? "0");
  if (Number.isNaN(price) || price < 0) back("err", "قیمت را به‌صورت عدد (تومان) وارد کنید");
  if (Number.isNaN(stock) || stock < 0) back("err", "موجودی را به‌صورت عدد وارد کنید");
  const dup = db.select().from(products).where(eq(products.slug, d.slug)).get();
  if (dup && String(dup.id) !== idRaw) back("err", "این نشانی (slug) قبلاً برای محصول دیگری استفاده شده");

  let image: string | undefined;
  const file = fd.get("image");
  if (file instanceof File && file.size > 0) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) back("err", "عکس باید JPG، PNG یا WebP باشد");
    if (file.size > 5 * 1024 * 1024) back("err", "حجم عکس باید کمتر از ۵ مگابایت باشد");
    const dir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "uploads", "products");
    await mkdir(dir, { recursive: true });
    const name = randomBytes(8).toString("hex") + ".webp";
    await sharp(Buffer.from(await file.arrayBuffer())).rotate().resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(dir, name));
    image = "/media/products/" + name;
  }

  const values = {
    ...d, price, stock, sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    priceIsSample: fd.get("priceIsSample") === "on", published: fd.get("published") === "on",
    ...(image ? { image } : {}),
  };
  let id: number;
  if (isNew) id = Number(db.insert(products).values(values).returning({ id: products.id }).get().id);
  else { id = Number(idRaw); db.update(products).set(values).where(eq(products.id, id)).run(); }
  revalidatePath("/", "layout");
  redirect(`/admin/products/${id}?ok=${encodeURIComponent("ذخیره شد")}`);
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  db.delete(products).where(eq(products.id, Number(fd.get("id")))).run();
  revalidatePath("/", "layout");
  redirect("/admin/products?ok=" + encodeURIComponent("محصول حذف شد"));
}
