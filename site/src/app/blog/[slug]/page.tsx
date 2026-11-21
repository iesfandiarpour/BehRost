/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/site/SiteShell";
import { getPost } from "@/lib/content";
import { jday } from "@/lib/format";
import { renderContent } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p || !p.published) return { title: "مقاله | بهرست" };
  return { title: `${p.title} | بهرست`, description: p.excerpt || undefined, openGraph: p.cover ? { images: [p.cover] } : undefined };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p || !p.published) notFound();
  return (
    <SiteShell>
      <main className="page"><div className="wrap narrow2">
        <nav className="crumb"><Link href="/">خانه</Link> / <Link href="/blog">بلاگ</Link></nav>
        <h1 className="ph1 posttitle">{p.title}</h1>
        {p.publishedAt && <p className="sub">{jday(p.publishedAt)}</p>}
        {p.cover && <img className="postcover" src={p.cover} alt={p.title} />}
        <article className="prose">{renderContent(p.content)}</article>
        <div className="ctabox" style={{ marginTop: 28 }}>
          <h3>برنامه‌ی کوددهی اختصاصی می‌خواهید؟</h3>
          <p>اطلاعات مزرعه یا گلخانه‌ی خود را برای کارشناسان پیوند گستر پارسان بفرستید.</p>
          <Link className="btn p" href="/consult">دریافت مشاوره</Link>
        </div>
      </div></main>
    </SiteShell>
  );
}
