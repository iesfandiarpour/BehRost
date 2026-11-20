import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, products } from "@/db";
import { CATEGORIES } from "@/lib/content";
import { toFa, toman } from "@/lib/format";

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const list = db.select().from(products).orderBy(asc(products.sortOrder)).all();
  return (
    <>
      <h1>محصولات</h1>
      {ok && <div className="ad-ok">{ok}</div>}
      <p><Link className="ad-btn" href="/admin/products/new">+ محصول جدید</Link></p>
      <table className="ad-table">
        <thead><tr><th></th><th>نام</th><th>دسته</th><th>قیمت</th><th>موجودی</th><th>وضعیت</th></tr></thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id}>
              <td>{p.image && /* eslint-disable-next-line @next/next/no-img-element */ <img className="ad-thumb" src={p.image} alt="" />}</td>
              <td><Link href={`/admin/products/${p.id}`}>{p.name}</Link></td>
              <td>{CATEGORIES[p.category]}</td>
              <td>{toman(p.price)}{p.priceIsSample && <span className="ad-pill pending" style={{ marginInlineStart: 6 }}>نمونه</span>}</td>
              <td>{toFa(p.stock)}</td>
              <td>{p.published ? "منتشر" : "پیش‌نویس"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
