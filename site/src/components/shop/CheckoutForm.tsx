"use client";
import { useActionState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useCartLines } from "./CartView";
import { createOrder, type CheckoutState } from "@/app/shop/actions";
import { toFa, toman } from "@/lib/format";

const init: CheckoutState = { ok: false };

export default function CheckoutForm({ sandbox }: { sandbox: boolean }) {
  const { items } = useCart();
  const { rows, loading, total } = useCartLines();
  const [st, action, pending] = useActionState(createOrder, init);
  const v = (k: string) => st.values?.[k] ?? "";
  const err = (k: string) => st.fields?.[k] && <small className="err">{st.fields[k]}</small>;
  if (loading) return <p className="empty">در حال بارگذاری…</p>;
  if (rows.length === 0) return <div className="empty"><p>سبد خرید خالی است.</p><Link className="btn p" href="/shop">رفتن به فروشگاه</Link></div>;
  return (
    <form action={action} className="split cartsplit">
      <input type="hidden" name="cart" value={JSON.stringify(items)} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="cform">
        <h3 className="h3">مشخصات گیرنده</h3>
        <div className="fgrid">
          <label className="fld"><span>نام و نام خانوادگی</span><input name="name" defaultValue={v("name")} required />{err("name")}</label>
          <label className="fld"><span>شماره‌ی موبایل</span><input name="phone" defaultValue={v("phone")} dir="ltr" inputMode="tel" required placeholder="09123456789" />{err("phone")}</label>
          <label className="fld"><span>استان</span><input name="province" defaultValue={v("province")} required />{err("province")}</label>
          <label className="fld"><span>شهر</span><input name="city" defaultValue={v("city")} required />{err("city")}</label>
          <label className="fld"><span>کدپستی (اختیاری)</span><input name="postal" defaultValue={v("postal")} dir="ltr" inputMode="numeric" />{err("postal")}</label>
        </div>
        <label className="fld"><span>آدرس کامل</span><textarea name="address" defaultValue={v("address")} rows={3} required />{err("address")}</label>
        <label className="fld"><span>توضیحات (اختیاری)</span><textarea name="note" defaultValue={v("note")} rows={2} /></label>
        {st.error && <p className="err">{st.error}</p>}
      </div>
      <div className="ctabox">
        <h3>خلاصه‌ی سفارش</h3>
        <ul className="mini">{rows.map((r) => <li key={r.id}><span>{r.name} × {toFa(r.qty)}</span><b>{toman(r.price * r.qty)}</b></li>)}</ul>
        <p className="bigp">{toman(total)}</p>
        {sandbox && <p className="warnbox">این سایت در حالت آزمایشی است؛ پرداخت واقعی انجام نمی‌شود و قیمت‌ها نمونه‌اند.</p>}
        <button className="btn p" disabled={pending}>{pending ? "در حال ثبت…" : "ثبت سفارش و پرداخت"}</button>
      </div>
    </form>
  );
}
