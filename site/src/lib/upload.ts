import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/** عکس آپلودشده را کوچک و WebP می‌کند و مسیر عمومی آن را برمی‌گرداند (/media/<dir>/...) */
export async function saveImage(file: File, dir: string): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("عکس باید JPG، PNG یا WebP باشد");
  if (file.size > 5 * 1024 * 1024) throw new Error("حجم عکس باید کمتر از ۵ مگابایت باشد");
  const folder = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "uploads", dir);
  await mkdir(folder, { recursive: true });
  const name = randomBytes(8).toString("hex") + ".webp";
  await sharp(Buffer.from(await file.arrayBuffer())).rotate().resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(folder, name));
  return `/media/${dir}/${name}`;
}
