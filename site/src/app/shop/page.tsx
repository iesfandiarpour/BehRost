import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import ProductCard from "@/components/shop/ProductCard";
import { CATEGORIES, getProducts } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "فروشگاه | بهرست", description: "محلول‌های غذایی بهرست، ریزمغذی Micro 6 و کودهای NPK پیوند گستر پارسان." };

export default async function Shop({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const all = getProducts();
  const list = c && CATEGORIES[c] ? all.filter((p) => p.category === c) : all;
  return (
    <SiteShell>
      <main className="page">
        <div className="wrap">
          <h1 className="ph1">فروشگاه بهرست</h1>
          <p className="sub">محلول‌های غذایی بهرست و کودهای NPK پیوند گستر پارسان</p>
          <div className="tabs">
            <Link href="/shop" className={!c ? "on" : ""}>همه</Link>
            {Object.entries(CATEGORIES).map(([k, v]) => <Link key={k} href={`/shop?c=${k}`} className={c === k ? "on" : ""}>{v}</Link>)}
          </div>
          <div className="pgrid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </main>
    </SiteShell>
  );
}
