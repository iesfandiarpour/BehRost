import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, products } from "@/db";
import { CATEGORIES } from "@/lib/content";
import { deleteProduct, saveProduct } from "../../../products-actions";

export default async function ProductEdit({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { id } = await params;
  const { ok, err } = await searchParams;
  const isNew = id === "new";
  const p = isNew ? undefined : db.select().from(products).where(eq(products.id, Number(id))).get();
  if (!isNew && !p) notFound();
  return (
    <>
      <h1>{isNew ? "محصول جدید" : "ویرایش محصول"}</h1>
      {ok && <div className="ad-ok">{ok}</div>}
      {err && <div className="ad-err">{err}</div>}
      <form action={saveProduct} className="ad-card ad-form">
        <input type="hidden" name="id" value={id} />
        <div className="ad-row">
          <label className="ad-f"><span>نام محصول</span><input name="name" defaultValue={p?.name} required /></label>
          <label className="ad-f"><span>نشانی (slug)</span><input name="slug" dir="ltr" defaultValue={p?.slug} required /><small>مثل npk-20-20-20 (فقط حروف کوچک لاتین، عدد و خط تیره)</small></label>
          <label className="ad-f"><span>دسته</span>
            <select name="category" defaultValue={p?.category ?? "nutrient"}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        </div>
        <label className="ad-f"><span>خلاصه (یک جمله)</span><input name="summary" defaultValue={p?.summary} /></label>
        <label className="ad-f"><span>توضیحات</span><textarea name="description" rows={5} defaultValue={p?.description} /></label>
        <div className="ad-row">
          <label className="ad-f"><span>قیمت (تومان)</span><input name="price" dir="ltr" inputMode="numeric" defaultValue={p?.price ?? 0} required /></label>
          <label className="ad-f"><span>موجودی انبار (عدد)</span><input name="stock" dir="ltr" inputMode="numeric" defaultValue={p?.stock ?? 0} required /></label>
          <label className="ad-f"><span>ترتیب نمایش</span><input name="sortOrder" dir="ltr" inputMode="numeric" defaultValue={p?.sortOrder ?? 0} /><small>عدد کوچک‌تر، بالاتر</small></label>
        </div>
        <label className="ad-chk"><input type="checkbox" name="priceIsSample" defaultChecked={p ? p.priceIsSample : true} /> قیمت نمونه است (کنار قیمت «قیمت نمونه» نوشته می‌شود؛ با ثبت قیمت واقعی، تیک را بردارید)</label>
        <label className="ad-chk"><input type="checkbox" name="published" defaultChecked={p ? p.published : true} /> منتشر شود (در سایت دیده شود)</label>
        <div className="ad-f"><span>عکس محصول</span>
          {p?.image && /* eslint-disable-next-line @next/next/no-img-element */ <img className="ad-thumb" style={{ width: 120, height: 120 }} src={p.image} alt="" />}
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" /><small>JPG، PNG یا WebP، حداکثر ۵ مگابایت؛ خودکار بهینه می‌شود. اگر انتخاب نکنید عکس فعلی می‌ماند.</small></div>
        <div style={{ display: "flex", gap: 10 }}><button className="ad-btn">ذخیره</button><Link className="ad-btn alt" href="/admin/products">بازگشت</Link></div>
      </form>
      {!isNew && (
        <form action={deleteProduct} className="ad-card">
          <input type="hidden" name="id" value={id} />
          <p className="ad-muted">حذف محصول برگشت‌پذیر نیست. برای پنهان‌کردن موقت، تیک «منتشر شود» را بردارید. سفارش‌های قبلی تغییر نمی‌کنند.</p>
          <button className="ad-btn danger">حذف محصول</button>
        </form>
      )}
    </>
  );
}
