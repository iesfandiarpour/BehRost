"use server";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, posts } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { saveImage } from "@/lib/upload";

const schema = z.object({
  title: z.string().trim().min(3, "عنوان مقاله را وارد کنید").max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "نشانی (slug) فقط حروف کوچک لاتین، عدد و خط تیره").or(z.literal("")),
  excerpt: z.string().trim().max(300),
  content: z.string().trim().min(10, "متن مقاله را بنویسید").max(60000),
});

export async function savePost(fd: FormData) {
  await requireAdmin();
  const idRaw = String(fd.get("id") ?? "new");
  const isNew = idRaw === "new";
  const back = (k: "ok" | "err", m: string) => redirect(`/admin/posts/${isNew ? "new" : idRaw}?${k}=${encodeURIComponent(m)}`);
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) back("err", parsed.error.issues[0].message);
  const d = parsed.data!;
  const slug = d.slug || "post-" + randomBytes(3).toString("hex");
  const dup = db.select().from(posts).where(eq(posts.slug, slug)).get();
  if (dup && String(dup.id) !== idRaw) back("err", "این نشانی (slug) قبلاً استفاده شده");

  let cover: string | undefined;
  const file = fd.get("cover");
  if (file instanceof File && file.size > 0) {
    try { cover = await saveImage(file, "posts"); } catch (e) { back("err", (e as Error).message); }
  }
  const published = fd.get("published") === "on";
  const old = isNew ? undefined : db.select().from(posts).where(eq(posts.id, Number(idRaw))).get();
  const publishedAt = published ? (old?.publishedAt ?? Math.floor(Date.now() / 1000)) : (old?.publishedAt ?? null);
  const values = { title: d.title, slug, excerpt: d.excerpt, content: d.content, published, publishedAt, ...(cover ? { cover } : {}) };
  let id: number;
  if (isNew) id = Number(db.insert(posts).values(values).returning({ id: posts.id }).get().id);
  else { id = Number(idRaw); db.update(posts).set(values).where(eq(posts.id, id)).run(); }
  revalidatePath("/", "layout");
  redirect(`/admin/posts/${id}?ok=${encodeURIComponent(published ? "ذخیره و منتشر شد" : "ذخیره شد (پیش‌نویس)")}`);
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  db.delete(posts).where(eq(posts.id, Number(fd.get("id")))).run();
  revalidatePath("/", "layout");
  redirect("/admin/posts?ok=" + encodeURIComponent("مقاله حذف شد"));
}
