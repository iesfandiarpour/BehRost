"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: number; qty: number };
type Ctx = {
  items: CartItem[]; count: number; ready: boolean;
  add: (id: number, qty?: number) => void; setQty: (id: number, qty: number) => void;
  remove: (id: number) => void; clear: () => void;
};
const KEY = "behrost-cart";
const C = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch { /* سبد خالی */ }
    setReady(true);
  }, []);
  const save = useCallback((next: CartItem[]) => {
    setItems(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ذخیره نشد؛ فقط در همین صفحه می‌ماند */ }
  }, []);
  const value = useMemo<Ctx>(() => ({
    items, ready, count: items.reduce((n, i) => n + i.qty, 0),
    add: (id, qty = 1) => save(items.some((i) => i.id === id) ? items.map((i) => (i.id === id ? { ...i, qty: Math.min(50, i.qty + qty) } : i)) : [...items, { id, qty }]),
    setQty: (id, qty) => save(items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(50, qty)) } : i))),
    remove: (id) => save(items.filter((i) => i.id !== id)),
    clear: () => save([]),
  }), [items, ready, save]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
export function useCart() {
  const c = useContext(C);
  if (!c) throw new Error("CartProvider پیدا نشد");
  return c;
}
