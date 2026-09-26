import json
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MONOREPO_ROOT = PROJECT_ROOT.parents[1]
TERRITORIES_PATH = MONOREPO_ROOT / "packages" / "hhai-skills" / "territory" / "territories.json"


def load_territories() -> list[dict[str, Any]]:
    return json.loads(TERRITORIES_PATH.read_text(encoding="utf-8"))