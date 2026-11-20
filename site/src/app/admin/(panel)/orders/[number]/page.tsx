import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { STATUS_LABEL } from "@/lib/payment";
import { jdate, toFa, toman } from "@/lib/format";
import { setOrderStatus } from "../../../orders-actions";

type Cust = { name: string; phone: string; province: string; city: string; address: string; postal: string; note: string };
export default async function OrderAdmin({ params, searchParams }: { params: Promise<{ number: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { number } = await params;
  const { ok, err } = await searchParams;
  const o = db.select().from(orders).where(eq(orders.number, number)).get();
  if (!o) notFound();
  const c = o.customer as Cust;
  const items = o.items as { name: string; qty: number; price: number }[];
  return (
    <>
      <h1>سفارش <span dir="ltr">{o.number}</span></h1>
      {ok && <div className="ad-ok">{ok}</div>}
      {err && <div className="ad-err">{err}</div>}
      <div className="ad-card">
        <p>تاریخ ثبت: {jdate(o.createdAt)}</p>
        {o.paymentRef && <p>مرجع پرداخت: <span dir="ltr">{o.paymentRef}</span></p>}
        <form action={setOrderStatus} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input type="hidden" name="number" value={o.number} />
          <label className="ad-f" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>وضعیت:
            <select name="status" defaultValue={o.status} style={{ width: "auto" }}>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <button className="ad-btn">ذخیره‌ی وضعیت</button>
        </form>
      </div>
      <div className="ad-card">
        <h3 style={{ marginTop: 0 }}>مشخصات گیرنده</h3>
        <p>{c.name} — <a href={`tel:${c.phone}`} dir="ltr">{c.phone}</a></p>
        <p>{c.province}، {c.city}{c.postal && <> — کدپستی: <span dir="ltr">{c.postal}</span></>}</p>
        <p>{c.address}</p>
        {c.note && <p className="ad-muted">توضیحات: {c.note}</p>}
      </div>
      <table className="ad-table">
        <thead><tr><th>محصول</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead>
        <tbody>{items.map((i) => <tr key={i.name}><td>{i.name}</td><td>{toFa(i.qty)}</td><td>{toman(i.price)}</td><td>{toman(i.price * i.qty)}</td></tr>)}
          <tr><td colSpan={3}><b>جمع کل</b></td><td><b>{toman(o.total)}</b></td></tr></tbody>
      </table>
      <p><Link className="ad-btn alt" href="/admin/orders">بازگشت</Link></p>
    </>
  );
}
