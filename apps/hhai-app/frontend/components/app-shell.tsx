"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Aperture, Bell, BookOpen, ChevronRight, Command, Compass, Gauge, Layers3, Menu, Search, Settings2, ShieldCheck, Store, Users, Workflow } from "lucide-react";
import type { ReactNode } from "react";
import { useUIStore } from "@/stores/ui-store";

const navigation = [
  { label: "经营工作台", links: [
    { label: "AI 指挥中心", href: "/", icon: Command },
    { label: "RWOS 区域经营", href: "/rwos", icon: Compass },
    { label: "RBOS 零售经营", href: "/rbos", icon: Store },
    { label: "BGOS 代理商治理", href: "/bgos", icon: ShieldCheck },
    { label: "UOS 用户经营", href: "/uos", icon: Users },
    { label: "COS AI 企业大学", href: "/cos", icon: BookOpen },
    { label: "DOS AI 驾驶舱", href: "/dashboard", icon: Gauge },
  ] },
  { label: "工作空间", links: [
    { label: "Territory 中心", href: "/territory", icon: Layers3 },
    { label: "Skills 中心", href: "/skills", icon: Workflow },
    { label: "报告中心", href: "/reports", icon: Activity },
    { label: "配置中心", href: "/settings/metadata", icon: Settings2 },
  ] },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const collapsed = useUIStore((state) => state.collapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  return (
    <div className="app-frame">
      <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
        <Link href="/" className="brand" aria-label="返回 AI 指挥中心">
          <span className="brand-mark"><Aperture size={19} /></span>
          <span className="brand-copy"><span className="brand-name">HHAI COMMAND</span><span className="brand-caption">LOCAL OPERATIONS SYSTEM</span></span>
        </Link>
        <nav className="nav-scroll" aria-label="主导航">
          {navigation.map((group) => <div key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.links.map(({ label, href, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
              return <Link key={href} href={href} className={`nav-link ${active ? "is-active" : ""}`} title={collapsed ? label : undefined}>
                <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              </Link>;
            })}
          </div>)}
        </nav>
        <div className="side-footer"><div className="side-footer-inner"><span className="user-avatar">林</span><span className="side-footer-copy"><strong>林知远</strong>企业经营负责人</span></div></div>
      </aside>
      <div className={`workspace ${collapsed ? "is-collapsed" : ""}`}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={toggleSidebar} aria-label="切换导航"><Menu size={17} /></button>
            <button className="icon-button" onClick={toggleSidebar} aria-label="收起或展开导航"><ChevronRight size={16} /></button>
            <label className="search-box"><Search size={15} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索 Territory、Skill、报告…" /></label>
          </div>
          <div className="topbar-actions"><span className="topbar-date">本地工作空间 · 数据为 Mock</span><button className="icon-button" aria-label="通知"><Bell size={16} /></button><span className="user-avatar">林</span></div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}