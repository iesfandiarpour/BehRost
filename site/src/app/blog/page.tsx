/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { getPosts } from "@/lib/content";
import { jday } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "بلاگ | بهرست", description: "مقاله‌های آموزشی تغذیه‌ی گیاه، کوددهی گلخانه و باغ، از کارشناسان پیوند گستر پارسان." };

export default function Blog() {
  const list = getPosts();
  return (
    <SiteShell>
      <main className="page"><div className="wrap">
        <h1 className="ph1">بلاگ بهرست</h1>
        <p className="sub">مقاله‌های آموزشی تغذیه‌ی گیاه و کوددهی</p>
        {list.length === 0 && <p className="empty">مقاله‌های آموزشی به‌زودی اینجا منتشر می‌شوند.</p>}
        <div className="pgrid">
          {list.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="pc blogcard">
              {p.cover && <div className="im" style={{ aspectRatio: "16/10" }}><img src={p.cover} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
              <div className="b"><small className="cat">{p.publishedAt ? jday(p.publishedAt) : ""}</small><h3>{p.title}</h3><p className="sub pexcerpt" style={{ margin: 0 }}>{p.excerpt}</p></div>
            </Link>
          ))}
        </div>
      </div></main>
    </SiteShell>
  );
}
