import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const monorepoRoot = path.resolve(process.cwd(), "..", "..", "..");
const appRoot = path.resolve(process.cwd(), "..");
const skillsRoot = path.resolve(monorepoRoot, "packages", "hhai-skills");
const files: Record<string, { read: () => Promise<string>; markdown?: boolean }> = {
  territory: { read: () => readFile(path.resolve(skillsRoot, "territory", "territories.json"), "utf8") },
  metadata: { read: () => readFile(path.resolve(skillsRoot, "metadata", "metadata.json"), "utf8") },
  "store-health": { read: () => readFile(path.resolve(appRoot, "mock", "store-health.json"), "utf8") },
  reports: { read: () => readFile(path.resolve(appRoot, "mock", "reports.json"), "utf8") },
  registry: { read: () => readFile(path.resolve(monorepoRoot, "packages", "hhai-skills", "runtime", "registry.json"), "utf8") },
  "skill-description": { read: () => readFile(path.resolve(monorepoRoot, "packages", "hhai-skills", "skills", "rbos", "rbos-store-health", "SKILL.md"), "utf8"), markdown: true },
  "skill-prompt": { read: () => readFile(path.resolve(monorepoRoot, "packages", "hhai-skills", "skills", "rbos", "rbos-store-health", "prompts", "main.md"), "utf8"), markdown: true },
  "skill-schema": { read: () => readFile(path.resolve(monorepoRoot, "packages", "hhai-skills", "skills", "rbos", "rbos-store-health", "schemas", "input.schema.json"), "utf8") },
  "skill-report": { read: () => readFile(path.resolve(appRoot, "mock", "store-health.json"), "utf8") },
};

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const file = files[name];
  if (!file) return NextResponse.json({ detail: "未找到本地数据" }, { status: 404 });

  try {
    const content = await file.read();
    if (file.markdown) return new NextResponse(content, { headers: { "content-type": "text/markdown; charset=utf-8" } });
    const data = JSON.parse(content) as { packages?: unknown[] };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ detail: "本地数据文件无法读取" }, { status: 500 });
  }
}