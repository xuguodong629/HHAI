"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Download, FileJson, FileText } from "lucide-react";
import { LoadingState, PageHeading, Panel, RiskTag } from "@/components/primitives";
import { getMockData, getReportList, type StoreHealthReport } from "@/lib/mock-api";

export function ReportsCenter() {
  const searchParams = useSearchParams();
  const reports = useQuery({ queryKey: ["reports"], queryFn: getReportList });
  const report = useQuery({ queryKey: ["store-health"], queryFn: () => getMockData<StoreHealthReport>("store-health") });
  const [selectedId, setSelectedId] = useState("");
  const [view, setView] = useState<"markdown" | "json">("markdown");

  if (!reports.data || !report.data) return <LoadingState />;
  const requestedId = selectedId || searchParams.get("id") || "";
  const selected = reports.data.find((item) => item.id === requestedId) ?? reports.data[0];
  const detailedReport = { ...report.data, report_id: selected.id, skill_id: selected.skill_id };

  function exportMarkdown() {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([report.data?.markdown ?? ""], { type: "text/markdown;charset=utf-8" }));
    link.download = `${selected.id}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return <>
    <PageHeading eyebrow="REPORT CENTER" title="报告中心" description="查看 Runtime 生成的经营结果，导出 Markdown 或 JSON。" action={<button className="button" disabled title="PDF 导出将在后续阶段接入"><FileText size={14} />导出 PDF（占位）</button>} />
    <div className="content-grid">
      <Panel title="报告列表" icon={ClipboardList} meta={`${reports.data.length} 份`}>
        <div className="list-stack">{reports.data.map((item) => <button key={item.id} className="list-row" onClick={() => setSelectedId(item.id)} style={{ width: "100%", border: 0, borderBottom: "1px solid rgba(30,53,70,.55)", background: selected.id === item.id ? "rgba(91,214,208,.06)" : "transparent", textAlign: "left", cursor: "pointer" }}>
          <span><span className="list-title">{item.title}</span><span className="list-caption">{item.scope} · {item.created_at}<br />{item.skill_id}</span></span><RiskTag level={item.risk_level} />
        </button>)}</div>
      </Panel>
      <div className="stack">
        <Panel title={selected.title} icon={FileText} meta={selected.id} action={<div className="toolbar"><button className={`button button-small ${view === "markdown" ? "button-primary" : ""}`} onClick={() => setView("markdown")}><FileText size={12} />Markdown</button><button className={`button button-small ${view === "json" ? "button-primary" : ""}`} onClick={() => setView("json")}><FileJson size={12} />JSON</button><button className="icon-button" onClick={exportMarkdown} aria-label="导出 Markdown"><Download size={13} /></button></div>}>
          {view === "markdown" ? <article className="report-markdown"><ReactMarkdown>{report.data.markdown}</ReactMarkdown></article> : <pre className="code-view">{JSON.stringify(detailedReport, null, 2)}</pre>}
        </Panel>
        <div className="inline-note">报告来源：本地 JSON Mock。当前报告列表和详情在无数据库时可用。</div>
      </div>
    </div>
  </>;
}