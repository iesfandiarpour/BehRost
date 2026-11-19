/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/site/SiteShell";
import AddToCart from "@/components/shop/AddToCart";
import { CATEGORIES, getProduct } from "@/lib/content";
import { toFa, toman } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  return { title: p ? `${p.name} | بهرست` : "محصول | بهرست", description: p?.summary };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p || !p.published) notFound();
  const specs = (p.specs ?? {}) as Record<string, string | number>;
  const micro = p.category === "micro" ? Object.entries(specs).filter(([k]) => k !== "unit") : [];
  return (
    <SiteShell>
      <main className="page">
        <div className="wrap">
          <nav className="crumb"><Link href="/">خانه</Link> / <Link href="/shop">فروشگاه</Link> / <Link href={`/shop?c=${p.category}`}>{CATEGORIES[p.category]}</Link></nav>
          <div className="split pdetail">
            <div className="pimg">{p.image && <img src={p.image} alt={p.name} />}</div>
            <div>
              <h1 className="ph1">{p.name}</h1>
              <p className="sub">{p.summary}</p>
              <div className="price big2">{toman(p.price)}{p.priceIsSample && <small>(قیمت نمونه)</small>}</div>
              <p className="hint">{p.stock > 0 ? `موجودی: ${toFa(p.stock)} عدد` : "فعلاً ناموجود"}</p>
              <AddToCart id={p.id} stock={p.stock} />
              <h3 className="h3">توضیحات</h3>
              <p>{p.description}</p>
              {p.category === "npk" && specs.npk && (
                <table className="tbl"><tbody>
                  <tr><th>نسبت N-P-K</th><td dir="ltr">{String(specs.npk)}</td></tr>
                  <tr><th>وزن بسته</th><td>{toFa(String(specs.weightKg))} کیلوگرم</td></tr>
                </tbody></table>
              )}
              {micro.length > 0 && (
                <table className="tbl"><thead><tr><th>عنصر محلول در آب</th><th>درصد وزنی (w/w)</th></tr></thead>
                  <tbody>{micro.map(([k, v]) => <tr key={k}><td dir="ltr">{k}</td><td>{toFa(String(v))}</td></tr>)}</tbody></table>
              )}
              {p.category === "nutrient" && (
                <p className="hint">برای محاسبه‌ی مقدار مصرف، از <Link href="/tools/nutrient-solution"><u>محاسبه‌گر محلول غذایی</u></Link> استفاده کنید.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
