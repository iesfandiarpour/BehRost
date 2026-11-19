/**
 * لایه‌ی پرداخت. فعلاً فقط حالت آزمایشی (sandbox) فعال است و پولی جابه‌جا نمی‌شود.
 * بعداً درگاه واقعی (مثلاً زرین‌پال) این‌جا اضافه می‌شود.
 */
export const PAYMENT_MODE = process.env.PAYMENT_MODE ?? "sandbox";

export function paymentRedirect(orderNumber: string): string {
  if (PAYMENT_MODE === "sandbox") return `/pay/sandbox/${orderNumber}`;
  throw new Error("درگاه پرداخت واقعی هنوز تنظیم نشده است");
}

export const STATUS_LABEL: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  shipped: "ارسال‌شده",
  done: "تحویل‌شده",
  canceled: "لغو شده",
};
