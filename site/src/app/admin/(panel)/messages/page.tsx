import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, messages } from "@/db";
import { jdate } from "@/lib/format";

export default function MessagesAdmin() {
  const list = db.select().from(messages).orderBy(desc(messages.id)).all();
  return (
    <>
      <h1>پیام‌ها و درخواست‌های مشاوره</h1>
      <table className="ad-table">
        <thead><tr><th>تاریخ</th><th>نوع</th><th>نام</th><th>موبایل</th><th>خلاصه</th></tr></thead>
        <tbody>
          {list.length === 0 && <tr><td colSpan={5} className="ad-muted">پیامی نیست.</td></tr>}
          {list.map((m) => (
            <tr key={m.id} className={m.read ? "" : "unread"}>
              <td>{jdate(m.createdAt)}</td>
              <td>{m.kind === "consult" ? "مشاوره" : "تماس"}</td>
              <td><Link href={`/admin/messages/${m.id}`}>{m.name}</Link></td>
              <td dir="ltr">{m.phone}</td>
              <td>{m.body.slice(0, 60)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
