/** وزن اتمی عناصر برای تبدیل mmol/L به mg/L */
export const AW: Record<string, number> = {
  N: 14.007, P: 30.974, K: 39.098, Ca: 40.078, Mg: 24.305, S: 32.06,
  Fe: 55.845, Cu: 63.546, Mn: 54.938, Zn: 65.38, B: 10.81, Mo: 95.95,
};
/** طبق برچسب محصول: ۲ لیتر استوک A + ۱ لیتر استوک B برای ۵۰۰ لیتر محلول غذایی */
export const A_PER_L = 2 / 500;
export const B_PER_L = 1 / 500;

export type Guide = {
  slug: string; name: string;
  stages: { name: string; macro: Record<string, number> }[];
  micro: Record<string, number>;
};
