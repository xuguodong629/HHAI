import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type TerritoryRecord = { id: string; name: string; owner: string; organization: string; category: string; channel: string; region: string; target: number; status: string };

export async function PUT(request: Request) {
  const body = await request.json() as { territories?: TerritoryRecord[] };
  if (!Array.isArray(body.territories) || body.territories.some((item) => !item.id || !item.name || !Number.isFinite(item.target))) {
    return NextResponse.json({ detail: "Territory JSON 数据无效" }, { status: 400 });
  }

  const content = `${JSON.stringify(body.territories, null, 2)}\n`;
  const monorepoRoot = path.resolve(process.cwd(), "..", "..", "..");
  try {
    await writeFile(path.resolve(monorepoRoot, "packages", "hhai-skills", "territory", "territories.json"), content, "utf8");
    return NextResponse.json({ saved: true, count: body.territories.length });
  } catch {
    return NextResponse.json({ detail: "无法写入 Territory 本地 JSON" }, { status: 500 });
  }
}