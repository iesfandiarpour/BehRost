// آماده‌سازی دیتابیس هنگام راه‌اندازی روی هاست: جدول‌ها را می‌سازد و اگر محتوایی نبود، محتوای اولیه را می‌ریزد
import { mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import Database from "better-sqlite3";

const file = (process.env.DATABASE_URL ?? "file:./data/app.db").replace(/^file:/, "");
mkdirSync("data", { recursive: true });
mkdirSync("uploads", { recursive: true });

execSync("npx drizzle-kit push --force", { stdio: "inherit" });

// ملاک «خالی بودن»، نبودن تنظیمات سایت است (فایل دیتابیس ممکن است هنگام build ساخته شده باشد)
const db = new Database(file);
const rows = db.prepare("select count(*) as c from site_settings").get().c;
db.close();
if (rows === 0) execSync("npx tsx scripts/seed.ts", { stdio: "inherit" });
else console.log("دیتابیس محتوا دارد؛ دست‌نخورده ماند.");
