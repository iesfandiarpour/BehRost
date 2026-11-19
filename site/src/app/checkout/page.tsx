import SiteShell from "@/components/site/SiteShell";
import CheckoutForm from "@/components/shop/CheckoutForm";
import { PAYMENT_MODE } from "@/lib/payment";

export const metadata = { title: "ثبت سفارش | بهرست" };
export const dynamic = "force-dynamic";

export default function Checkout() {
  return (
    <SiteShell>
      <main className="page"><div className="wrap"><h1 className="ph1">ثبت سفارش</h1><CheckoutForm sandbox={PAYMENT_MODE === "sandbox"} /></div></main>
    </SiteShell>
  );
}
