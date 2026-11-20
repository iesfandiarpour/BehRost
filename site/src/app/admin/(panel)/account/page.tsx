import { changePassword } from "../../actions";

export default async function Account({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  return (
    <>
      <h1>تغییر رمز عبور</h1>
      {ok && <div className="ad-ok">{ok}</div>}
      {err && <div className="ad-err">{err}</div>}
      <div className="ad-card" style={{ maxWidth: 460 }}>
        <form action={changePassword} className="ad-form">
          <label className="ad-f"><span>رمز فعلی</span><input name="current" type="password" dir="ltr" required /></label>
          <label className="ad-f"><span>رمز جدید (حداقل ۱۰ کاراکتر)</span><input name="next" type="password" dir="ltr" required /></label>
          <label className="ad-f"><span>تکرار رمز جدید</span><input name="again" type="password" dir="ltr" required /></label>
          <button className="ad-btn">ذخیره‌ی رمز جدید</button>
        </form>
      </div>
    </>
  );
}
