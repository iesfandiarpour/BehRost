"use client";
import { useMemo, useState } from "react";
import { NumField, ConsultCta } from "./ui";
import { A_PER_L, AW, B_PER_L, type Guide } from "@/lib/tools/nutrient";
import { EQW } from "@/lib/tools/water";
import { fmt, parseNum } from "@/lib/tools/num";

const MACRO = ["N", "P", "K", "Ca", "Mg", "S"];
const MICRO = ["Fe", "Cu", "Mn", "Zn", "B", "Mo"];

export default function NutrientCalc({ guides }: { guides: Guide[] }) {
  const [ci, setCi] = useState(0);
  const [si, setSi] = useState(0);
  const [vol, setVol] = useState("500");
  const [wCa, setWCa] = useState("");
  const [wMg, setWMg] = useState("");
  const g = guides[ci];
  const stage = g.stages[Math.min(si, g.stages.length - 1)];
  const V = parseNum(vol) ?? 0;
  const calc = useMemo(() => {
    const ca = parseNum(wCa), mg = parseNum(wMg);
    return {
      // مقدار Ca و Mg آب (mg/L) به mmol/L
      waterCa: ca !== undefined ? ca / AW.Ca : 0,
      waterMg: mg !== undefined ? mg / AW.Mg : 0,
      has: ca !== undefined || mg !== undefined,
    };
  }, [wCa, wMg]);
  void EQW;

  return (
    <div className="tool">
      <div className="fgrid three">
        <label className="fld"><span>محصول</span>
          <select value={ci} onChange={(e) => { setCi(+e.target.value); setSi(0); }}>
            {guides.map((x, i) => <option key={x.slug} value={i}>{x.name}</option>)}
          </select></label>
        <label className="fld"><span>مرحله‌ی رشد</span>
          <select value={si} onChange={(e) => setSi(+e.target.value)}>
            {g.stages.map((x, i) => <option key={x.name} value={i}>{x.name}</option>)}
          </select></label>
        <NumField label="حجم محلول غذایی" unit="لیتر" value={vol} onChange={setVol} />
      </div>

      <div className="split">
        <div>
          <div className="big">
            <div><small>استوک A</small><b>{fmt(V * A_PER_L, 2)} لیتر</b></div>
            <div><small>استوک B</small><b>{fmt(V * B_PER_L, 2)} لیتر</b></div>
          </div>
          <p className="hint">نسبت مصرف طبق برچسب بهرست: ۲ لیتر استوک A و ۱ لیتر استوک B برای ۵۰۰ لیتر محلول. مقدار هر استوک را جداگانه داخل آب مخزن بریزید و خوب هم بزنید؛ استوک‌ها را غلیظ با هم مخلوط نکنید. بهتر است از آب تصفیه‌شده استفاده شود. طبق برچسب، pH محلول به تنظیم نیاز ندارد.</p>

          <h3 className="h3">آب آبیاری شما (اختیاری)</h3>
          <div className="fgrid">
            <NumField label="کلسیم آب" unit="mg/L" value={wCa} onChange={setWCa} />
            <NumField label="منیزیم آب" unit="mg/L" value={wMg} onChange={setWMg} />
          </div>
          <p className="hint">مقادیر برچسب، غلظت عناصر در خود محلول رقیق‌شده‌ی بهرست است. اگر آب شما کلسیم و منیزیم دارد، غلظت نهایی بیشتر می‌شود.</p>
        </div>

        <div>
          <table className="tbl">
            <thead><tr><th>عنصر</th><th>mmol/L</th><th>mg/L</th>{calc.has && <th>با احتساب آب (mg/L)</th>}</tr></thead>
            <tbody>
              {MACRO.map((e) => {
                const mm = stage.macro[e];
                const extra = e === "Ca" ? calc.waterCa : e === "Mg" ? calc.waterMg : 0;
                return (
                  <tr key={e}>
                    <td dir="ltr">{e}</td><td>{fmt(mm)}</td><td>{fmt(mm * AW[e], 1)}</td>
                    {calc.has && <td>{e === "Ca" || e === "Mg" ? fmt((mm + extra) * AW[e], 1) : "—"}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table className="tbl">
            <thead><tr><th>ریزمغذی</th><th>µmol/L</th><th>µg/L</th></tr></thead>
            <tbody>
              {MICRO.map((e) => (
                <tr key={e}><td dir="ltr">{e}</td><td>{fmt(g.micro[e])}</td><td>{fmt(g.micro[e] * AW[e], 0)}</td></tr>
              ))}
            </tbody>
          </table>
          <ConsultCta />
        </div>
      </div>
    </div>
  );
}
