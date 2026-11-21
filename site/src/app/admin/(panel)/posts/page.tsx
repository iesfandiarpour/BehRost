import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, posts } from "@/db";
import { jday } from "@/lib/format";

export default async function PostsAdmin({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const list = db.select().from(posts).orderBy(desc(posts.id)).all();
  return (
    <>
      <h1>مقاله‌های بلاگ</h1>
      {ok && <div className="ad-ok">{ok}</div>}
      <p><Link className="ad-btn" href="/admin/posts/new">+ مقاله‌ی جدید</Link></p>
      <table className="ad-table">
        <thead><tr><th>عنوان</th><th>وضعیت</th><th>تاریخ انتشار</th></tr></thead>
        <tbody>
          {list.length === 0 && <tr><td colSpan={3} className="ad-muted">هنوز مقاله‌ای ننوشته‌اید.</td></tr>}
          {list.map((p) => (
            <tr key={p.id}>
              <td><Link href={`/admin/posts/${p.id}`}>{p.title}</Link></td>
              <td>{p.published ? "منتشر شده" : "پیش‌نویس"}</td>
              <td>{p.publishedAt ? jday(p.publishedAt) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
