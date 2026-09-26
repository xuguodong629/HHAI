import Link from "next/link";
import { ArrowRight, Building2, ChartNoAxesCombined, CircleAlert, Layers3, MapPinned, Store, Users } from "lucide-react";
import { PageHeading, Panel, RiskTag } from "@/components/primitives";

const domains = {
  rwos: { eyebrow: "RWOS · REGIONAL OPERATIONS", title: "RWOS 区域经营", description: "按 Territory 组织经营责任、目标和区域行动。", icon: MapPinned, metric: "18 个活跃区域", note: "本地 Territory 列表包含 5 个演示区域。" },
  rbos: { eyebrow: "RBOS · RETAIL OPERATIONS", title: "RBOS 零售经营", description: "跟踪门店经营健康、商品表现与零售转化。", icon: Store, metric: "72 门店健康评分", note: "上海虹桥体验店当前为中风险，库存周转需要关注。" },
  bgos: { eyebrow: "BGOS · DEALER GOVERNANCE", title: "BGOS 代理商治理", description: "识别渠道伙伴的回款、库存与经营协同风险。", icon: Users, metric: "2 项渠道关注", note: "风险信息为首页 Mock 示例，不保存代理商业务表。" },
  uos: { eyebrow: "UOS · USER OPERATIONS", title: "UOS 用户经营", description: "汇总用户触达、转化和留存经营信号。", icon: ChartNoAxesCombined, metric: "4 个经营信号", note: "该模块在 Phase 1.5 提供导航与演示入口。" },
  cos: { eyebrow: "COS · AI UNIVERSITY", title: "COS AI 企业大学", description: "连接业务能力、组织学习与岗位实践。", icon: Building2, metric: "Skills 驱动学习", note: "业务能力来自 HHAI-Skills 注册表。" },
  dashboard: { eyebrow: "DOS · EXECUTIVE COCKPIT", title: "DOS AI 驾驶舱", description: "聚合跨域经营风险、业务趋势和可执行行动。", icon: Layers3, metric: "1 个活跃驾驶舱", note: "门店健康驾驶舱已接入完整 Report JSON。" },
} as const;

export function DomainOverview({ domain }: { domain: keyof typeof domains }) {
  const item = domains[domain];
  const Icon = item.icon;
  return <>
    <PageHeading eyebrow={item.eyebrow} title={item.title} description={item.description} />
    <div className="content-grid">
      <div className="stack">
        <Panel title="经营概览" icon={Icon} meta="Mock 数据">
          <div className="detail-grid"><div className="detail-item"><div className="detail-label">当前状态</div><div className="detail-value">{item.metric}</div></div><div className="detail-item"><div className="detail-label">数据边界</div><div className="detail-value">本地 JSON</div></div><div className="detail-item"><div className="detail-label">运行方式</div><div className="detail-value">Skill Runtime</div></div></div>
          <p className="inline-note section-gap">{item.note}</p>
        </Panel>
        <Panel title="待关注事项" icon={CircleAlert} meta="演示">
          <div className="risk-row"><div><div className="risk-name">门店库存周转偏慢</div><div className="risk-detail">上海虹桥体验店 · 高于 Territory 目标 12 天</div></div><RiskTag level="中风险" /></div>
          <div className="risk-row"><div><div className="risk-name">华南促销毛利承压</div><div className="risk-detail">建议检查重点品类折扣和返利政策</div></div><RiskTag level="关注" /></div>
        </Panel>
      </div>
      <aside className="stack">
        <Panel title="快捷入口" icon={Layers3}>
          <div className="list-stack">
            <Link className="list-row" href="/territory"><span><span className="list-title">Territory 中心</span><span className="list-caption">区域责任与目标配置</span></span><ArrowRight size={14} /></Link>
            <Link className="list-row" href="/skills"><span><span className="list-title">Skills 中心</span><span className="list-caption">查看已注册业务能力</span></span><ArrowRight size={14} /></Link>
            <Link className="list-row" href="/skills/rbos-store-health"><span><span className="list-title">门店健康诊断</span><span className="list-caption">运行 RBOS Mock Skill</span></span><ArrowRight size={14} /></Link>
            <Link className="list-row" href="/dashboard/store-health"><span><span className="list-title">健康驾驶舱</span><span className="list-caption">查看趋势和行动建议</span></span><ArrowRight size={14} /></Link>
          </div>
        </Panel>
      </aside>
    </div>
  </>;
}