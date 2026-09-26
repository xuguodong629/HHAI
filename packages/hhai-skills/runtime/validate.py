"""Validate the HHAI-Skills V2 runtime contract."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CENTERS = {
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
}


def main() -> None:
    missing = sorted(name for name in CENTERS if not (ROOT / name).is_dir())
    if missing:
        raise SystemExit(f"Missing V2 centers: {missing}")

    registry_path = ROOT / "runtime/registry.json"
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    packages = registry.get("packages", [])
    errors: list[str] = []
    for package in packages:
        package_path = ROOT / package["path"]
        for required in ("metadata.json",):
            if not (package_path / required).exists():
                errors.append(f"{package['id']}: missing {required}")
        if package["kind"] == "skill" and not (package_path / "SKILL.md").exists():
            errors.append(f"{package['id']}: missing SKILL.md")
    if errors:
        raise SystemExit("\n".join(errors[:20]))
    print(f"V2 runtime OK: {len(packages)} packages")


if __name__ == "__main__":
    main()
