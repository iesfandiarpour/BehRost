/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { toman } from "@/lib/format";
import { CATEGORIES } from "@/lib/content";

type P = { slug: string; name: string; price: number; priceIsSample: boolean; stock: number; image: string | null; category: string };
export default function ProductCard({ p }: { p: P }) {
  return (
    <Link className="pc" href={`/shop/${p.slug}`}>
      <div className="im">{p.image && <img src={p.image} alt={p.name} />}</div>
      <div className="b">
        <small className="cat">{CATEGORIES[p.category] ?? p.category}</small>
        <h3>{p.name}</h3>
        <div className="price">{toman(p.price)}{p.priceIsSample && <small>(قیمت نمونه)</small>}</div>
        {p.stock <= 0 && <small className="err">ناموجود</small>}
      </div>
    </Link>
  );
}
