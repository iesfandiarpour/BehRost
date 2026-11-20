import { NextResponse, type NextRequest } from "next/server";

// بررسی سبک: بدون کوکی مدیر، به صفحه‌ی ورود می‌رود. بررسی کامل در requireAdmin انجام می‌شود.
export function proxy(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p !== "/admin/login" && !req.cookies.get("behrost_admin")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
