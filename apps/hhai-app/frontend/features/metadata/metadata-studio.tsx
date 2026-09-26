"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Braces, Database, Eye, PencilLine, Plus, Trash2, X } from "lucide-react";
import { LoadingState, PageHeading, Panel } from "@/components/primitives";
import { getMockData } from "@/lib/mock-api";

type MetadataField = { id: string; object: string; name: string; key: string; type: string; required: boolean; description: string; placeholder: string; example: string };
type MetadataData = { objects: { id: string; name: string; description: string; field_count: number }[]; fields: MetadataField[]; metrics: { id: string; name: string; unit: string; formula: string }[] };
const fieldSchema = z.object({ name: z.string().min(1, "请填写字段名称"), key: z.string().regex(/^[a-z][a-z0-9_]*$/, "使用小写字母、数字和下划线"), type: z.string().min(1), description: z.string(), placeholder: z.string().min(1, "请填写中文提示"), example: z.string().min(1, "请填写示例值"), required: z.boolean() });
type FieldForm = z.infer<typeof fieldSchema>;
const fieldStorageKey = "hhai-metadata-fields-v1";
const makeFieldId = () => `field-${Date.now()}`;

export function MetadataStudio() {
  const queryClient = useQueryClient();
  const metadata = useQuery({ queryKey: ["metadata"], queryFn: async () => {
    const data = await getMockData<MetadataData>("metadata");
    const stored = typeof window === "undefined" ? null : localStorage.getItem(fieldStorageKey);
    return { ...data, fields: stored ? JSON.parse(stored) as MetadataField[] : data.fields };
  } });
  const [objectId, setObjectId] = useState("store");
  const [modal, setModal] = useState<MetadataField | null | false>(false);
  const [persistenceNote, setPersistenceNote] = useState("");
  const form = useForm<FieldForm>({ resolver: zodResolver(fieldSchema), defaultValues: { name: "", key: "", type: "文本", description: "", placeholder: "请输入", example: "示例值", required: false } });

  function openAdd() {
    form.reset({ name: "", key: "", type: "文本", description: "", placeholder: "请输入", example: "示例值", required: false });
    setModal(null);
  }

  function openEdit(field: MetadataField) {
    form.reset({ name: field.name, key: field.key, type: field.type, description: field.description, placeholder: field.placeholder, example: field.example, required: field.required });
    setModal(field);
  }

  async function persistFields(updated: MetadataField[]) {
    queryClient.setQueryData(["metadata"], (previous: MetadataData | undefined) => previous ? { ...previous, fields: updated } : previous);
    localStorage.setItem(fieldStorageKey, JSON.stringify(updated));
    try {
      const response = await fetch("/api/local/metadata", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ fields: updated }) });
      setPersistenceNote(response.ok ? "已保存到本地 Metadata JSON" : "文件写入失败，已保存在当前浏览器");
    } catch {
      setPersistenceNote("文件服务不可用，已保存在当前浏览器");
    }
  }

  async function save(values: FieldForm) {
    const current = metadata.data?.fields ?? [];
    const updated = modal
      ? current.map((field) => field.id === modal.id ? { ...field, ...values } : field)
      : [...current, { id: makeFieldId(), object: objectId, ...values }];
    await persistFields(updated);
    setModal(false);
  }

  function remove(id: string) {
    const updated = (metadata.data?.fields ?? []).filter((field) => field.id !== id);
    void persistFields(updated);
  }

  function move(index: number, direction: -1 | 1) {
    const fields = metadata.data?.fields ?? [];
    const selected = fields.filter((field) => field.object === objectId);
    const other = fields.filter((field) => field.object !== objectId);
    const target = index + direction;
    if (target < 0 || target >= selected.length) return;
    [selected[index], selected[target]] = [selected[target], selected[index]];
    const updated = [...other, ...selected];
    void persistFields(updated);
  }

  if (!metadata.data) return <LoadingState />;
  const fields = metadata.data.fields;
  const selectedFields = fields.filter((field) => field.object === objectId);

  return <>
    <PageHeading eyebrow="CONFIGURATION · METADATA" title="Metadata Studio" description="以业务对象和字段契约驱动 Skill 输入与报告结构。" action={<button className="button button-primary" onClick={openAdd}><Plus size={15} />新增字段</button>} />
    {persistenceNote && <p className="inline-note">{persistenceNote}</p>}
    <div className="content-grid">
      <div className="stack">
        <Panel title="Objects" icon={Database} meta={`${metadata.data.objects.length} 个对象`}>
          <div className="toolbar">{metadata.data.objects.map((object) => <button key={object.id} className={`button ${objectId === object.id ? "button-primary" : ""}`} onClick={() => setObjectId(object.id)}>{object.name}<span className="card-meta">{fields.filter((field) => field.object === object.id).length}</span></button>)}</div>
          <p className="inline-note section-gap">{metadata.data.objects.find((object) => object.id === objectId)?.description}</p>
        </Panel>
        <Panel title="Fields" icon={Braces} meta={`${selectedFields.length} 个字段`}>
          {selectedFields.map((field, index) => <div className="metadata-row" key={field.id}>
            <div className="metadata-order">{String(index + 1).padStart(2, "0")}</div>
            <div><div className="metadata-name">{field.name}{field.required && <span style={{ color: "var(--amber)", marginLeft: 5 }}>必填</span>}</div><div className="metadata-key">{field.key}</div></div>
            <div className="metadata-type">{field.type}</div><div className="metadata-type">{field.description}</div>
            <div className="toolbar"><button className="icon-button" aria-label="上移字段" onClick={() => move(index, -1)}><ArrowUp size={12} /></button><button className="icon-button" aria-label="下移字段" onClick={() => move(index, 1)}><ArrowDown size={12} /></button><button className="icon-button" aria-label="编辑字段" onClick={() => openEdit(field)}><PencilLine size={12} /></button><button className="icon-button" aria-label="删除字段" onClick={() => remove(field.id)}><Trash2 size={12} /></button></div>
          </div>)}
        </Panel>
        <Panel title="Metrics" icon={Eye} meta={`${metadata.data.metrics.length} 个指标`}>
          <div className="table-scroll"><table className="data-table"><thead><tr><th>指标</th><th>单位</th><th>计算口径</th></tr></thead><tbody>{metadata.data.metrics.map((metric) => <tr key={metric.id}><td className="table-primary">{metric.name}</td><td>{metric.unit}</td><td>{metric.formula}</td></tr>)}</tbody></table></div>
        </Panel>
      </div>
      <aside className="stack">
        <Panel title="动态表单预览" icon={Eye} meta="基于当前 Fields">
          <div className="preview-fields">{selectedFields.map((field) => <div className="field" key={field.id}><label>{field.name}{field.required ? " *" : ""}</label>{field.type === "单选" ? <select><option>{field.placeholder}</option><option>低风险</option><option>中风险</option><option>高风险</option></select> : <input type={field.type === "金额" || field.type === "数字" || field.type === "百分比" || field.type === "评分" ? "number" : "text"} placeholder={field.placeholder} />}<span className="inline-note">示例：{field.example}</span></div>)}</div>
          <button className="button button-primary" style={{ width: "100%", marginTop: 15 }}><Eye size={14} />预览输入表单</button>
        </Panel>
        <Panel title="本地 Schema" icon={Braces}>
          <p className="inline-note">字段由 `packages/hhai-skills/metadata/metadata.json` 定义；新增、编辑、排序和删除会写回该 Metadata 文件，并保留浏览器副本。</p>
        </Panel>
      </aside>
    </div>
    {modal !== false && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(false); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="field-form-title"><div className="modal-header"><h2 id="field-form-title">{modal ? "编辑字段" : "新增字段"}</h2><button className="icon-button" onClick={() => setModal(false)} aria-label="关闭"><X size={15} /></button></div>
        <form onSubmit={form.handleSubmit(save)}><div className="field-grid">
          <Field label="字段名称" error={form.formState.errors.name?.message}><input {...form.register("name")} /></Field>
          <Field label="字段键" error={form.formState.errors.key?.message}><input {...form.register("key")} /></Field>
          <Field label="字段类型"><select {...form.register("type")}><option>文本</option><option>数字</option><option>金额</option><option>百分比</option><option>评分</option><option>单选</option><option>日期</option></select></Field>
          <Field label="字段说明"><input {...form.register("description")} /></Field>
          <Field label="中文提示"><input {...form.register("placeholder")} /></Field>
          <Field label="示例值"><input {...form.register("example")} /></Field>
          <label className="toolbar" style={{ color: "var(--muted)", fontSize: 11 }}><input type="checkbox" {...form.register("required")} />设为必填</label>
        </div><div className="form-actions"><button type="button" className="button" onClick={() => setModal(false)}>取消</button><button className="button button-primary" type="submit">保存字段</button></div></form>
      </section>
    </div>}
  </>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="field"><label>{label}</label>{children}{error && <span className="form-error">{error}</span>}</div>;
}