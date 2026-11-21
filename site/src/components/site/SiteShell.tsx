/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import "../../app/site.css";
import { getSetting, type Brand, type Contact } from "@/lib/content";
import { landline, mobile, toFa } from "@/lib/format";
import FitocodeCredit from "./FitocodeCredit";
import { CartProvider } from "@/components/shop/CartContext";
import CartLink from "@/components/shop/CartLink";

// شماره‌ها چپ‌به‌راست و بدون به‌هم‌ریختگی در متن راست‌چین نمایش داده می‌شوند
const numbers = (list: string[]) =>
  list.map((n, i) => (
    <span key={n}>
      {i > 0 && " ، "}
      <a href={`tel:${n.replace(/\D/g, "")}`}><bdi dir="ltr">{n}</bdi></a>
    </span>
  ));

const NAV = [
  ["خانه", "/"],
  ["مشاوره", "/consult"],
  ["ابزارها", "/tools"],
  ["فروشگاه", "/shop"],
  ["بلاگ", "/blog"],
  ["تماس", "/#contact"],
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const brand = getSetting<Brand>("brand");
  const contact = getSetting<Contact>("contact");
  const social = getSetting<{ instagram: string }>("social");
  return (
    <CartProvider>
      <header>
        <div className="wrap">
          <Link className="chip" href="/">
            <img src={brand.companyLogo} alt={brand.company} />
          </Link>
          <nav>
            {NAV.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </nav>
          <CartLink />
        </div>
      </header>
      {children}
      <footer id="contact">
        <div className="wrap">
          <div>
            <h4>تماس با بهرست</h4>
            <p>{numbers(contact.mobiles.map(mobile))}</p>
            <p>{numbers(contact.landlines.map(landline))}</p>
            <p><bdi dir="ltr">{contact.email}</bdi></p>
            <p>اینستاگرام: <bdi dir="ltr">{social.instagram}</bdi></p>
          </div>
          <div>
            <h4>آدرس</h4>
            <p>{toFa(contact.address)}</p>
          </div>
          <div>
            <h4>درباره‌ی ما</h4>
            <p>بهرست برند محصولات شرکت {brand.company} است و مشاوره‌ی تخصصی تغذیه‌ی گیاه ارائه می‌دهد.</p>
          </div>
        </div>
        <FitocodeCredit />
      </footer>
    </CartProvider>
  );
}
