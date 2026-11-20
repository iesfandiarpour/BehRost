import type { NextConfig } from "next";

// دامنه‌هایی که فرم‌ها (Server Actions) اجازه‌ی ارسال از آن‌ها را دارند.
// Codespaces و Render درخواست را از پراکسی رد می‌کنند و بدون این فهرست، فرم‌ها خطای «Invalid Server Actions request» می‌دهند.
// برای دامنه‌ی اختصاصی بعدی، در متغیر ALLOWED_ORIGINS بنویسید (مثلاً behrost.ir,www.behrost.ir).
const extraOrigins = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((x) => x.trim()).filter(Boolean);
const allowedOrigins = ["*.app.github.dev", "*.onrender.com", ...extraOrigins];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.app.github.dev"],
  // better-sqlite3 is a native module and must stay outside the bundle
  serverExternalPackages: ["better-sqlite3", "sharp"],
  // آپلود عکس محصول (حداکثر ۵ مگابایت)
  experimental: { serverActions: { bodySizeLimit: "6mb", allowedOrigins } },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
