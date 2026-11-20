import { eq } from "drizzle-orm";
import { db, pageSeo, sections } from "@/db";
import { saveHero, saveSeo, saveSteps, saveTools } from "../../content-actions";

type Hero = { eyebrow: string; titleLine1: string; titleLine2: string; text: string; primaryButton: { label: string; href: string }; secondaryButton: { label: string; href: string } };
type Steps = { title: string; subtitle: string; steps: { title: string; text: string }[] };

export default async function ContentAdmin({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const all = db.select().from(sections).all().filter((r) => r.page === "home");
  const row = (t: string) => all.find((r) => r.type === t);
  const hero = row("hero")?.data as Hero | undefined, steps = row("steps")?.data as Steps | undefined, tools = row("tools")?.data as { title: string } | undefined;
  const seo = db.select().from(pageSeo).where(eq(pageSeo.path, "/")).get();
  return (
    <>
      <h1>متن صفحه‌ی اول و سئو</h1>
      {ok && <div className="ad-ok">{ok}</div>}
      {hero && (
        <form action={saveHero} className="ad-card ad-form">
          <h3 style={{ margin: 0 }}>بالای صفحه (هیرو)</h3>
          <div className="ad-row">
            <label className="ad-f"><span>سطر کوچک بالای تیتر</span><input name="eyebrow" defaultValue={hero.eyebrow} /></label>
            <label className="ad-f"><span>تیتر، سطر اول</span><input name="titleLine1" defaultValue={hero.titleLine1} /></label>
            <label className="ad-f"><span>تیتر، سطر دوم (سبز)</span><input name="titleLine2" defaultValue={hero.titleLine2} /></label>
          </div>
          <label className="ad-f"><span>متن زیر تیتر</span><textarea name="text" rows={3} defaultValue={hero.text} /></label>
          <div className="ad-row">
            <label className="ad-f"><span>دکمه‌ی اصلی: نوشته</span><input name="pLabel" defaultValue={hero.primaryButton.label} /></label>
            <label className="ad-f"><span>دکمه‌ی اصلی: لینک</span><input name="pHref" dir="ltr" defaultValue={hero.primaryButton.href} /></label>
            <label className="ad-f"><span>دکمه‌ی دوم: نوشته</span><input name="sLabel" defaultValue={hero.secondaryButton.label} /></label>
            <label className="ad-f"><span>دکمه‌ی دوم: لینک</span><input name="sHref" dir="ltr" defaultValue={hero.secondaryButton.href} /></label>
          </div>
          <label className="ad-chk"><input type="checkbox" name="visible" defaultChecked={row("hero")?.visible} /> نمایش داده شود</label>
          <div><button className="ad-btn">ذخیره</button></div>
        </form>
      )}
      {steps && (
        <form action={saveSteps} className="ad-card ad-form">
          <h3 style={{ margin: 0 }}>مراحل مشاوره</h3>
          <div className="ad-row">
            <label className="ad-f"><span>عنوان بخش</span><input name="title" defaultValue={steps.title} /></label>
            <label className="ad-f"><span>زیرعنوان</span><input name="subtitle" defaultValue={steps.subtitle} /></label>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div className="ad-row" key={i}>
              <label className="ad-f"><span>مرحله‌ی {i + 1}: عنوان</span><input name={`t${i + 1}`} defaultValue={steps.steps[i]?.title ?? ""} /></label>
              <label className="ad-f"><span>مرحله‌ی {i + 1}: توضیح</span><input name={`x${i + 1}`} defaultValue={steps.steps[i]?.text ?? ""} /></label>
            </div>
          ))}
          <label className="ad-chk"><input type="checkbox" name="visible" defaultChecked={row("steps")?.visible} /> نمایش داده شود</label>
          <div><button className="ad-btn">ذخیره</button></div>
        </form>
      )}
      {tools && (
        <form action={saveTools} className="ad-card ad-form">
          <h3 style={{ margin: 0 }}>بخش ابزارها</h3>
          <label className="ad-f"><span>عنوان بخش</span><input name="title" defaultValue={tools.title} /></label>
          <label className="ad-chk"><input type="checkbox" name="visible" defaultChecked={row("tools")?.visible} /> نمایش داده شود</label>
          <div><button className="ad-btn">ذخیره</button></div>
        </form>
      )}
      <form action={saveSeo} className="ad-card ad-form">
        <h3 style={{ margin: 0 }}>سئو صفحه‌ی اول (گوگل)</h3>
        <label className="ad-f"><span>عنوان صفحه (حدود ۶۰ حرف)</span><input name="title" defaultValue={seo?.title ?? ""} /></label>
        <label className="ad-f"><span>توضیح کوتاه (حدود ۱۶۰ حرف)</span><textarea name="description" rows={3} defaultValue={seo?.description ?? ""} /></label>
        <div><button className="ad-btn">ذخیره</button></div>
      </form>
    </>
  );
}
