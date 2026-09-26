# HHAI

HHAI 是面向厂家区域经营的本地优先 AI 操作系统 Monorepo。项目由软件层 `apps/hhai-app` 和共享能力层 `packages/hhai-skills` 组成，知识、Metadata、Territory 与 Runtime 形成统一业务闭环。

## 最高设计规范

开始任何 HHAI 开发前，必须先阅读根目录 [`CONSTITUTION.md`](./CONSTITUTION.md)。它是 HHAI 唯一最高设计文档，定义项目宪法、Monorepo、四层架构、四大 Engine、六大 OS、开发路线和变更治理。子项目 README 仅说明子项目自身的运行与维护。

## 项目入口

- 软件：[`apps/hhai-app/README.md`](./apps/hhai-app/README.md)
- 能力包：[`packages/hhai-skills/README.md`](./packages/hhai-skills/README.md)
- 文档中心：[`docs/README.md`](./docs/README.md)
- 全局规范：同级 `HHAI-Standards/`

## 本地运行

前端：

```powershell
npm.cmd install --prefix apps/hhai-app/frontend
npm.cmd --prefix apps/hhai-app/frontend run dev
```

后端：

```powershell
py -3.10 -m pip install -r apps/hhai-app/backend/requirements.txt
py -3.10 -m uvicorn backend.main:app --app-dir apps/hhai-app --reload --port 8000
```

HHAI-App 的详细 API、Mock、数据库与测试说明见其子项目 README。