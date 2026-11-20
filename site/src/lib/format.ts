const FA = "۰۱۲۳۴۵۶۷۸۹";
export const toFa = (v: string | number) => String(v).replace(/\d/g, (d) => FA[+d]);
export const toman = (n: number) =>
  toFa(new Intl.NumberFormat("en-US").format(n).replace(/,/g, "٬")) + " تومان";
export const mobile = (m: string) => m; // بدون فاصله، ارقام لاتین مثل 09133839548
export const landline = (m: string) => m.replace(/^(\d{3})(\d{8})$/, "$1-$2"); // 034-31312012

import { format as jformat } from "date-fns-jalali";
/** تاریخ شمسی از ثانیه‌ی یونیکس، مثل ۱۴۰۵/۰۸/۲۸ ۱۴:۰۵ */
export const jdate = (sec: number) => toFa(jformat(new Date(sec * 1000), "yyyy/MM/dd HH:mm"));
/** عدد ورودی (با ارقام فارسی و جداکننده) را به عدد صحیح تبدیل می‌کند */
export const intFrom = (v: FormDataEntryValue | null) => {
  const t = String(v ?? "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[\s٬,،]/g, "");
  return /^\d+$/.test(t) ? Number(t) : NaN;
};
