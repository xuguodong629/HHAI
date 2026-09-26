import sqlite3

from backend.database.init_db import initialize_database
from backend.reports.service import list_reports


def test_database_initialization_creates_only_platform_tables(tmp_path) -> None:
    database_path = initialize_database(tmp_path / "hhai.db")
    with sqlite3.connect(database_path) as connection:
        tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        version = connection.execute("PRAGMA user_version").fetchone()[0]

    assert {"territories", "metadata_fields", "reports", "settings"}.issubset(tables)
    assert "store" not in tables
    assert "dealer" not in tables
    assert version == 1


def test_report_service_reads_database_rows(tmp_path) -> None:
    database_path = initialize_database(tmp_path / "reports.db")
    with sqlite3.connect(database_path) as connection:
        connection.execute(
            "INSERT INTO reports (id, title, skill_id, created_at, risk_level) VALUES (?, ?, ?, ?, ?)",
            ("RPT-DB", "数据库报告", "rbos-store-health", "2026-09-26", "低风险"),
        )

    assert list_reports(database_path)[0]["id"] == "RPT-DB"