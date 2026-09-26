"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, BookOpenText, Code2, Database, Play, Search, Workflow, X } from "lucide-react";
import { LoadingState, PageHeading, RiskTag } from "@/components/primitives";
import { getMockData } from "@/lib/mock-api";

type SkillPackage = {
  id: string;
  kind: string;
  system: string;
  path: string;
  metadata: { id: string; name: string; version: string; system: string; category?: string; status: string; capability?: string; description?: string };
};

export function SkillsCenter() {
  const registry = useQuery({ queryKey: ["registry"], queryFn: () => getMockData<{ version: string; packages: SkillPackage[] }>("registry") });
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(60);
  const [dialog, setDialog] = useState<{ title: string; content: string } | null>(null);

  if (!registry.data) return <LoadingState label="正在读取 Runtime 注册表" />;
  const skills = registry.data.packages.filter((item) => item.kind === "skill").sort((left, right) => Number(right.id === "rbos-store-health") - Number(left.id === "rbos-store-health"));
  const filtered = skills.filter((skill) => `${skill.metadata.name} ${skill.id} ${skill.metadata.system} ${skill.metadata.category ?? ""}`.toLowerCase().includes(search.toLowerCase()));

  async function showArtifact(name: string, title: string) {
    const response = await fetch(`/api/mock/${name}`);
    const content = await response.text();
    setDialog({ title, content: name.endsWith("schema") ? JSON.stringify(JSON.parse(content), null, 2) : content });
  }

  return <>
    <PageHeading eyebrow={`RUNTIME · V${registry.data.version}`} title="Skills 中心" description={`已加载 ${skills.length} 个注册 Skill；数据来自 HHAI-Skills V2.0 的只读 Registry 快照。`} />
    <div className="card" style={{ padding: 13, marginBottom: 14 }}><label className="search-box" style={{ width: "min(480px,100%)" }}><Search size={15} /><input value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(60); }} placeholder="按名称、Domain 或 Skill ID 搜索" /></label></div>
    <div className="skill-grid">
      {filtered.slice(0, visibleCount).map((skill) => {
        const local = skill.id === "rbos-store-health";
        const capability = skill.metadata.capability ?? skill.metadata.description ?? `${skill.metadata.category ?? skill.metadata.system} 业务能力`;
        return <article key={skill.id} className="card skill-card">
          <div className="skill-card-top"><span className="skill-icon"><Workflow size={17} /></span><RiskTag level={skill.metadata.status === "production" ? "已发布" : "Mock"} /></div>
          <h3>{skill.metadata.name}</h3>
          <p>{capability}</p>
          <div className="skill-meta"><span>{skill.metadata.system}</span><span>·</span><span>v{skill.metadata.version}</span><span>·</span><span>{skill.id}</span></div>
          <div className="skill-actions">
            <button className="button button-small" onClick={() => setDialog({ title: skill.metadata.name, content: `Skill ID：${skill.id}\nDomain：${skill.metadata.system}\n版本：${skill.metadata.version}\n状态：${skill.metadata.status}\nCapability：${capability}\n来源：${local ? "HHAI-App 本地 Mock" : `HHAI-Skills/${skill.path}`}` })}>查看详情</button>
            <Link className="button button-small button-primary" href={local ? "/skills/rbos-store-health" : "/skills"}><Play size={11} />运行</Link>
            <button className="button button-small" onClick={() => void showArtifact("skill-prompt", "门店健康诊断 Prompt")}><BookOpenText size={11} />Prompt</button>
            <button className="button button-small" onClick={() => void showArtifact("skill-schema", "门店健康诊断 Schema")}><Code2 size={11} />Schema</button>
            <Link className="button button-small" href="/reports"><Activity size={11} />报告</Link>
            <span title={skill.metadata.category ?? "注册能力"} style={{ display: "none" }}><Database size={12} /></span>
          </div>
        </article>;
      })}
    </div>
    {filtered.length === 0 && <div className="card empty-state">没有匹配的 Skill。</div>}
    {visibleCount < filtered.length && <div className="form-actions"><button className="button" onClick={() => setVisibleCount((count) => count + 60)}>加载更多（{filtered.length - visibleCount}）</button></div>}
    {dialog && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}><section className="modal" role="dialog" aria-modal="true"><div className="modal-header"><h2>{dialog.title}</h2><button className="icon-button" onClick={() => setDialog(null)} aria-label="关闭"><X size={15} /></button></div><pre className="code-view" style={{ whiteSpace: "pre-wrap" }}>{dialog.content}</pre></section></div>}
  </>;
}