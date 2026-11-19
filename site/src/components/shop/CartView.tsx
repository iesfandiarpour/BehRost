/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { cartLookup, type CartLine } from "@/app/shop/actions";
import { toFa, toman } from "@/lib/format";

export function useCartLines() {
  const { items, ready } = useCart();
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const key = items.map((i) => i.id).join(",");
  useEffect(() => {
    if (!ready) return;
    let live = true;
    cartLookup(items.map((i) => i.id)).then((r) => live && setLines(r));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ready]);
  const rows = (lines ?? []).map((l) => ({ ...l, qty: items.find((i) => i.id === l.id)?.qty ?? 0 })).filter((r) => r.qty > 0);
  return { rows, loading: !ready || lines === null, total: rows.reduce((s, r) => s + r.price * r.qty, 0) };
}

export default function CartView() {
  const { setQty, remove } = useCart();
  const { rows, loading, total } = useCartLines();
  if (loading) return <p className="empty">در حال بارگذاری سبد خرید…</p>;
  if (rows.length === 0)
    return (
      <div className="empty">
        <p>سبد خرید شما خالی است.</p>
        <Link className="btn p" href="/shop">رفتن به فروشگاه</Link>
      </div>
    );
  return (
    <div className="split cartsplit">
      <ul className="cartlist">
        {rows.map((r) => (
          <li key={r.id}>
            <div className="im">{r.image && <img src={r.image} alt={r.name} />}</div>
            <div className="info">
              <Link href={`/shop/${r.slug}`}><b>{r.name}</b></Link>
              <div className="price">{toman(r.price)}{r.priceIsSample && <small>(قیمت نمونه)</small>}</div>
              <div className="qty">
                <button aria-label="کم" onClick={() => setQty(r.id, r.qty - 1)}>−</button>
                <span>{toFa(r.qty)}</span>
                <button aria-label="زیاد" onClick={() => setQty(r.id, r.qty + 1)}>+</button>
                <button className="rm" onClick={() => remove(r.id)}>حذف</button>
              </div>
              {r.stock < r.qty && <small className="err">موجودی فقط {toFa(r.stock)} عدد است.</small>}
            </div>
            <div className="sum">{toman(r.price * r.qty)}</div>
          </li>
        ))}
      </ul>
      <div className="ctabox">
        <h3>جمع سفارش</h3>
        <p className="bigp">{toman(total)}</p>
        <p className="hint">هزینه‌ی ارسال بعد از ثبت سفارش، هماهنگ و اعلام می‌شود.</p>
        <Link className="btn p" href="/checkout">ادامه و ثبت سفارش</Link>
      </div>
    </div>
  );
}
