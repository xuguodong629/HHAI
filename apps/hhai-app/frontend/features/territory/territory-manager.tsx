"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, MapPin, PencilLine, Plus, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingState, PageHeading, Panel, RiskTag } from "@/components/primitives";
import { getMockData, type Territory } from "@/lib/mock-api";

const territorySchema = z.object({
  name: z.string().min(2, "请输入至少 2 个字的名称"),
  owner: z.string().min(1, "请填写负责人"),
  organization: z.string().min(1, "请填写组织"),
  category: z.string().min(1, "请填写品类"),
  channel: z.string().min(1, "请填写渠道"),
  region: z.string().min(1, "请填写行政区域"),
  target: z.number().min(0, "目标不能为负数"),
  status: z.enum(["运行中", "待启用", "已归档"]),
});

type TerritoryForm = z.infer<typeof territorySchema>;
const storageKey = "hhai-territories-v1";
const emptyTerritory: TerritoryForm = { name: "", owner: "", organization: "", category: "", channel: "", region: "", target: 0, status: "待启用" };
const makeLocalId = () => `local-${Date.now()}`;

export function TerritoryManager({ detailId }: { detailId?: string }) {
  const queryClient = useQueryClient();
  const source = useQuery({ queryKey: ["territory"], queryFn: async () => {
    const data = await getMockData<Territory[]>("territory");
    const saved = typeof window === "undefined" ? null : localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as Territory[] : data;
  } });
  const [editing, setEditing] = useState<Territory | null | false>(false);
  const [persistenceNote, setPersistenceNote] = useState("");
  const form = useForm<TerritoryForm>({ resolver: zodResolver(territorySchema), defaultValues: emptyTerritory });

  function openCreate() {
    form.reset(emptyTerritory);
    setEditing(null);
  }

  function openEdit(territory: Territory) {
    form.reset({ ...territory });
    setEditing(territory);
  }

  async function save(values: TerritoryForm) {
    const current = source.data ?? [];
    const updated = editing
      ? current.map((item) => item.id === editing.id ? { ...item, ...values } : item)
      : [{ id: makeLocalId(), ...values }, ...current];
    queryClient.setQueryData(["territory"], updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    try {
      const response = await fetch("/api/local/territory", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ territories: updated }) });
      setPersistenceNote(response.ok ? "已保存到 territory/territories.json" : "文件写入失败，已保存在当前浏览器");
    } catch {
      setPersistenceNote("文件服务不可用，已保存在当前浏览器");
    }
    setEditing(false);
  }

  if (!source.data) return <LoadingState />;
  const records = source.data;
  const current = detailId ? records.find((territory) => territory.id === detailId) : undefined;

  return <>
    <PageHeading eyebrow="RWOS · TERRITORY" title={detailId ? current?.name ?? "Territory 未找到" : "Territory 中心"} description={detailId ? "查看区域责任、品类、渠道与目标配置。" : "用明确的责任人与经营边界组织业务能力。"} action={detailId ? <Link className="button" href="/territory"><ArrowLeft size={14} />返回列表</Link> : <button className="button button-primary" onClick={openCreate}><Plus size={15} />新建 Territory</button>} />
    {persistenceNote && <p className="inline-note">{persistenceNote}</p>}

    {detailId ? current ? <div className="stack">
      <Panel title="Territory 详情" icon={MapPin} action={<button className="button button-small" onClick={() => openEdit(current)}><PencilLine size={13} />编辑</button>}>
        <div className="detail-grid">
          <Detail label="负责人" value={current.owner} /><Detail label="所属组织" value={current.organization} /><Detail label="品类" value={current.category} />
          <Detail label="渠道" value={current.channel} /><Detail label="行政区域" value={current.region} /><Detail label="经营目标" value={`¥ ${current.target.toLocaleString("zh-CN")}`} />
        </div>
        <div className="section-gap"><RiskTag level={current.status} /></div>
      </Panel>
      <Panel title="范围说明" meta="本地 JSON / 浏览器覆盖">
        <p className="inline-note">Territory 数据由 `packages/hhai-skills/territory/territories.json` 提供；页面修改写回该 JSON，并保留当前浏览器副本。</p>
      </Panel>
    </div> : <Panel title="未找到 Territory"><div className="empty-state">该记录可能已被删除或不存在。</div></Panel> : <Panel title="Territory 列表" icon={MapPin} meta={`${records.length} 个区域`}>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>名称 / ID</th><th>负责人</th><th>组织</th><th>品类 / 渠道</th><th>行政区域</th><th>目标</th><th>状态</th><th>操作</th></tr></thead><tbody>
        {records.map((territory) => <tr key={territory.id}>
          <td><Link className="table-primary" href={`/territory/${territory.id}`}>{territory.name}</Link><span className="table-sub">{territory.id}</span></td>
          <td>{territory.owner}</td><td>{territory.organization}</td><td>{territory.category}<span className="table-sub">{territory.channel}</span></td><td>{territory.region}</td>
          <td>¥ {territory.target.toLocaleString("zh-CN")}</td><td><RiskTag level={territory.status} /></td>
          <td><div className="toolbar"><Link className="icon-button" href={`/territory/${territory.id}`} aria-label={`查看${territory.name}`}><ArrowRight size={13} /></Link><button className="icon-button" onClick={() => openEdit(territory)} aria-label={`编辑${territory.name}`}><PencilLine size={13} /></button></div></td>
        </tr>)}
      </tbody></table></div>
    </Panel>}

    {editing !== false && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(false); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="territory-form-title">
        <div className="modal-header"><h2 id="territory-form-title">{editing ? "编辑 Territory" : "新建 Territory"}</h2><button className="icon-button" onClick={() => setEditing(false)} aria-label="关闭"><X size={15} /></button></div>
        <form onSubmit={form.handleSubmit(save)}>
          <div className="field-grid">
            <FormField label="名称" error={form.formState.errors.name?.message}><input {...form.register("name")} placeholder="例如：华东一部" /></FormField>
            <FormField label="负责人" error={form.formState.errors.owner?.message}><input {...form.register("owner")} placeholder="负责人姓名" /></FormField>
            <FormField label="组织" error={form.formState.errors.organization?.message}><input {...form.register("organization")} placeholder="所属组织" /></FormField>
            <FormField label="品类" error={form.formState.errors.category?.message}><input {...form.register("category")} placeholder="经营品类" /></FormField>
            <FormField label="渠道" error={form.formState.errors.channel?.message}><input {...form.register("channel")} placeholder="直营 / 经销 / 电商" /></FormField>
            <FormField label="行政区域" error={form.formState.errors.region?.message}><input {...form.register("region")} placeholder="省市范围" /></FormField>
            <FormField label="目标（元）" error={form.formState.errors.target?.message}><input type="number" min="0" {...form.register("target", { valueAsNumber: true })} /></FormField>
            <FormField label="状态"><select {...form.register("status")}><option>运行中</option><option>待启用</option><option>已归档</option></select></FormField>
          </div>
          <div className="form-actions"><button type="button" className="button" onClick={() => setEditing(false)}>取消</button><button className="button button-primary" type="submit">保存到 JSON</button></div>
        </form>
      </section>
    </div>}
  </>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="detail-item"><div className="detail-label">{label}</div><div className="detail-value">{value}</div></div>;
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="field"><label>{label}</label>{children}{error && <span className="form-error">{error}</span>}</div>;
}