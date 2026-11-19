import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";

export default function ToolFrame({ title, desc, refs, children }: { title: string; desc: string; refs?: string[]; children: React.ReactNode }) {
  return (
    <SiteShell>
      <main className="page">
        <div className="wrap">
          <nav className="crumb"><Link href="/">خانه</Link> / <Link href="/tools">ابزارها</Link></nav>
          <h1 className="ph1">{title}</h1>
          <p className="sub">{desc}</p>
          {children}
          <div className="note">
            نتیجه‌ی این ابزار راهنمای اولیه است و جایگزین نظر کارشناس نیست؛ توصیه‌ی نهایی کوددهی را کارشناسان پیوند گستر پارسان با توجه به شرایط مزرعه‌ی شما می‌دهند.
            {refs && refs.length > 0 && (
              <details><summary>مراجع علمی</summary><ul>{refs.map((r) => <li key={r} dir="auto">{r}</li>)}</ul></details>
            )}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
