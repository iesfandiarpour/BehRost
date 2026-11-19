"use client";
import Link from "next/link";
import { useCart } from "./CartContext";
import { toFa } from "@/lib/format";

export default function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="cartlink" aria-label="سبد خرید">
      🛒 <span>سبد خرید</span>{count > 0 && <b className="badge">{toFa(count)}</b>}
    </Link>
  );
}
