import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, posts } from "@/db";
import { deletePost, savePost } from "../../../posts-actions";

export default async function PostEdit({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { id } = await params;
  const { ok, err } = await searchParams;
  const isNew = id === "new";
  const p = isNew ? undefined : db.select().from(posts).where(eq(posts.id, Number(id))).get();
  if (!isNew && !p) notFound();
  return (
    <>
      <h1>{isNew ? "مقاله‌ی جدید" : "ویرایش مقاله"}</h1>
      {ok && <div className="ad-ok">{ok} {p?.published && <Link href={`/blog/${p.slug}`} target="_blank">مشاهده در سایت ↗</Link>}</div>}
      {err && <div className="ad-err">{err}</div>}
      <form action={savePost} className="ad-card ad-form">
        <input type="hidden" name="id" value={id} />
        <label className="ad-f"><span>عنوان</span><input name="title" defaultValue={p?.title} required /></label>
        <div className="ad-row">
          <label className="ad-f"><span>نشانی (slug)</span><input name="slug" dir="ltr" defaultValue={p?.slug} /><small>اختیاری؛ اگر خالی بگذارید خودکار ساخته می‌شود. مثل tomato-calcium-deficiency</small></label>
          <div className="ad-f"><span>عکس شاخص</span>
            {p?.cover && /* eslint-disable-next-line @next/next/no-img-element */ <img className="ad-thumb" style={{ width: 120, height: 80, objectFit: "cover" }} src={p.cover} alt="" />}
            <input type="file" name="cover" accept="image/jpeg,image/png,image/webp" /><small>اختیاری، حداکثر ۵ مگابایت</small></div>
        </div>
        <label className="ad-f"><span>خلاصه (برای فهرست مقاله‌ها و گوگل)</span><textarea name="excerpt" rows={2} defaultValue={p?.excerpt} /></label>
        <label className="ad-f"><span>متن مقاله</span>
          <textarea name="content" rows={18} defaultValue={p?.content} required />
          <small>راهنما: «## عنوان» برای تیتر بخش، «### » برای زیرتیتر، «- » اول سطر برای فهرست، «**متن**» برای پررنگ، «[متن](https://آدرس)» برای لینک، و یک خط خالی برای پاراگراف جدید.</small></label>
        <label className="ad-chk"><input type="checkbox" name="published" defaultChecked={p?.published} /> منتشر شود (بدون تیک، پیش‌نویس می‌ماند)</label>
        <div style={{ display: "flex", gap: 10 }}><button className="ad-btn">ذخیره</button><Link className="ad-btn alt" href="/admin/posts">بازگشت</Link></div>
      </form>
      {!isNew && (
        <form action={deletePost} className="ad-card"><input type="hidden" name="id" value={id} /><button className="ad-btn danger">حذف مقاله</button></form>
      )}
    </>
  );
}
