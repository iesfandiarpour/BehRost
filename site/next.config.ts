import type { NextConfig } from "next";

// Origins allowed to submit forms (Server Actions) through proxies such as Codespaces and Render.
// For a custom domain later, set ALLOWED_ORIGINS (e.g. behrost.ir,www.behrost.ir).
const extraOrigins = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((x) => x.trim()).filter(Boolean);
const allowedOrigins = ["localhost:3000", "*.app.github.dev", "*.onrender.com", ...extraOrigins];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.app.github.dev"],
  serverExternalPackages: ["better-sqlite3", "sharp"],
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
