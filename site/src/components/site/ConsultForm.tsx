"use client";
import { useActionState } from "react";
import { submitConsult, type ConsultState } from "@/app/consult/actions";

const init: ConsultState = { ok: false };

export default function ConsultForm() {
  const [st, action, pending] = useActionState(submitConsult, init);
  if (st.ok) {
    return (
      <div className="ctabox okbox">
        <h3>درخواست شما ثبت شد</h3>
        <p>کارشناسان پیوند گستر پارسان پس از بررسی اطلاعات، با شما تماس می‌گیرند.</p>
      </div>
    );
  }
  const v = (k: string) => st.values?.[k] ?? "";
  const err = (k: string) => st.fields?.[k] && <small className="err">{st.fields[k]}</small>;
  return (
    <form action={action} className="cform">
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="fgrid">
        <label className="fld"><span>نام و نام خانوادگی</span><input name="name" defaultValue={v("name")} required />{err("name")}</label>
        <label className="fld"><span>شماره‌ی موبایل</span><input name="phone" defaultValue={v("phone")} dir="ltr" inputMode="tel" required placeholder="09123456789" />{err("phone")}</label>
        <label className="fld"><span>نوع کشت</span>
          <select name="farmType" defaultValue={v("farmType")}><option value="" disabled>انتخاب کنید</option>
            <option value="greenhouse">گلخانه</option><option value="orchard">باغ</option><option value="field">مزرعه</option></select>{err("farmType")}</label>
        <label className="fld"><span>محصول</span><input name="crop" defaultValue={v("crop")} placeholder="مثلاً خیار، گوجه‌فرنگی، پسته" /></label>
        <label className="fld"><span>منطقه (شهر و روستا)</span><input name="region" defaultValue={v("region")} /></label>
        <label className="fld"><span>نوع خاک یا بستر کشت</span><input name="soil" defaultValue={v("soil")} placeholder="مثلاً لوم‌شنی، کوکوپیت" /></label>
        <label className="fld"><span>منبع آب</span><input name="water" defaultValue={v("water")} placeholder="مثلاً چاه، قنات" /></label>
      </div>
      <label className="fld"><span>توضیحات (نتایج آزمایش آب و خاک، مشکل فعلی، ...)</span><textarea name="note" defaultValue={v("note")} rows={5} /></label>
      {st.error && <p className="err">{st.error}</p>}
      <button className="btn p" disabled={pending}>{pending ? "در حال ارسال…" : "ثبت درخواست مشاوره"}</button>
    </form>
  );
}
