"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, ClipboardList, Code2, Play, Sparkles, Workflow } from "lucide-react";
import { LoadingState, PageHeading, Panel, RiskTag } from "@/components/primitives";
import { getMockData, type StoreHealthReport } from "@/lib/mock-api";

type MetadataField = { id: string; object: string; name: string; key: string; type: string; required: boolean; description: string; placeholder: string; example: string };
type MetadataData = { fields: MetadataField[] };
type ReportListItem = { id: string; title: string; skill_id: string; scope: string; created_at: string; risk_level: string; format: string };

const inputSchema = z.object({
  store_id: z.string().min(1, "门店编码不能为空"),
  period: z.string().min(1, "请选择统计周期"),
  sales_amount: z.coerce.number().min(0, "销售额不能为负数"),
  gross_margin_rate: z.coerce.number().min(0).max(100, "毛利率范围为 0 至 100"),
  inventory_days: z.coerce.number().min(0, "库存天数不能为负数"),
});
type FormInput = z.input<typeof inputSchema>;
type InputValues = z.output<typeof inputSchema>;

export function StoreHealthSkill() {
  const queryClient = useQueryClient();
  const metadata = useQuery({ queryKey: ["metadata"], queryFn: async () => {
    const data = await getMockData<MetadataData>("metadata");
    const stored = typeof window === "undefined" ? null : localStorage.getItem("hhai-metadata-fields-v1");
    return stored ? { ...data, fields: JSON.parse(stored) as MetadataField[] } : data;
  } });
  const health = useQuery({ queryKey: ["store-health"], queryFn: () => getMockData<StoreHealthReport>("store-health") });
  const reports = useQuery({ queryKey: ["reports"], queryFn: () => getMockData<ReportListItem[]>("reports") });
  const [output, setOutput] = useState<StoreHealthReport | null>(null);
  const [runError, setRunError] = useState("");
  const form = useForm<FormInput, undefined, InputValues>({ resolver: zodResolver(inputSchema), defaultValues: { store_id: "ST-SH-018", period: "2026-09", sales_amount: 286500, gross_margin_rate: 23.8, inventory_days: 47 } });

  if (!metadata.data || !health.data || !reports.data) return <LoadingState />;
  const report = output ?? health.data;
  const fields = metadata.data.fields.filter((field) => field.object === "store" && ["store_id", "sales_amount", "gross_margin_rate", "inventory_days"].includes(field.key));

  async function run(values: InputValues) {
    setRunError("");
    try {
      const response = await fetch("/api/runtime/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ skill_id: "rbos-store-health", input: values }) });
      if (!response.ok) throw new Error("本地 Runtime 返回错误");
      const result = await response.json() as StoreHealthReport;
      setOutput(result);
      const current = queryClient.getQueryData<ReportListItem[]>(["reports"]) ?? [];
      const next = [{ id: result.report_id, title: `${result.store.name}健康诊断`, skill_id: result.skill_id, scope: `${result.store.id} · ${result.store.region}`, created_at: new Date(result.generated_at).toLocaleString("zh-CN"), risk_level: result.summary.risk_level, format: "Markdown + JSON" }, ...current];
      queryClient.setQueryData(["reports"], next);
      localStorage.setItem("hhai-reports-v1", JSON.stringify(next));
    } catch {
      setRunError("本地 Mock Runtime 暂不可用，请检查前端 API 服务。");
    }
  }

  return <>
    <PageHeading eyebrow="RBOS · BUSINESS SKILL" title="门店健康诊断" description="读取门店 Metadata，评估销售、毛利与库存表现并生成 Mock Report。" action={<RiskTag level="Mock · 无 AI 调用" />} />
    <div className="content-grid">
      <div className="stack">
        <Panel title="Skill 描述" icon={Workflow} meta="RBOS · v0.1.0">
          <p className="inline-note">基于门店经营 Metadata 识别销售表现、毛利质量与库存效率风险，并输出可执行、可归责、带截止日期的行动建议。本 MVP 使用固定 Mock 结果，不调用 AI。</p>
          <div className="toolbar section-gap"><Link className="button button-small" href="/api/mock/skill-description" target="_blank"><ClipboardList size={12} />Skill 描述</Link><Link className="button button-small" href="/api/mock/skill-prompt" target="_blank"><Sparkles size={12} />Prompt</Link><Link className="button button-small" href="/api/mock/skill-schema" target="_blank"><Code2 size={12} />Schema</Link><Link className="button button-small" href="/reports"><ArrowRight size={12} />查看报告</Link></div>
        </Panel>
        <Panel title="运行 Skill" icon={Play} meta="输入由 Metadata 字段动态生成">
          <form onSubmit={form.handleSubmit(run)}>
            <div className="field-grid">
              <div className="field"><label>统计周期 *</label><input type="month" {...form.register("period")} />{form.formState.errors.period && <span className="form-error">{form.formState.errors.period.message}</span>}</div>
              {fields.map((field) => <div className="field" key={field.id}>
                <label>{field.name}{field.required ? " *" : ""}</label>
                <input type={field.key === "sales_amount" || field.key === "gross_margin_rate" || field.key === "inventory_days" ? "number" : "text"} step={field.key === "gross_margin_rate" ? "0.1" : "1"} placeholder={field.placeholder} {...form.register(field.key as keyof InputValues, field.key === "store_id" ? {} : { valueAsNumber: true })} />
                <span className="inline-note">示例：{field.example}</span>
                {form.formState.errors[field.key as keyof InputValues] && <span className="form-error">{String(form.formState.errors[field.key as keyof InputValues]?.message)}</span>}
              </div>)}
            </div>
            {runError && <p className="form-error section-gap">{runError}</p>}
            <div className="form-actions"><button className="button button-primary" type="submit" disabled={form.formState.isSubmitting}><Play size={13} />{form.formState.isSubmitting ? "运行中…" : "运行并生成 Mock Report"}</button></div>
          </form>
        </Panel>
        <Panel title="运行输出" icon={Sparkles} meta={report.report_id}>
          <div className="risk-level"><span className="risk-light" />{report.summary.risk_level}<span style={{ marginLeft: "auto", fontSize: 20, color: "var(--text)" }}>{report.summary.health_score}<span style={{ color: "var(--muted)", fontSize: 10 }}> / 100</span></span></div>
          <p className="inline-note section-gap">{report.markdown.split("\n\n")[5]?.replace(/[*#]/g, "") ?? "门店健康诊断已完成。"}</p>
          <div className="toolbar section-gap"><Link className="button button-small button-primary" href={`/reports?id=${report.report_id}`}>打开完整报告 <ArrowRight size={12} /></Link><Link className="button button-small" href="/dashboard/store-health">查看趋势驾驶舱</Link></div>
        </Panel>
      </div>
      <aside className="stack">
        <Panel title="最近报告" icon={ClipboardList} meta={`${reports.data.length} 份`}>
          <div className="list-stack">{reports.data.slice(0, 5).map((item) => <Link className="list-row" href={`/reports?id=${item.id}`} key={item.id}><div><div className="list-title">{item.title}</div><div className="list-caption">{item.created_at}</div></div><RiskTag level={item.risk_level} /></Link>)}</div>
        </Panel>
        <Panel title="数据边界"><p className="inline-note">Territory、Metadata 和 Report 均为本地 JSON/浏览器数据。数据库只保存平台级记录，不创建门店或代理商业务表。</p></Panel>
      </aside>
    </div>
  </>;
}