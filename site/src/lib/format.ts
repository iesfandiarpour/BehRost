const FA = "۰۱۲۳۴۵۶۷۸۹";
export const toFa = (v: string | number) => String(v).replace(/\d/g, (d) => FA[+d]);
export const toman = (n: number) =>
  toFa(new Intl.NumberFormat("en-US").format(n).replace(/,/g, "٬")) + " تومان";
export const mobile = (m: string) => m; // بدون فاصله، ارقام لاتین مثل 09133839548
export const landline = (m: string) => m.replace(/^(\d{3})(\d{8})$/, "$1-$2"); // 034-31312012
