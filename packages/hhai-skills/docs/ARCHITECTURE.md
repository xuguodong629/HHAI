# HHAI-Skills V2.0 架构说明

> 架构状态：V2.0 Frozen Architecture
>
> 这是 HHAI V2.0 第一份冻结文档，后续所有 Codex 会话都以 [00_HHAI_V2.0_ARCHITECTURE_FREEZE.md](00_HHAI_V2.0_ARCHITECTURE_FREEZE.md) 为唯一规范。

HHAI-Skills V2.0 是可被 Codex、ChatGPT Agent 和业务应用发现、路由和复用的 Business Skill Runtime。

## 一级目录

`skills` 承载核心能力包；`prompts`、`playbooks`、`sop`、`cases`、`metrics`、`dashboards`、`graphs` 和 `schemas` 是可复用中心；`runtime` 管理注册、路由、别名和能力契约；`shared`、`index`、`assets` 和 `docs` 提供公共资源、导航、资产和规范。

## Skill Package

每个核心 Skill 位于 `skills/<system>/<skill-id>/`，入口为 `SKILL.md`，并配套 `metadata.json`、Prompt、Playbook、指标、知识链接、Checklist、案例和 Dashboard Schema。

## Runtime

`runtime/migrate_v2.py` 负责迁移和生成索引，`runtime/validate.py` 校验中心目录、注册表和包入口。运行时注册表是 Agent 发现能力的唯一入口。

## 依赖方向

核心 Skills 引用共享 Prompt、Playbook、SOP、指标和行业知识；应用层只依赖 Runtime 注册表，不复制业务知识。

## V2.0 Frozen Architecture

V2.0 的三件核心事：

1. 统一一级目录与能力中心。
2. 统一 Skill Package 结构与 Runtime 发现机制。
3. 统一 Metadata、Knowledge、Schema、Dashboard 与 Tests 的系统能力。

### 统一目录

- `skills/`：核心业务能力包
- `prompts/`：全局 Prompt 中心
- `playbooks/`：战略打法中心
- `sop/`：企业 SOP 中心
- `cases/`：案例中心
- `metrics/`：KPI 与指标定义
- `dashboards/`：Dashboard Schema
- `graphs/`：知识图谱
- `schemas/`：JSON Schema
- `runtime/`：注册、路由、别名和能力发现
- `shared/`：公共资源
- `index/`：导航和索引
- `assets/`、`docs/`：资产和规范

### 统一 Skill Package

每个 Skill 都必须遵循同一结构：

- `SKILL.md`
- `metadata.json`
- `prompts/`
- `playbooks/`
- `schemas/`
- `metrics.json`
- `knowledge_links.json`
- `checklist.md`
- `examples/`

### 统一 Runtime

所有能力都必须通过 `runtime/` 发现，而不是通过历史目录命名隐式调用。

### 依赖方向

- Skills 依赖统一共享资源与 Schema。
- Runtime 提供统一注册与发现。
- Knowledge Engine、Metadata Engine、Schema Center 和 Dashboard Runtime 形成统一能力闭环。
- 应用层只消费 Runtime，而不复制业务知识。

## 历史说明（仅作背景）

历史阶段信息仅作为演进记录，不再作为当前开发规范。后续所有 Codex 开发都以 V2.0 Frozen Architecture 为唯一准绳。
