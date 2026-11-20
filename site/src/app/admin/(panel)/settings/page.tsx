import { getSetting, type Brand, type Contact } from "@/lib/content";
import { saveSettings } from "../../content-actions";

export default async function SettingsAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  const c = getSetting<Contact & { hours?: string }>("contact"), b = getSetting<Brand>("brand");
  const soc = getSetting<{ instagram: string; website: string }>("social"), f = getSetting<{ about: string }>("footer");
  return (
    <>
      <h1>اطلاعات تماس و تنظیمات</h1>
      {ok && <div className="ad-ok">{ok}</div>}
      {err && <div className="ad-err">{err}</div>}
      <form action={saveSettings} className="ad-card ad-form">
        <div className="ad-row">
          <label className="ad-f"><span>شماره‌های موبایل (هر خط یک شماره)</span><textarea name="mobiles" dir="ltr" rows={4} defaultValue={c.mobiles.join("\n")} /></label>
          <label className="ad-f"><span>شماره‌های ثابت (با کد شهر، بدون خط تیره)</span><textarea name="landlines" dir="ltr" rows={4} defaultValue={c.landlines.join("\n")} /></label>
        </div>
        <label className="ad-f"><span>آدرس</span><input name="address" defaultValue={c.address} /></label>
        <div className="ad-row">
          <label className="ad-f"><span>ایمیل</span><input name="email" dir="ltr" defaultValue={c.email} /></label>
          <label className="ad-f"><span>ساعت کاری</span><input name="hours" defaultValue={c.hours ?? ""} /></label>
          <label className="ad-f"><span>اینستاگرام (بدون @)</span><input name="instagram" dir="ltr" defaultValue={soc.instagram} /></label>
          <label className="ad-f"><span>وب‌سایت شرکت</span><input name="website" dir="ltr" defaultValue={soc.website} /></label>
        </div>
        <label className="ad-f"><span>جمله‌ی نظارت کارشناسان</span><input name="supervision" defaultValue={b.supervision} /></label>
        <label className="ad-f"><span>متن «درباره‌ی ما» در فوتر</span><textarea name="about" rows={3} defaultValue={f.about} /></label>
        <div><button className="ad-btn">ذخیره</button></div>
      </form>
    </>
  );
}
