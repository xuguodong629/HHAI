from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.reports import router as reports_router
from backend.api.runtime import router as runtime_router

app = FastAPI(title="HHAI-App Runtime API", version="0.1.0", docs_url="/docs")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
app.include_router(runtime_router)
app.include_router(reports_router)