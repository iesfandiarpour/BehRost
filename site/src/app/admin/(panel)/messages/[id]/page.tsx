import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, messages } from "@/db";
import { jdate } from "@/lib/format";
import { setMessageRead } from "../../../orders-actions";

const FARM: Record<string, string> = { greenhouse: "گلخانه", orchard: "باغ", field: "مزرعه" };
const LABEL: Record<string, string> = { farmType: "نوع کشت", crop: "محصول", region: "منطقه", soil: "خاک یا بستر", water: "منبع آب" };

export default async function MessageAdmin({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const m = db.select().from(messages).where(eq(messages.id, id)).get();
  if (!m) notFound();
  if (!m.read) db.update(messages).set({ read: true }).where(eq(messages.id, id)).run();
  const payload = (m.payload ?? {}) as Record<string, string>;
  return (
    <>
      <h1>{m.kind === "consult" ? "درخواست مشاوره" : "پیام تماس"}</h1>
      <div className="ad-card">
        <p><b>{m.name}</b> — <a href={`tel:${m.phone}`} dir="ltr">{m.phone}</a> {m.email && <span dir="ltr">— {m.email}</span>}</p>
        <p className="ad-muted">{jdate(m.createdAt)}</p>
        {Object.entries(payload).filter(([, v]) => v).map(([k, v]) => <p key={k}>{LABEL[k] ?? k}: <b>{k === "farmType" ? FARM[v] ?? v : v}</b></p>)}
        {m.body && <p style={{ whiteSpace: "pre-wrap" }}>{m.body}</p>}
        <form action={setMessageRead} style={{ display: "flex", gap: 10 }}>
          <input type="hidden" name="id" value={m.id} /><input type="hidden" name="read" value="0" />
          <button className="ad-btn alt">علامت‌گذاری به‌عنوان خوانده‌نشده</button>
          <Link className="ad-btn alt" href="/admin/messages">بازگشت</Link>
        </form>
      </div>
    </>
  );
}
