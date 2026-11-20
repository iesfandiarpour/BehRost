import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, messages, orders, products } from "@/db";
import { toFa } from "@/lib/format";

export default function Dashboard() {
  const prods = db.select().from(products).all();
  const unread = db.select().from(messages).where(eq(messages.read, false)).all().length;
  const ord = db.select().from(orders).all();
  const sample = prods.filter((p) => p.priceIsSample && p.published).length;
  const low = prods.filter((p) => p.published && p.stock < 10);
  return (
    <>
      <h1>داشبورد</h1>
      {sample > 0 && <div className="ad-warn">{toFa(sample)} محصول هنوز «قیمت نمونه» دارد. قبل از انتشار واقعی، قیمت‌ها را در بخش <Link href="/admin/products">محصولات</Link> اصلاح کنید.</div>}
      <div className="ad-grid">
        <Link className="ad-stat" href="/admin/messages"><b>{toFa(unread)}</b>پیام خوانده‌نشده</Link>
        <Link className="ad-stat" href="/admin/orders?s=paid"><b>{toFa(ord.filter((o) => o.status === "paid").length)}</b>سفارش پرداخت‌شده (در انتظار ارسال)</Link>
        <Link className="ad-stat" href="/admin/orders?s=pending"><b>{toFa(ord.filter((o) => o.status === "pending").length)}</b>سفارش در انتظار پرداخت</Link>
        <Link className={`ad-stat ${low.length ? "warn" : ""}`} href="/admin/products"><b>{toFa(low.length)}</b>محصول با موجودی کم (کمتر از ۱۰)</Link>
      </div>
    </>
  );
}
