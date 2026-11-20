import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { STATUS_LABEL } from "@/lib/payment";
import { jdate, toman } from "@/lib/format";

export default async function OrdersAdmin({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  const q = db.select().from(orders);
  const list = (s && STATUS_LABEL[s] ? q.where(eq(orders.status, s)) : q).orderBy(desc(orders.id)).all();
  return (
    <>
      <h1>سفارش‌ها</h1>
      <p style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link className={`ad-btn ${s ? "alt" : ""}`} href="/admin/orders">همه</Link>
        {Object.entries(STATUS_LABEL).map(([k, v]) => <Link key={k} className={`ad-btn ${s === k ? "" : "alt"}`} href={`/admin/orders?s=${k}`}>{v}</Link>)}
      </p>
      <table className="ad-table">
        <thead><tr><th>شماره</th><th>تاریخ</th><th>مشتری</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
        <tbody>
          {list.length === 0 && <tr><td colSpan={5} className="ad-muted">سفارشی نیست.</td></tr>}
          {list.map((o) => (
            <tr key={o.id}>
              <td><Link href={`/admin/orders/${o.number}`} dir="ltr">{o.number}</Link></td>
              <td>{jdate(o.createdAt)}</td>
              <td>{(o.customer as { name: string }).name}</td>
              <td>{toman(o.total)}</td>
              <td><span className={`ad-pill ${o.status}`}>{STATUS_LABEL[o.status] ?? o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
