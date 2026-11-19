/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import StepsGrid from "@/components/site/StepsGrid";
import { getProducts, getSections, getSetting, type Brand } from "@/lib/content";
import { toman } from "@/lib/format";

export const dynamic = "force-dynamic";

const ICONS: Record<string, string> = {
  flask: "🧪", droplets: "💧", map: "🗺️", thermometer: "🌡️", repeat: "🔁", leaf: "🍃", sprout: "🌱",
};
type Btn = { label: string; href: string };
type Hero = { eyebrow: string; titleLine1: string; titleLine2: string; text: string; primaryButton: Btn; secondaryButton: Btn };
type Steps = { title: string; subtitle: string; steps: { title: string; text: string }[] };
type Tools = { title: string; items: { slug: string; title: string; icon: string }[] };

const Leaf = ({ cls }: { cls: string }) => (
  <span className={`leaf ${cls}`}>
    <svg viewBox="0 0 24 24"><path d="M3 21C3 9 11 3 21 3c0 10-6 18-18 18z" /></svg>
  </span>
);

export default function Home() {
  const brand = getSetting<Brand>("brand");
  const secs = getSections("home");
  const by = <T,>(type: string) => secs.find((s) => s.type === type)?.data as T | undefined;
  const hero = by<Hero>("hero");
  const steps = by<Steps>("steps");
  const tools = by<Tools>("tools");
  const items = getProducts();

  return (
    <SiteShell>
      <main id="top">
        {hero && (
          <div className="hero">
            <div className="wrap">
              <div>
                <div className="eyebrow">{hero.eyebrow}</div>
                <h1>{hero.titleLine1}<br /><span>{hero.titleLine2}</span></h1>
                <p>{hero.text}</p>
                <div className="cta">
                  <Link className="btn p" href={hero.primaryButton.href}>{hero.primaryButton.label}</Link>
                  <Link className="btn s" href={hero.secondaryButton.href}>{hero.secondaryButton.label}</Link>
                </div>
              </div>
              <div className="stage">
                <div className="arch">
                  <div className="logo"><img src={brand.logo} alt={`لوگوی ${brand.name}`} /></div>
                </div>
                <Leaf cls="l1" /><Leaf cls="l2" /><Leaf cls="l3" />
              </div>
            </div>
          </div>
        )}

        <div className="trust">
          <div className="wrap">
            <span>مشاوره‌ی بهرست زیر نظر کارشناسان و متخصصان شرکت</span>
            <span className="chip"><img src={brand.companyLogo} alt={brand.company} /></span>
          </div>
        </div>

        {tools && (
          <section className="tools" id="tools">
            <div className="wrap">
              <h2>{tools.title}</h2>
              <p className="sub">ابزارهای علمی برای تصمیم‌گیری دقیق‌تر در تغذیه‌ی گیاه</p>
              <div className="grid">
                {tools.items.map((t) => (
                  <Link key={t.slug} className="tcard" href={`/tools/${t.slug}`}>
                    <i>{ICONS[t.icon] ?? "🌱"}</i>
                    <b>{t.title}</b>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {steps && (
          <section id="steps">
            <div className="wrap">
              <h2>{steps.title}</h2>
              <p className="sub">{steps.subtitle}</p>
              <StepsGrid steps={steps.steps} />
            </div>
          </section>
        )}

        <section id="shop" style={{ background: "var(--card)", borderBlock: "1px solid var(--line)" }}>
          <div className="wrap">
            <h2>فروشگاه بهرست</h2>
            <p className="sub">محلول‌های غذایی بهرست و کودهای NPK پیوند گستر پارسان</p>
            <div className="pgrid">
              {items.map((p) => (
                <Link key={p.id} className="pc" href={`/shop/${p.slug}`}>
                  <div className="im">{p.image && <img src={p.image} alt={p.name} />}</div>
                  <div className="b">
                    <h3>{p.name}</h3>
                    <div className="price">
                      {toman(p.price)}
                      {p.priceIsSample && <small>(قیمت نمونه)</small>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <p style={{ marginTop: 20 }}><Link className="btn s" href="/shop">مشاهده‌ی همه‌ی محصولات</Link></p>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
