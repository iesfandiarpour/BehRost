"use client";
import { useMemo, useState } from "react";
import { NumField, Results, ConsultCta } from "./ui";
import { EQW, interpretWater, sar, type WaterIn } from "@/lib/tools/water";
import { interpretSoil, type SoilIn } from "@/lib/tools/soil";
import { fmt, parseNum } from "@/lib/tools/num";

type Vals = Record<string, string>;
const WATER = [
  ["ec", "EC", "dS/m"], ["ph", "pH", ""], ["na", "سدیم (Na)", ""], ["ca", "کلسیم (Ca)", ""], ["mg", "منیزیم (Mg)", ""],
  ["cl", "کلر (Cl)", ""], ["hco3", "بی‌کربنات (HCO₃)", ""], ["b", "بور (B)", "mg/L"], ["no3n", "نیترات‌نیتروژن (NO₃-N)", "mg/L"],
] as const;
const SOIL = [
  ["ec", "EC عصاره‌ی اشباع", "dS/m"], ["ph", "pH گل اشباع", ""], ["oc", "کربن آلی", "٪"], ["cce", "کربنات کلسیم معادل", "٪"], ["esp", "ESP (اختیاری)", "٪"],
  ["p", "فسفر قابل جذب (اولسن)", "mg/kg"], ["k", "پتاسیم قابل جذب (استات آمونیوم)", "mg/kg"],
  ["zn", "روی (DTPA)", "mg/kg"], ["fe", "آهن (DTPA)", "mg/kg"], ["mn", "منگنز (DTPA)", "mg/kg"], ["cu", "مس (DTPA)", "mg/kg"],
] as const;

export default function WaterSoilTool() {
  const [tab, setTab] = useState<"water" | "soil">("water");
  const [unit, setUnit] = useState<"meq" | "mg">("meq");
  const [w, setW] = useState<Vals>({});
  const [s, setS] = useState<Vals>({});

  const water = useMemo(() => {
    const n = (k: string) => parseNum(w[k] ?? "");
    const ion = (k: keyof typeof EQW) => { const v = n(k); return v === undefined ? undefined : unit === "mg" ? v / EQW[k] : v; };
    const input: WaterIn = { ec: n("ec"), ph: n("ph"), na: ion("na"), ca: ion("ca"), mg: ion("mg"), cl: ion("cl"), hco3: ion("hco3"), b: n("b"), no3n: n("no3n") };
    return { input, items: interpretWater(input) };
  }, [w, unit]);
  const soil = useMemo(() => {
    const input: SoilIn = {};
    for (const [k] of SOIL) input[k] = parseNum(s[k] ?? "");
    return interpretSoil(input);
  }, [s]);

  const S = sar(water.input);
  return (
    <div className="tool">
      <div className="tabs">
        <button className={tab === "water" ? "on" : ""} onClick={() => setTab("water")}>آزمایش آب</button>
        <button className={tab === "soil" ? "on" : ""} onClick={() => setTab("soil")}>آزمایش خاک</button>
      </div>
      <div className="split">
        <div>
          {tab === "water" ? (
            <>
              <div className="unitrow">واحد یون‌ها (Na، Ca، Mg، Cl، HCO₃):
                <button className={unit === "meq" ? "on" : ""} onClick={() => setUnit("meq")}>meq/L</button>
                <button className={unit === "mg" ? "on" : ""} onClick={() => setUnit("mg")}>mg/L</button>
              </div>
              <div className="fgrid">
                {WATER.map(([k, label, u]) => (
                  <NumField key={k} label={label} unit={u || (["na", "ca", "mg", "cl", "hco3"].includes(k) ? (unit === "meq" ? "meq/L" : "mg/L") : "")}
                    value={w[k] ?? ""} onChange={(v) => setW({ ...w, [k]: v })} />
                ))}
              </div>
            </>
          ) : (
            <div className="fgrid">
              {SOIL.map(([k, label, u]) => (
                <NumField key={k} label={label} unit={u} value={s[k] ?? ""} onChange={(v) => setS({ ...s, [k]: v })} />
              ))}
            </div>
          )}
          <p className="hint">فقط مقدارهایی را که دارید وارد کنید؛ بقیه خالی بماند. اعداد را می‌توانید با ارقام فارسی بنویسید.</p>
        </div>
        <div>
          <Results items={tab === "water" ? water.items : soil} />
          {tab === "water" && S !== undefined && <p className="hint">SAR محاسبه‌شده: {fmt(S)}</p>}
          <ConsultCta />
        </div>
      </div>
    </div>
  );
}
