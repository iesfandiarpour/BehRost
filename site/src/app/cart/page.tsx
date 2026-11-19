import SiteShell from "@/components/site/SiteShell";
import CartView from "@/components/shop/CartView";

export const metadata = { title: "سبد خرید | بهرست" };
export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <SiteShell>
      <main className="page"><div className="wrap"><h1 className="ph1">سبد خرید</h1><CartView /></div></main>
    </SiteShell>
  );
}
