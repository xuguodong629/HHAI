# HHAI-Skills V2.0 路线图

## 架构冻结状态

HHAI-Skills 已进入 V2.0 Frozen Architecture 状态。后续所有开发都必须遵循统一目录、统一 Runtime、统一 Skill Package 和统一 Schema 契约。

## 当前基线

- `skills/`：核心业务 Skill 包
- `runtime/`：注册、路由、别名、能力发现与校验
- `prompts/`、`playbooks/`、`sop/`、`cases/`：复用型能力中心
- `metrics/`、`dashboards/`、`graphs/`、`schemas/`：统一指标与结构约束
- `shared/`：公共资源、模板和共用知识
- `index/`：导航、索引和知识图谱导出

## 后续迭代原则

- 只在 V2.0 中新增能力，不重建旧 Phase 结构。
- 所有新增 Skill 必须采用统一 Skill Package 形式。
- 所有能力必须经过 Runtime 注册后才视为可用。
- 业务内容必须通过 Metadata、Knowledge、Schema 和 Dashboard Runtime 统一接入。
