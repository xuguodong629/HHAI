import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MONOREPO_ROOT = PROJECT_ROOT.parents[1]
SKILLS_ROOT = MONOREPO_ROOT / "packages" / "hhai-skills"
REGISTRY_PATH = SKILLS_ROOT / "runtime" / "registry.json"
MOCK_REPORT_PATH = PROJECT_ROOT / "mock" / "store-health.json"
SKILL_DIRECTORY = SKILLS_ROOT / "skills" / "rbos" / "rbos-store-health"
router = APIRouter(prefix="/api/runtime", tags=["Runtime"])


class RunRequest(BaseModel):
    skill_id: str = "rbos-store-health"
    input: dict[str, Any] = Field(default_factory=dict)


class ReportRequest(BaseModel):
    skill_id: str = "rbos-store-health"
    report_id: str | None = None
    report: dict[str, Any] | None = None


def _read_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise HTTPException(status_code=500, detail=f"本地数据文件不存在：{path.name}") from error
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=500, detail=f"本地 JSON 格式无效：{path.name}") from error


def _registry() -> dict[str, Any]:
    return _read_json(REGISTRY_PATH)


def _mock_report() -> dict[str, Any]:
    return _read_json(MOCK_REPORT_PATH)


@router.get("/skills")
def list_skills() -> dict[str, Any]:
    registry = _registry()
    registry["packages"] = [package for package in registry["packages"] if package.get("kind") == "skill"]
    return registry


@router.get("/skill/{skill_id}")
def get_skill(skill_id: str) -> dict[str, Any]:
    package = next(
        (item for item in _registry()["packages"] if item.get("id") == skill_id),
        None,
    )
    if package is None:
        raise HTTPException(status_code=404, detail="未找到注册 Skill")
    result = {"package": package}
    if skill_id == "rbos-store-health":
        result["description"] = (SKILL_DIRECTORY / "SKILL.md").read_text(encoding="utf-8")
        result["schema"] = _read_json(SKILL_DIRECTORY / "schemas" / "input.schema.json")
        result["prompt"] = (SKILL_DIRECTORY / "prompts" / "main.md").read_text(encoding="utf-8")
    return result


@router.post("/run")
def run_skill(request: RunRequest) -> dict[str, Any]:
    if request.skill_id != "rbos-store-health":
        raise HTTPException(status_code=404, detail="当前仅提供门店健康 Mock Skill")
    report = _mock_report()
    input_data = request.input
    report["report_id"] = f"RPT-MOCK-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    report["generated_at"] = datetime.now(timezone.utc).isoformat()
    report["store"]["id"] = str(input_data.get("store_id", report["store"]["id"]))
    if isinstance(input_data.get("sales_amount"), (int, float)):
        report["summary"]["sales_amount"] = input_data["sales_amount"]
    if isinstance(input_data.get("gross_margin_rate"), (int, float)):
        report["summary"]["gross_margin_rate"] = input_data["gross_margin_rate"] / 100
    if isinstance(input_data.get("inventory_days"), (int, float)):
        report["summary"]["inventory_days"] = input_data["inventory_days"]
    return report


@router.post("/report")
def create_report(request: ReportRequest) -> dict[str, Any]:
    if request.report is not None:
        return request.report
    if request.skill_id != "rbos-store-health":
        raise HTTPException(status_code=404, detail="未找到可用的 Mock 报告模板")
    report = _mock_report()
    if request.report_id:
        report["report_id"] = request.report_id
    return report