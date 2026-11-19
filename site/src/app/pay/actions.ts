"use server";
import { and, eq, gte, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, orders, products } from "@/db";
import { PAYMENT_MODE } from "@/lib/payment";

type Line = { productId: number; qty: number };

/** نتیجه‌ی پرداخت آزمایشی؛ در حالت واقعی همین منطق بعد از تأیید درگاه اجرا می‌شود */
export async function finishSandbox(number: string, outcome: "ok" | "fail") {
  if (PAYMENT_MODE !== "sandbox") throw new Error("حالت آزمایشی فعال نیست");
  const order = db.select().from(orders).where(eq(orders.number, number)).get();
  if (!order || order.status !== "pending") redirect(`/order/${number}`);
  if (outcome === "fail") {
    db.update(orders).set({ status: "canceled" }).where(eq(orders.id, order.id)).run();
    redirect(`/order/${number}`);
  }
  let okPaid = true;
  try {
    db.transaction((tx) => {
      for (const l of order.items as Line[]) {
        const r = tx.update(products).set({ stock: sql`${products.stock} - ${l.qty}` })
          .where(and(eq(products.id, l.productId), gte(products.stock, l.qty))).run();
        if (r.changes === 0) throw new Error("out-of-stock");
      }
      tx.update(orders).set({ status: "paid", paymentRef: "SANDBOX-" + number }).where(eq(orders.id, order.id)).run();
    });
  } catch {
    okPaid = false;
    db.update(orders).set({ status: "canceled" }).where(eq(orders.id, order.id)).run();
  }
  redirect(`/order/${number}${okPaid ? "" : "?stock=1"}`);
}
