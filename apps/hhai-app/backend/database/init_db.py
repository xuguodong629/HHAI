import argparse
import os
import sqlite3
from pathlib import Path

MONOREPO_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_DATABASE_PATH = Path(os.environ.get("HHAI_DATA_DB", str(MONOREPO_ROOT / "data" / "database" / "hhai.db")))

SCHEMA = """
CREATE TABLE IF NOT EXISTS territories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    organization TEXT NOT NULL,
    status TEXT NOT NULL,
    payload_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS metadata_fields (
    id TEXT PRIMARY KEY,
    object_id TEXT NOT NULL,
    field_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    field_type TEXT NOT NULL,
    required INTEGER NOT NULL DEFAULT 0,
    payload_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    markdown TEXT NOT NULL DEFAULT '',
    report_json TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


def initialize_database(database_path: Path = DEFAULT_DATABASE_PATH) -> Path:
    database_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(database_path) as connection:
        connection.executescript(SCHEMA)
        connection.execute("PRAGMA user_version = 1")
    return database_path


def main() -> None:
    parser = argparse.ArgumentParser(description="初始化 HHAI-App 平台 SQLite 数据库")
    parser.add_argument("--path", type=Path, default=DEFAULT_DATABASE_PATH, help="覆盖默认数据库路径")
    args = parser.parse_args()
    database_path = initialize_database(args.path)
    print(f"SQLite 初始化成功：{database_path}")


if __name__ == "__main__":
    main()