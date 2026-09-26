"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, CircleAlert, Gauge, PackageCheck, Sparkles, TrendingUp } from "lucide-react";
import { LoadingState, MetricCard, PageHeading, Panel, RiskTag } from "@/components/primitives";
import { getMockData, type StoreHealthReport } from "@/lib/mock-api";

const axisStyle = { fill: "#8197a3", fontSize: 10 };
const tooltipStyle = { background: "#0c1925", border: "1px solid #294357", borderRadius: 6, color: "#edf5f7", fontSize: 11 };

export default function StoreHealthDashboard() {
  const query = useQuery({ queryKey: ["store-health"], queryFn: () => getMockData<StoreHealthReport>("store-health") });
  if (!query.data) return <LoadingState />;
  const report = query.data;

  return <>
    <PageHeading eyebrow="DOS · RBOS STORE HEALTH" title="门店健康驾驶舱" description={`${report.store.name} · ${report.store.id} · ${report.generated_at.slice(0, 10)} · 所有图表来自 Report JSON`} action={<Link className="button" href={`/reports?id=${report.report_id}`}>查看报告 <ArrowRight size={13} /></Link>} />
    <div className="metric-grid" style={{ marginBottom: 15 }}>
      <MetricCard label="月销售额" value={`¥ ${(report.summary.sales_amount / 10000).toFixed(2)} 万`} detail="近 6 月趋势" icon={TrendingUp} />
      <MetricCard label="毛利率" value={`${(report.summary.gross_margin_rate * 100).toFixed(1)}%`} detail="报告统计口径" icon={Gauge} tone="neutral" />
      <MetricCard label="库存天数" value={`${report.summary.inventory_days} 天`} detail="高于区域目标 12 天" icon={PackageCheck} tone="negative" />
      <MetricCard label="健康评分" value={`${report.summary.health_score} / 100`} detail={report.summary.risk_level} icon={CircleAlert} tone="negative" />
    </div>
    <div className="two-column">
      <Panel title="销量趋势" icon={TrendingUp} meta="元 · 月度">
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={report.trends} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5bd6d0" stopOpacity={0.3} /><stop offset="95%" stopColor="#5bd6d0" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="#1c3343" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} /><YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${Math.round(value / 10000)}万`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`¥ ${Number(value).toLocaleString("zh-CN")}`, "销售额"]} /><Area type="monotone" dataKey="sales" stroke="#5bd6d0" strokeWidth={2} fill="url(#salesFill)" /></AreaChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="毛利率趋势" icon={Gauge} meta="百分比 · 月度">
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={report.trends} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}><CartesianGrid stroke="#1c3343" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} /><YAxis domain={[20, 27]} tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${value}%`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, "毛利率"]} /><Line type="monotone" dataKey="gross_margin_rate" stroke="#f4bc65" strokeWidth={2} dot={{ r: 3, fill: "#f4bc65", strokeWidth: 0 }} /></LineChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="库存天数" icon={PackageCheck} meta="天 · 月度">
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={report.trends} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}><CartesianGrid stroke="#1c3343" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} /><YAxis tick={axisStyle} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} 天`, "库存覆盖"]} /><Bar dataKey="inventory_days" fill="#65a9ff" radius={[4, 4, 0, 0]} maxBarSize={28} /></BarChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="健康评分与风险等级" icon={CircleAlert} meta="0–100 分">
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={report.trends} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}><CartesianGrid stroke="#1c3343" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} /><YAxis domain={[60, 90]} tick={axisStyle} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} 分`, "健康评分"]} /><Line type="monotone" dataKey="health_score" stroke="#7bd8a3" strokeWidth={2} dot={{ r: 3, fill: "#7bd8a3", strokeWidth: 0 }} /></LineChart></ResponsiveContainer></div>
        <div className="risk-level"><span className="risk-light" />当前风险等级：{report.summary.risk_level}</div>
      </Panel>
    </div>
    <div className="two-column section-gap">
      <Panel title="风险观察" icon={CircleAlert} meta={`${report.risks.length} 项`}>
        {report.risks.map((risk) => <div className="risk-row" key={risk.title}><div><div className="risk-name">{risk.title}</div><div className="risk-detail">{risk.detail}</div></div><RiskTag level={risk.severity} /></div>)}
      </Panel>
      <Panel title="行动建议" icon={Sparkles} meta={`${report.actions.length} 项`}>
        {report.actions.map((action) => <div className="risk-row" key={action.title}><div><div className="risk-name">{action.title}</div><div className="risk-detail">负责人：{action.owner} · 截止 {action.due_date}</div></div><RiskTag level={`${action.priority}优先级`} /></div>)}
      </Panel>
    </div>
  </>;
}