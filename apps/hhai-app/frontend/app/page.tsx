"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Building2, CircleAlert, ClipboardList, Gauge, MapPin, Sparkles, Store, Users, Workflow } from "lucide-react";
import { LoadingState, MetricCard, PageHeading, Panel, RiskTag } from "@/components/primitives";
import { getMockData, type StoreHealthReport, type Territory } from "@/lib/mock-api";

export default function Home() {
  const territories = useQuery({ queryKey: ["territory"], queryFn: () => getMockData<Territory[]>("territory") });
  const health = useQuery({ queryKey: ["store-health"], queryFn: () => getMockData<StoreHealthReport>("store-health") });
  const reports = useQuery({ queryKey: ["reports"], queryFn: () => getMockData<{ id: string; title: string; scope: string; created_at: string; risk_level: string }[]>("reports") });

  if (!territories.data || !health.data || !reports.data) return <LoadingState />;
  const report = health.data;

  return <>
    <PageHeading eyebrow="AI OPERATIONS · 2026.09.26" title="AI 指挥中心" description="经营全局一屏掌握，优先关注正在变化的风险与机会。" action={<span className="status-line">本地演示环境</span>} />
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <div className="metric-grid">
          <MetricCard label="今日销售额" value="¥ 286.5 万" detail="较昨日 +8.6%" icon={ArrowUpRight} />
          <MetricCard label="经营毛利率" value="23.8%" detail="较上周 -0.4 个百分点" icon={ArrowDownRight} tone="negative" />
          <MetricCard label="活跃 Territory" value="18" detail="覆盖 6 个经营大区" icon={MapPin} tone="neutral" />
          <MetricCard label="待处理风险" value="07" detail="2 项高优先级行动" icon={CircleAlert} tone="negative" />
        </div>
        <Panel title="Territory 快照" icon={MapPin} meta="目标与责任范围" action={<Link className="text-link" href="/territory">全部 Territory <ArrowRight size={12} /></Link>}>
          <div className="table-scroll"><table className="data-table"><thead><tr><th>经营区域</th><th>负责人</th><th>行政区域</th><th>季度目标</th><th>状态</th></tr></thead><tbody>
            {territories.data.slice(0, 4).map((territory) => <tr key={territory.id}><td><span className="table-primary">{territory.name}</span><span className="table-sub">{territory.organization}</span></td><td>{territory.owner}</td><td>{territory.region}</td><td>¥ {(territory.target / 10000).toFixed(0)} 万</td><td><RiskTag level={territory.status} /></td></tr>)}
          </tbody></table></div>
        </Panel>
        <div className="two-column">
          <Panel title="门店风险" icon={Store} meta="按健康评分排序">
            <div className="risk-row"><div><div className="risk-name">上海虹桥体验店</div><div className="risk-detail">库存 47 天 · 毛利回落</div></div><RiskTag level="中风险" /></div>
            <div className="risk-row"><div><div className="risk-name">杭州滨江旗舰店</div><div className="risk-detail">销售达成率低于目标</div></div><RiskTag level="高风险" /></div>
            <div className="risk-row"><div><div className="risk-name">苏州中心体验店</div><div className="risk-detail">新品转化待跟进</div></div><RiskTag level="关注" /></div>
          </Panel>
          <Panel title="代理商风险" icon={Users} meta="渠道经营信号">
            <div className="risk-row"><div><div className="risk-name">苏南智联商贸</div><div className="risk-detail">回款周期较上月延长 9 天</div></div><RiskTag level="中风险" /></div>
            <div className="risk-row"><div><div className="risk-name">粤海家电供应链</div><div className="risk-detail">重点品类库存偏高</div></div><RiskTag level="关注" /></div>
            <div className="risk-row"><div><div className="risk-name">京北新零售</div><div className="risk-detail">季度目标进度稳定</div></div><RiskTag level="低风险" /></div>
          </Panel>
        </div>
        <div className="two-column">
          <Panel title="最近运行 Skills" icon={Workflow} meta="本地 Runtime">
            <div className="list-stack">
              <Link className="list-row" href="/skills/rbos-store-health"><div><div className="list-title">RBOS 门店健康诊断</div><div className="list-caption">09:30 · 上海虹桥体验店</div></div><RiskTag level="已完成" /></Link>
              <Link className="list-row" href="/skills"><div><div className="list-title">RBOS 渠道转化提升</div><div className="list-caption">昨日 17:10 · 华南增长区</div></div><RiskTag level="已完成" /></Link>
            </div>
          </Panel>
          <Panel title="最近报告" icon={ClipboardList} action={<Link className="text-link" href="/reports">报告中心 <ArrowRight size={12} /></Link>}>
            <div className="list-stack">{reports.data.slice(0, 2).map((item) => <Link className="list-row" href={`/reports?id=${item.id}`} key={item.id}><div><div className="list-title">{item.title}</div><div className="list-caption">{item.scope} · {item.created_at}</div></div><ArrowRight size={14} color="#8ea4b0" /></Link>)}</div>
          </Panel>
        </div>
      </div>
      <aside className="dashboard-aside stack">
        <Panel title="AI 今日行动" icon={Sparkles} meta="3 项建议">
          <div className="action-list">
            <div className="action-item"><span className="action-index">01</span><div><strong>优先处理虹桥店库存</strong><p>库存覆盖高于区域目标 12 天，建议门店与代理商联合清理慢销 SKU。</p></div></div>
            <div className="action-item"><span className="action-index">02</span><div><strong>复核华南促销折扣</strong><p>销售增长但毛利承压，检查重点品类折扣与返利政策。</p></div></div>
            <div className="action-item"><span className="action-index">03</span><div><strong>确认西南区域启用准备</strong><p>负责人和品类范围已配置，建议完成首批门店映射。</p></div></div>
          </div>
          <Link href="/skills/rbos-store-health" className="button button-primary" style={{ width: "100%", marginTop: 14 }}><Sparkles size={14} />运行门店健康诊断</Link>
        </Panel>
        <Panel title="门店健康摘要" icon={Gauge} meta={report.generated_at.slice(0, 10)}>
          <div className="risk-level"><span className="risk-light" />{report.summary.risk_level}<span style={{ marginLeft: "auto", color: "var(--text)" }}>{report.summary.health_score}<span style={{ color: "var(--muted)", fontSize: 10 }}> / 100</span></span></div>
          <div className="risk-row"><div className="risk-name">销售额</div><div className="table-primary">¥ {(report.summary.sales_amount / 10000).toFixed(2)} 万</div></div>
          <div className="risk-row"><div className="risk-name">毛利率</div><div className="table-primary">{(report.summary.gross_margin_rate * 100).toFixed(1)}%</div></div>
          <div className="risk-row"><div className="risk-name">库存天数</div><div className="table-primary">{report.summary.inventory_days} 天</div></div>
          <Link href="/dashboard/store-health" className="text-link" style={{ marginTop: 12 }}>查看经营趋势 <ArrowRight size={12} /></Link>
        </Panel>
        <div className="inline-note"><Building2 size={13} style={{ display: "inline", marginRight: 5, verticalAlign: "-2px" }} />仅展示本地 Mock 数据，所有操作不会连接生产系统。</div>
      </aside>
    </div>
  </>;
}
