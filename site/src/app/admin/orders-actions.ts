"use server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, messages, orders } from "@/db";
import { requireAdmin } from "@/lib/auth";

const ST = ["pending", "paid", "shipped", "done", "canceled"];
export async function setOrderStatus(fd: FormData) {
  await requireAdmin();
  const number = String(fd.get("number")), status = String(fd.get("status"));
  if (!ST.includes(status)) redirect(`/admin/orders/${number}?err=${encodeURIComponent("وضعیت نامعتبر")}`);
  db.update(orders).set({ status }).where(eq(orders.number, number)).run();
  redirect(`/admin/orders/${number}?ok=${encodeURIComponent("وضعیت ذخیره شد")}`);
}
export async function setMessageRead(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  db.update(messages).set({ read: fd.get("read") === "1" }).where(eq(messages.id, id)).run();
  redirect(`/admin/messages/${id}`);
}
