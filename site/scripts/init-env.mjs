// ساخت فایل .env.local با کلیدها و رمز تصادفی (فقط اگر وجود نداشته باشد)
import { existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

if (existsSync(".env.local")) {
  console.log(".env.local از قبل هست؛ دست نمی‌زنم.");
  process.exit(0);
}
const pass = randomBytes(12).toString("base64url").slice(0, 14);
writeFileSync(
  ".env.local",
  [
    "DATABASE_URL=file:./data/app.db",
    `SESSION_SECRET=${randomBytes(32).toString("hex")}`,
    "ADMIN_USERNAME=admin",
    `INITIAL_ADMIN_PASSWORD=${pass}`,
    "SITE_URL=http://localhost:3000",
    "PAYMENT_MODE=sandbox",
    "PAYMENT_MERCHANT_ID=",
    "",
  ].join("\n"),
);
console.log("\n=====================================");
console.log(" نام کاربری پنل مدیریت: admin");
console.log(` رمز اولیه: ${pass}`);
console.log(" این رمز را یک‌جا یادداشت کنید.");
console.log("=====================================\n");
