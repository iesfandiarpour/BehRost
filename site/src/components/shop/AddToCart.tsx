"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function AddToCart({ id, stock }: { id: number; stock: number }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  if (stock <= 0) return <span className="soldout">ناموجود</span>;
  return (
    <div className="addrow">
      <button className="btn p" onClick={() => { add(id); setDone(true); setTimeout(() => setDone(false), 2500); }}>افزودن به سبد خرید</button>
      {done && <span className="added">اضافه شد. <Link href="/cart">مشاهده‌ی سبد</Link></span>}
    </div>
  );
}
