import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, messages, orders } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { toFa } from "@/lib/format";

export default async function Panel({ children }: { children: React.ReactNode }) {
  const a = await requireAdmin();
  const unread = db.select().from(messages).where(eq(messages.read, false)).all().length;
  const paid = db.select().from(orders).where(eq(orders.status, "paid")).all().length;
  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <h2>پنل بهرست</h2>
        <Link href="/admin">داشبورد</Link>
        <Link href="/admin/products">محصولات</Link>
        <Link href="/admin/orders">سفارش‌ها{paid > 0 && <span className="ad-badge">{toFa(paid)}</span>}</Link>
        <Link href="/admin/messages">پیام‌ها{unread > 0 && <span className="ad-badge">{toFa(unread)}</span>}</Link>
        <Link href="/admin/content">متن صفحه‌ی اول و سئو</Link>
        <Link href="/admin/settings">اطلاعات تماس و تنظیمات</Link>
        <Link href="/admin/account">رمز عبور</Link>
        <div className="grow" />
        <Link href="/" target="_blank">مشاهده‌ی سایت ↗</Link>
        <form action={logout}><button>خروج ({a.username})</button></form>
      </aside>
      <main className="ad-main">{children}</main>
    </div>
  );
}
