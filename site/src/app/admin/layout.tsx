import "./admin.css";
export const metadata = { title: "پنل مدیریت بهرست", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="ad-root">{children}</div>;
}
