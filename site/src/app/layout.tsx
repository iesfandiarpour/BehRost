import type { Metadata } from "next";
import { DirectionProvider } from "@radix-ui/react-direction";
import "./globals.css";

export const metadata: Metadata = {
  title: "بهرست | مشاوره و تغذیه‌ی تخصصی گیاه",
  description:
    "مشاوره‌ی رایگان و تخصصی کوددهی برای گلخانه، باغ و مزرعه، ابزارهای تفسیر آزمایش خاک و آب، و فروش کودهای NPK و محلول‌های غذایی بهرست.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <DirectionProvider dir="rtl">{children}</DirectionProvider>
      </body>
    </html>
  );
}
