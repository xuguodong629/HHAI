from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_runtime_lists_registered_and_local_skills() -> None:
    response = client.get("/api/runtime/skills")
    assert response.status_code == 200
    skill_ids = {package["id"] for package in response.json()["packages"]}
    assert "rbos-store-health" in skill_ids
    assert "rbos-marketing-forecasting" in skill_ids


def test_runtime_returns_skill_contract() -> None:
    response = client.get("/api/runtime/skill/rbos-store-health")
    assert response.status_code == 200
    assert response.json()["schema"]["required"] == ["store_id", "period"]


def test_runtime_run_returns_mock_report() -> None:
    response = client.post("/api/runtime/run", json={"skill_id": "rbos-store-health", "input": {"store_id": "ST-TEST", "sales_amount": 120000, "gross_margin_rate": 25, "inventory_days": 30}})
    assert response.status_code == 200
    assert response.json()["store"]["id"] == "ST-TEST"
    assert response.json()["summary"]["sales_amount"] == 120000
    assert response.json()["summary"]["gross_margin_rate"] == 0.25


def test_runtime_report_returns_local_template() -> None:
    response = client.post("/api/runtime/report", json={"skill_id": "rbos-store-health", "report_id": "RPT-TEST"})
    assert response.status_code == 200
    assert response.json()["report_id"] == "RPT-TEST"


def test_unknown_skill_is_not_run() -> None:
    response = client.post("/api/runtime/run", json={"skill_id": "unknown"})
    assert response.status_code == 404


def test_report_list_falls_back_to_local_mock() -> None:
    response = client.get("/api/reports")
    assert response.status_code == 200
    assert response.json()[0]["id"] == "RPT-20260926-001"