import { readFile } from "node:fs/promises";
import path from "node:path";

const TYPES: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };

/** فایل‌های آپلودشده (عکس محصولات و مقاله‌ها) از پوشه‌ی uploads */
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const root = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "uploads");
  const file = path.resolve(root, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(file);
    return new Response(new Uint8Array(buf), { headers: { "content-type": type, "cache-control": "public, max-age=86400" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
