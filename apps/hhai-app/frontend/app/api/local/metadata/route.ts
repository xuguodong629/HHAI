import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type MetadataField = { id: string; object: string; name: string; key: string; type: string; required: boolean; description: string; placeholder: string; example: string };

export async function PUT(request: Request) {
  const body = await request.json() as { fields?: MetadataField[] };
  if (!Array.isArray(body.fields)) return NextResponse.json({ detail: "Metadata 字段列表无效" }, { status: 400 });

  const monorepoRoot = path.resolve(process.cwd(), "..", "..", "..");
  const metadataPath = path.resolve(monorepoRoot, "packages", "hhai-skills", "metadata", "metadata.json");
  try {
    const metadata = JSON.parse(await readFile(metadataPath, "utf8")) as { objects: { id: string }[]; fields: MetadataField[]; metrics: unknown[] };
    const objectIds = new Set(metadata.objects.map((object) => object.id));
    const valid = body.fields.every((field) => field.id && field.name && /^[a-z][a-z0-9_]*$/.test(field.key) && field.type && field.description && field.placeholder && field.example && typeof field.required === "boolean" && objectIds.has(field.object));
    if (!valid) return NextResponse.json({ detail: "Metadata 字段内容或对象引用无效" }, { status: 400 });

    metadata.fields = body.fields;
    const content = `${JSON.stringify(metadata, null, 2)}\n`;
    await writeFile(metadataPath, content, "utf8");
    return NextResponse.json({ saved: true, count: metadata.fields.length });
  } catch {
    return NextResponse.json({ detail: "无法写入 Metadata 本地 JSON" }, { status: 500 });
  }
}