import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { TOOLS } from "@/lib/tools/registry";

export const dynamic = "force-dynamic";
export const metadata = { title: "ابزارهای رایگان | بهرست" };

export default function ToolsIndex() {
  return (
    <SiteShell>
      <main className="page">
        <div className="wrap">
          <h1 className="ph1">ابزارهای رایگان بهرست</h1>
          <p className="sub">ابزارهای علمی برای تصمیم‌گیری دقیق‌تر در تغذیه‌ی گیاه</p>
          <div className="pgrid">
            {TOOLS.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="pc" style={{ opacity: t.ready ? 1 : 0.65 }}>
                <div className="b">
                  <div style={{ fontSize: "2rem" }}>{t.icon}</div>
                  <h3>{t.title}</h3>
                  <p className="sub" style={{ margin: 0 }}>{t.desc}</p>
                  {!t.ready && <small>به‌زودی</small>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
