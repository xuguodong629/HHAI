"""Migrate the legacy HHAI-Skills tree into the V2 platform layout."""

from __future__ import annotations

import json
import shutil
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SYSTEMS = {
    "RBOS": "rbos",
    "BOS": "bos",
    "COS": "cos",
    "UOS": "uos",
    "RWOS": "rwos",
    "DOS": "dos",
    "Industry": "industry",
}
RESOURCE_TARGETS = {
    "AI": Path("shared/ai"),
    "Shared": Path("shared/resources"),
    "Templates": Path("shared/templates"),
    "TOS": Path("shared/tos"),
    "Assets": Path("assets"),
    "Docs": Path("docs"),
    "Index": Path("index"),
}


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def move_once(source: Path, target: Path) -> None:
    if not source.exists():
        return
    if source.resolve() == target.resolve():
        if source.name != target.name:
            temporary = source.with_name(f".{source.name}.v2-migrate")
            source.rename(temporary)
            temporary.rename(target)
        return
    if target.parent.exists() and target.parent.resolve() == source.resolve():
        temporary = source.with_name(f".{source.name}.v2-migrate")
        source.rename(temporary)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(temporary), str(target))
        return
    if target.exists():
        raise FileExistsError(f"Migration target already exists: {target}")
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(source), str(target))


def migrate_skill_packages() -> list[dict]:
    packages: list[dict] = []
    for legacy_name, system in SYSTEMS.items():
        source_root = ROOT / legacy_name
        if not source_root.exists():
            continue
        package_dirs = sorted(
            {
                metadata.parent
                for metadata in source_root.rglob("metadata.json")
                if (metadata.parent / "skill.md").exists()
            }
        )
        for package_dir in package_dirs:
            metadata = load_json(package_dir / "metadata.json")
            skill_id = str(metadata.get("id") or package_dir.name).strip()
            target = ROOT / "skills" / system / skill_id
            if package_dir != target:
                move_once(package_dir, target)
            packages.append(
                {
                    "id": skill_id,
                    "kind": "skill",
                    "system": system,
                    "path": target.relative_to(ROOT).as_posix(),
                    "metadata": metadata,
                }
            )

        remaining = list(source_root.iterdir()) if source_root.exists() else []
        for child in remaining:
            move_once(child, ROOT / "skills" / system / "_legacy" / child.name)
        if source_root.exists() and not any(source_root.iterdir()):
            source_root.rmdir()
    return packages


def recover_skill_packages() -> list[dict]:
    packages: list[dict] = []
    for system in SYSTEMS.values():
        source_root = ROOT / "skills" / system
        for skill_file in sorted(source_root.rglob("skill.md")):
            package_dir = skill_file.parent
            metadata = load_json(package_dir / "metadata.json")
            skill_id = str(metadata.get("id") or package_dir.name).strip()
            target = source_root / skill_id
            if package_dir != target:
                move_once(package_dir, target)
            packages.append(
                {
                    "id": skill_id,
                    "kind": "skill",
                    "system": system,
                    "path": target.relative_to(ROOT).as_posix(),
                    "metadata": metadata,
                }
            )
    return packages


def migrate_sop() -> list[dict]:
    source_root = ROOT / "SOP"
    if not source_root.exists():
        target_root = ROOT / "sop"
    else:
        target_root = ROOT / "sop"
        if source_root.resolve() == target_root.resolve():
            move_once(source_root, target_root)
        elif target_root.exists():
            for child in source_root.iterdir():
                move_once(child, target_root / child.name)
            if source_root.exists() and not any(source_root.iterdir()):
                source_root.rmdir()
        else:
            move_once(source_root, target_root)
    if not target_root.exists():
        return []
    packages: list[dict] = []
    for skill_file in sorted(target_root.rglob("skill.md")):
        metadata_path = skill_file.parent / "metadata.json"
        metadata = load_json(metadata_path)
        package_dir = skill_file.parent
        package_id = str(metadata.get("id") or package_dir.name).strip()
        packages.append(
            {
                "id": package_id,
                "kind": "sop",
                "system": "sop",
                "path": package_dir.relative_to(ROOT).as_posix(),
                "metadata": metadata,
            }
        )
    return packages


def migrate_resources() -> None:
    for source_name, relative_target in RESOURCE_TARGETS.items():
        move_once(ROOT / source_name, ROOT / relative_target)


def normalize_package(package: dict) -> None:
    package_dir = ROOT / package["path"]
    renames = {
        "skill.md": "SKILL.md",
        "prompts.md": "prompts/main.md",
        "playbook.md": "playbooks/main.md",
        "examples.md": "examples/overview.md",
        "checklists.md": "checklist.md",
    }
    for old_name, new_name in renames.items():
        source = package_dir / old_name
        target = package_dir / new_name
        if source.exists():
            target.parent.mkdir(parents=True, exist_ok=True)
            move_once(source, target)
    (package_dir / "metadata.json").touch(exist_ok=True)


def collect_package_catalog(packages: list[dict]) -> None:
    for package in packages:
        normalize_package(package)

    registry = sorted(packages, key=lambda item: (item["kind"], item["id"]))
    by_system: dict[str, list[str]] = defaultdict(list)
    aliases: dict[str, str] = {}
    for package in registry:
        by_system[package["system"]].append(package["id"])
        aliases[package["id"]] = package["path"]

    write_json(
        ROOT / "runtime/registry.json", {"version": "2.0.0", "packages": registry}
    )
    write_json(ROOT / "runtime/router.json", {"systems": by_system})
    write_json(ROOT / "runtime/aliases.json", {"aliases": aliases})
    write_json(
        ROOT / "runtime/capabilities.json",
        {
            "package_count": len(registry),
            "by_kind": dict(Counter(item["kind"] for item in registry)),
            "by_system": {key: len(value) for key, value in sorted(by_system.items())},
            "package_contract": [
                "SKILL.md",
                "metadata.json",
                "prompts/",
                "playbooks/",
                "checklist.md",
            ],
        },
    )
    write_json(
        ROOT / "runtime/version.json",
        {"name": "HHAI Skills Platform", "version": "2.0.0", "status": "stable"},
    )

    skill_registry = [item for item in registry if item["kind"] == "skill"]
    write_json(
        ROOT / "index/skills_index.json",
        {"version": "2.0.0", "skills": skill_registry},
    )
    write_json(
        ROOT / "index/navigation.json",
        {
            "centers": [
                "skills",
                "prompts",
                "playbooks",
                "sop",
                "cases",
                "metrics",
                "dashboards",
                "graphs",
                "schemas",
                "runtime",
                "shared",
                "index",
                "assets",
                "docs",
            ],
            "runtime_registry": "../runtime/registry.json",
        },
    )
    summary = [
        "# HHAI-Skills V2.0 Summary",
        "",
        f"Registered packages: {len(registry)}",
        "",
    ]
    for system, package_ids in sorted(by_system.items()):
        summary.extend([f"## {system}", ""])
        for package_id in sorted(package_ids):
            package = next(item for item in registry if item["id"] == package_id)
            summary.append(f"- [{package_id}](../{package['path']}/README.md)")
        summary.append("")
    (ROOT / "index/SUMMARY.md").write_text("\n".join(summary), encoding="utf-8")

    center_catalogs = {
        "prompts": "main.md",
        "playbooks": "main.md",
        "cases": "examples/overview.md",
        "metrics": "metrics.json",
        "dashboards": "dashboard_schema.json",
    }
    for center, relative_file in center_catalogs.items():
        entries = [
            {
                "id": item["id"],
                "package": item["path"],
                "path": f"{item['path']}/{relative_file}",
            }
            for item in registry
            if (ROOT / item["path"] / relative_file).exists()
        ]
        write_json(
            ROOT / center / "catalog.json", {"version": "2.0.0", "entries": entries}
        )

    graph = {"version": "2.0.0", "nodes": [], "relationships": []}
    for package in skill_registry:
        metadata = package["metadata"]
        graph["nodes"].append(
            {
                "id": package["id"],
                "type": "skill",
                "system": package["system"],
                "path": package["path"],
            }
        )
        links = load_json(ROOT / package["path"] / "knowledge_links.json")
        for upstream in links.get("upstream", []):
            graph["relationships"].append(
                {"from": package["id"], "to": upstream, "type": "upstream"}
            )
        for related in metadata.get("related_skills", []):
            graph["relationships"].append(
                {"from": package["id"], "to": related, "type": "related"}
            )
    write_json(ROOT / "index/knowledge_graph.json", graph)


def create_centers() -> None:
    (ROOT / "shared").mkdir(parents=True, exist_ok=True)
    centers = {
        "prompts": "Global prompt center. Package prompts remain co-located and are registered by runtime/registry.json.",
        "playbooks": "Reusable action playbook center. Package playbooks remain co-located and are registered by runtime/registry.json.",
        "cases": "Reusable business case center.",
        "metrics": "Canonical KPI and metric definitions.",
        "dashboards": "Dashboard schemas and presentation contracts.",
        "graphs": "Knowledge graph exports and graph source material.",
        "schemas": "Shared JSON schemas.",
    }
    for name, description in centers.items():
        path = ROOT / name
        path.mkdir(parents=True, exist_ok=True)
        readme = path / "README.md"
        if not readme.exists():
            readme.write_text(f"# {name.title()}\n\n{description}\n", encoding="utf-8")


def main() -> None:
    create_centers()
    packages = migrate_skill_packages()
    packages.extend(recover_skill_packages())
    packages.extend(migrate_sop())
    migrate_resources()
    collect_package_catalog(packages)
    print(f"Migrated {len(packages)} packages to HHAI-Skills V2.0")


if __name__ == "__main__":
    main()
