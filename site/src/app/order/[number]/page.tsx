import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import SiteShell from "@/components/site/SiteShell";
import ClearCart from "@/components/shop/ClearCart";
import { db, orders } from "@/db";
import { STATUS_LABEL } from "@/lib/payment";
import { toFa, toman } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "وضعیت سفارش | بهرست" };

export default async function OrderPage({ params, searchParams }: { params: Promise<{ number: string }>; searchParams: Promise<{ stock?: string }> }) {
  const { number } = await params;
  const { stock } = await searchParams;
  const o = db.select().from(orders).where(eq(orders.number, number)).get();
  if (!o) notFound();
  const items = o.items as { name: string; qty: number; price: number }[];
  const c = o.customer as { name: string };
  const paid = o.status === "paid";
  return (
    <SiteShell>
      <main className="page"><div className="wrap narrow">
        {paid && <ClearCart />}
        <h1 className="ph1">{paid ? "سفارش شما ثبت شد" : "وضعیت سفارش"}</h1>
        <div className={`ctabox ${paid ? "okbox" : ""}`}>
          <p>شماره‌ی سفارش: <b dir="ltr">{o.number}</b> (آن را نگه دارید)</p>
          <p>وضعیت: <b>{STATUS_LABEL[o.status] ?? o.status}</b></p>
          {stock && <p className="err">موجودی یکی از محصولات در لحظه‌ی پرداخت کافی نبود و سفارش لغو شد.</p>}
          {paid && <p>{c.name} عزیز، کارشناسان پیوند گستر پارسان برای هماهنگی ارسال و هزینه‌ی حمل با شما تماس می‌گیرند.</p>}
          <ul className="mini">{items.map((i) => <li key={i.name}><span>{i.name} × {toFa(i.qty)}</span><b>{toman(i.price * i.qty)}</b></li>)}</ul>
          <p className="bigp">{toman(o.total)}</p>
          <Link className="btn s" href="/shop">بازگشت به فروشگاه</Link>
        </div>
      </div></main>
    </SiteShell>
  );
}
