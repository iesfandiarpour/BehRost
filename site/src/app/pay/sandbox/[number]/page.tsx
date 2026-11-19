import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import SiteShell from "@/components/site/SiteShell";
import { db, orders } from "@/db";
import { PAYMENT_MODE } from "@/lib/payment";
import { toman } from "@/lib/format";
import { finishSandbox } from "@/app/pay/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "پرداخت آزمایشی | بهرست" };

export default async function SandboxPay({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const o = PAYMENT_MODE === "sandbox" ? db.select().from(orders).where(eq(orders.number, number)).get() : undefined;
  if (!o) notFound();
  return (
    <SiteShell>
      <main className="page"><div className="wrap narrow">
        <h1 className="ph1">درگاه پرداخت آزمایشی</h1>
        <div className="warnbox">این صفحه شبیه‌سازی درگاه است و هیچ پولی جابه‌جا نمی‌شود. درگاه واقعی بعداً جایگزین می‌شود.</div>
        <div className="ctabox">
          <p>شماره‌ی سفارش: <b dir="ltr">{o.number}</b></p>
          <p className="bigp">{toman(o.total)}</p>
          <form className="addrow">
            <button className="btn p" formAction={finishSandbox.bind(null, o.number, "ok")}>پرداخت موفق (آزمایشی)</button>
            <button className="btn s" formAction={finishSandbox.bind(null, o.number, "fail")}>انصراف / پرداخت ناموفق</button>
          </form>
        </div>
      </div></main>
    </SiteShell>
  );
}
