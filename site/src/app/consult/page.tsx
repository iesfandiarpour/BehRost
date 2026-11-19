import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import StepsGrid from "@/components/site/StepsGrid";
import ConsultForm from "@/components/site/ConsultForm";
import { getSections } from "@/lib/content";

export const metadata = { title: "دریافت مشاوره | بهرست", description: "درخواست مشاوره‌ی تخصصی تغذیه‌ی گیاه برای گلخانه، باغ و مزرعه، زیر نظر کارشناسان پیوند گستر پارسان." };
export const dynamic = "force-dynamic";

export default function Consult() {
  const steps = getSections("home").find((s) => s.type === "steps")?.data as { title: string; subtitle: string; steps: { title: string; text: string }[] } | undefined;
  return (
    <SiteShell>
      <main className="page">
        <div className="wrap">
          <h1 className="ph1">دریافت مشاوره‌ی تخصصی</h1>
          <p className="sub">اطلاعات مزرعه یا گلخانه‌ی خود را ثبت کنید؛ مشاوره زیر نظر کارشناسان و متخصصان شرکت پیوند گستر پارسان انجام می‌شود.</p>
          {steps && <StepsGrid steps={steps.steps} />}
          <div className="split" style={{ marginTop: 40 }}>
            <ConsultForm />
            <div className="ctabox">
              <h3>پیش از ثبت درخواست</h3>
              <p>اگر نتیجه‌ی آزمایش آب و خاک دارید، آن را در بخش توضیحات بنویسید. اگر ندارید، با ابزار رایگان تفسیر آزمایش، وضعیت اولیه را ببینید.</p>
              <Link className="btn s" href="/tools/soil-water-interpretation">تفسیر آزمایش خاک و آب</Link>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
