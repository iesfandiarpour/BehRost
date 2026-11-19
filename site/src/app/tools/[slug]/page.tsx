import { notFound } from "next/navigation";
import Link from "next/link";
import ToolFrame from "@/components/tools/ToolFrame";
import WaterSoilTool from "@/components/tools/WaterSoilTool";
import NutrientCalc from "@/components/tools/NutrientCalc";
import { db, cropGuides } from "@/db";
import { TOOLS } from "@/lib/tools/registry";
import type { Guide } from "@/lib/tools/nutrient";

export const dynamic = "force-dynamic";

const REFS_WATER = [
  "Ayers, R.S. & Westcot, D.W. (1985). Water Quality for Agriculture. FAO Irrigation and Drainage Paper 29 Rev.1.",
  "Richards, L.A. (1954). Diagnosis and Improvement of Saline and Alkali Soils. USDA Agriculture Handbook 60.",
  "Shahbazi, K. & Besharati, H. (2013). Overview of agricultural soil fertility status of Iran. Land Management Journal.",
  "Lindsay, W.L. & Norvell, W.A. (1978). Development of a DTPA soil test for zinc, iron, manganese, and copper. SSSAJ 42:421-428.",
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = TOOLS.find((x) => x.slug === slug);
  return { title: t ? `${t.title} | بهرست` : "ابزار | بهرست" };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = TOOLS.find((t) => t.slug === slug);
  if (!meta) notFound();

  if (slug === "soil-water-interpretation") {
    return (
      <ToolFrame title={meta.title} desc={meta.desc} refs={REFS_WATER}>
        <WaterSoilTool />
      </ToolFrame>
    );
  }
  if (slug === "nutrient-solution") {
    const rows = db.select().from(cropGuides).all().filter((g) => g.published);
    const guides = rows.map((r) => ({ slug: r.slug, name: r.name, stages: r.stages, micro: r.micro })) as Guide[];
    return (
      <ToolFrame title={meta.title} desc={meta.desc} refs={["مقادیر از برچسب محصولات محلول غذایی بهرست (پیوند گستر پارسان) گرفته شده است."]}>
        <NutrientCalc guides={guides} />
      </ToolFrame>
    );
  }
  return (
    <ToolFrame title={meta.title} desc="این ابزار به‌زودی اضافه می‌شود.">
      <p><Link className="btn s" href="/tools">بازگشت به ابزارها</Link></p>
    </ToolFrame>
  );
}
