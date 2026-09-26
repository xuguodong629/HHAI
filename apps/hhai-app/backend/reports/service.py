import json
import os
import sqlite3
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MONOREPO_ROOT = Path(__file__).resolve().parents[4]
MOCK_REPORTS_PATH = PROJECT_ROOT / "mock" / "reports.json"
DATABASE_PATH = Path(os.environ.get("HHAI_DATA_DB", str(MONOREPO_ROOT / "data" / "database" / "hhai.db")))


def list_reports(database_path: Path = DATABASE_PATH) -> list[dict[str, Any]]:
    if database_path.exists():
        try:
            with sqlite3.connect(database_path) as connection:
                rows = connection.execute(
                    "SELECT id, title, skill_id, created_at, risk_level FROM reports ORDER BY created_at DESC"
                ).fetchall()
            if rows:
                return [dict(zip(("id", "title", "skill_id", "created_at", "risk_level"), row)) for row in rows]
        except sqlite3.Error:
            pass
    return json.loads(MOCK_REPORTS_PATH.read_text(encoding="utf-8"))