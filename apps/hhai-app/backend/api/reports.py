from typing import Any

from fastapi import APIRouter

from backend.reports.service import list_reports

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("")
def get_reports() -> list[dict[str, Any]]:
    return list_reports()