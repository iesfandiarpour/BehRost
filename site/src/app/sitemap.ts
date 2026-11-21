import type { MetadataRoute } from "next";
import { getPosts, getProducts } from "@/lib/content";

export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const fixed = ["", "/shop", "/tools", "/consult", "/blog"].map((p) => ({ url: base + p }));
  return [
    ...fixed,
    ...getProducts().map((p) => ({ url: `${base}/shop/${p.slug}` })),
    ...getPosts().map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.publishedAt ? new Date(p.publishedAt * 1000) : undefined })),
  ];
}
