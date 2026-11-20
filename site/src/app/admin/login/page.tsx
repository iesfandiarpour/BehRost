import { login } from "../actions";

export default async function Login({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  return (
    <div className="ad-login">
      <div className="ad-card">
        <h1 style={{ marginTop: 0 }}>ورود به پنل بهرست</h1>
        {err && <div className="ad-err">{err}</div>}
        <form action={login} className="ad-form">
          <label className="ad-f"><span>نام کاربری</span><input name="username" dir="ltr" autoComplete="username" required /></label>
          <label className="ad-f"><span>رمز عبور</span><input name="password" type="password" dir="ltr" autoComplete="current-password" required /></label>
          <button className="ad-btn">ورود</button>
        </form>
      </div>
    </div>
  );
}
