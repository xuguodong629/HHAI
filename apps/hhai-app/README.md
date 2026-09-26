# HHAI-App

HHAI-App 是 HHAI V2.0 的本地优先软件 MVP，提供从 Territory 与 Metadata，到 Skill 运行、Report 输出和 Dashboard 展示的可运行闭环。前端采用 Next.js、React、TypeScript、Tailwind CSS、Zustand、TanStack Query、React Hook Form、Zod 和 Recharts；后端采用 Python 3.10、FastAPI 与 SQLite。

本项目只消费 HHAI-Skills V2.0，不修改其架构、不重做 Runtime、不调用 AI。业务界面使用本地 JSON Mock，数据库只保存平台级 Territory、Metadata、Report 和 Settings 记录。

## 运行方式

前置条件：Node.js 20+、npm、Python 3.10。

安装并启动前端：

```powershell
npm.cmd install --prefix frontend
npm.cmd --prefix frontend run dev
```

前端默认地址为 `http://localhost:3000`。首页及 Mock 页面不依赖数据库或后端即可运行。

安装并启动 FastAPI：

```powershell
py -3.10 -m pip install -r backend/requirements.txt
py -3.10 -m uvicorn backend.main:app --reload --port 8000
```

Runtime API 文档地址为 `http://localhost:8000/docs`。接口只读取本地 Registry、Skill 文件和 Mock JSON，返回 Mock Report，不调用 AI。

初始化 SQLite：

```powershell
py -3.10 scripts/init_database.py
```

默认数据库路径：Monorepo 根目录的 `data/database/hhai.db`。可通过 `HHAI_DATA_DB` 环境变量或 `--path` 参数覆盖。脚本幂等创建 `territories`、`metadata_fields`、`reports`、`settings` 四张平台表，不创建门店或代理商业务表。

运行验证：

```powershell
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run build
py -3.10 -m pytest tests
```

## 目录说明

- `frontend/`：Next.js App Router、页面、组件、功能模块、数据服务与 UI 状态。
- `backend/`：FastAPI API、JSON Runtime 服务、领域数据读取、Schema、Model 与 SQLite 初始化。
- `shared/`：前后端共享契约。
- `mock/`：软件演示使用的 Store Health Report 和报告列表 JSON。
- `packages/hhai-skills/territory/`、`packages/hhai-skills/metadata/`：Territory 与 Metadata 唯一数据源，App 直接消费并写回 JSON。
- `packages/hhai-skills/skills/rbos/rbos-store-health/`：HHAI 唯一业务演示 Skill 包。
- `packages/hhai-skills/runtime/registry.json`：Runtime 唯一注册表，App 只读消费，不在软件层维护注册副本。
- `config/`、`docker/`、`scripts/`、`tests/`：配置、容器说明、运维脚本和自动化测试。

## HHAI-Skills 依赖

HHAI-App 消费同一 Monorepo 中 `packages/hhai-skills/runtime/registry.json` 与已注册 Skill 契约。新增业务能力时，在 `packages/hhai-skills/skills/` 按 Skill 标准创建并注册；App Runtime 不合成、不复制、不重做注册表。HHAI-Skills 与 HHAI-App 的职责边界由根 `CONSTITUTION.md` 冻结。

## 开发流程

1. 先定义 Territory 与 Metadata，再基于 Metadata 组织业务输入。
2. 在 Skills 中心消费注册表；业务执行能力归属于 Skill。
3. 通过 Runtime API 读取 Skill 契约并生成 Mock Report。
4. Dashboard 只消费 Report JSON，不建立门店或代理商业务表。
5. 验证前端 lint/build、FastAPI pytest 与 SQLite 初始化。

## 截图

截图目录预留为 `frontend/public/screenshots/`。当前 MVP 截图清单见交付报告；后续截图可以放入该目录。