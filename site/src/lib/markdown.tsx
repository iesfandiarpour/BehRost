import type { ReactNode } from "react";

/**
 * نمایش‌دهنده‌ی ساده‌ی متن مقاله (بدون HTML خام، پس از تزریق کد امن است):
 * «## عنوان»، «### زیرعنوان»، «- مورد فهرست»، «**پررنگ**»، «[متن](https://...)» و خط خالی برای پاراگراف جدید.
 */
function inline(s: string, k: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={`${k}b${i++}`}>{t.slice(2, -2)}</strong>);
    else {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(t)!;
      const ext = mm[2].startsWith("http");
      out.push(<a key={`${k}a${i++}`} href={mm[2]} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{mm[1]}</a>);
    }
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function renderContent(text: string): ReactNode[] {
  const lines = text.replace(/\r/g, "").split("\n");
  const nodes: ReactNode[] = [];
  let para: string[] = [], list: string[] = [], n = 0;
  const flush = () => {
    if (para.length) { nodes.push(<p key={`p${n++}`}>{inline(para.join(" "), `p${n}`)}</p>); para = []; }
    if (list.length) { nodes.push(<ul key={`u${n++}`}>{list.map((x, i) => <li key={i}>{inline(x, `l${n}${i}`)}</li>)}</ul>); list = []; }
  };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { flush(); continue; }
    if (l.startsWith("### ")) { flush(); nodes.push(<h3 key={`h${n++}`}>{inline(l.slice(4), `h${n}`)}</h3>); }
    else if (l.startsWith("## ")) { flush(); nodes.push(<h2 key={`h${n++}`}>{inline(l.slice(3), `h${n}`)}</h2>); }
    else if (l.startsWith("- ")) { if (para.length) flush(); list.push(l.slice(2)); }
    else { if (list.length) flush(); para.push(l); }
  }
  flush();
  return nodes;
}
