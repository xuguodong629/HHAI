import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json() as { skill_id?: string; input?: Record<string, unknown> };
  if (body.skill_id !== "rbos-store-health") return NextResponse.json({ detail: "未知 Skill" }, { status: 404 });

  try {
    const file = await readFile(path.resolve(process.cwd(), "..", "mock/store-health.json"), "utf8");
    const report = JSON.parse(file) as { report_id: string; generated_at: string; summary: Record<string, number | string>; store: { id: string; name: string; region: string } };
    const input = body.input ?? {};
    report.report_id = `RPT-MOCK-${Date.now()}`;
    report.generated_at = new Date().toISOString();
    report.store.id = String(input.store_id ?? report.store.id);
    if (typeof input.sales_amount === "number") report.summary.sales_amount = input.sales_amount;
    if (typeof input.gross_margin_rate === "number") report.summary.gross_margin_rate = input.gross_margin_rate / 100;
    if (typeof input.inventory_days === "number") report.summary.inventory_days = input.inventory_days;
    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ detail: "门店健康 Mock 报告无法读取" }, { status: 500 });
  }
}