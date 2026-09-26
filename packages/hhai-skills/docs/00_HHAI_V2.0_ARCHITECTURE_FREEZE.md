# HHAI V2.0 Architecture Freeze（唯一开发指令 · Frozen）

> 项目名称：HHAI（Henan Home Appliance Hyper Intelligence）V2.0

# 这份指令的级别（冻结）

这是 HHAI V2.0 第一份冻结文档，后续所有 Codex 会话都以它为准，不再重复讨论目录和架构。

这是 CTO 级项目升级命令，目标是把仓库从当前状态直接升级为 HHAI V2.0 Frozen Architecture，并作为后续所有 Skill、MCP、Agent、Dashboard、Plugin 与 Agent Runtime 的唯一规范。

---

## 执行效果

执行完后，仓库会从当前状态升级为真正的 HHAI V2.0 Core Skeleton，包含：

| 模块 | 状态 |
| --- | --- |
| 六大 OS 架构 | ✅ 冻结 |
| Territory Engine | ✅ 建立 |
| Metadata Engine | ✅ 建立 |
| Knowledge Engine | ✅ 建立 |
| Plugin Runtime | ✅ 建立 |
| Schema Center | ✅ 建立 |
| Dashboard Runtime | ✅ 建立 |
| Tests Center | ✅ 建立 |
| Legacy 迁移体系 | ✅ 保留 |

这不是新增业务能力的扩展，而是系统底座的架构冻结和统一基线。

---

## 1. 立项结论：直接冻结，不再沿用旧 Phase 1/2/3 目录争论

过去的目录争论、分阶段讨论和历史迁移方案，全部停止。

HHAI V2.0 的设计目标不是“文档仓库”，而是“Skills + Runtime + Plugin + Knowledge + Dashboard + Schema 的统一业务能力平台”。

因此：

- 不再以旧目录命名继续开发。
- 不再重复 debate Phase 1 / 2 / 3。
- 不再维持过时的单一文档结构。
- 所有后续工作都必须遵循 V2.0 Frozen Architecture。

---

## 2. 最终冻结目录（V2.0）

这是以后所有项目共用的一套目录，作为唯一目录规范：

```text
HHAI-Skills/
│
├── skills/                 ⭐ 核心 Skills（700~900）
│   ├── rbos/
│   ├── bos/
│   ├── cos/
│   ├── uos/
│   ├── rwos/
│   ├── dos/
│   └── industry/
│
├── prompts/                ⭐ 全局 Prompt 中心
├── playbooks/              ⭐ 战略打法库
├── sop/                    ⭐ 企业 SOP 中心
├── cases/                  ⭐ 案例中心
├── metrics/                ⭐ KPI 指标库
├── dashboards/             ⭐ Dashboard Schema
├── graphs/                 ⭐ 知识图谱
├── schemas/                ⭐ JSON Schema
├── runtime/                ⭐ Skill Runtime（新增）
├── shared/                 ⭐ 公共资源
├── index/                  ⭐ 索引导航
├── assets/
└── docs/
```

这是一份冻结目录，不再改动。

---

## 3. runtime/ 是强制新增层

`runtime/` 是整个项目最关键的升级层，是 Agent 自动发现、注册、路由和能力装配的核心。

它必须包含：

```text
runtime/
├── registry.json
├── router.json
├── aliases.json
├── capabilities.json
├── version.json
└── validate.py
```

作用：

- 提供所有 Skills 的统一注册表。
- 让 Codex / ChatGPT Agent 自动发现能力包。
- 让应用层按统一接口调用能力。
- 作为 V2.0 Runtime 的唯一发现入口。

---

## 4. 每个 Skill 必须为统一 Skill Package

以后每个 Skill 都必须是一个标准化业务能力包，而不是零散 Markdown 文件堆叠。

```text
skills/rbos/sales-growth-diagnosis/
│
├── SKILL.md                    ⭐ Skill入口
├── metadata.json               ⭐ AI识别
├── prompts/
│   ├── analyze.md
│   ├── diagnose.md
│   └── report.md
├── playbooks/
│   ├── county-growth.md
│   ├── emergency-growth.md
│   └── competitor-attack.md
├── schemas/
│   ├── input.schema.json
│   └── output.schema.json
├── metrics.json
├── knowledge_links.json
├── checklist.md
└── examples/
    ├── hua-county.md
    └── emergency-case.md
```

该结构必须为所有 Skills 的最终格式。

---

## 5. V2.0 架构模块定义（冻结）

### 5.1 Six OS Architecture

必须保留六大 OS 架构作为核心业务能力边界：

- RBOS
- BOS
- COS
- UOS
- RWOS
- DOS

它们是 HHAI V2.0 业务能力的统一主轴。

### 5.2 Territory Engine

负责区域、渠道、门店、终端、市场与经营单元的空间关系建模与决策分析。

### 5.3 Metadata Engine

负责统一 Skill/Plugin/Agent 的识别、标签、元数据、分类、依赖和版本策略。

### 5.4 Knowledge Engine

负责知识图谱、联动关系、案例引用、归因链路、能力关联、关联索引构建。

### 5.5 Plugin Runtime

负责外部能力扩展的统一接口和运行时装配方式，保证 Agent 可在统一运行时发现和调用插件。

### 5.6 Schema Center

负责统一 JSON Schema、输入输出结构、能力契约、dashboard schema 和数据校验标准。

### 5.7 Dashboard Runtime

负责统一看板结构、数据视图、KPI 托管和业务驾驶舱模板。

### 5.8 Tests Center

负责统一校验策略、脚本测试、结构校验、Schema 校验和说法一致性检查。

### 5.9 Legacy Migration System

保留历史内容并做迁移，不直接删除有效业务内容。所有迁移必须以兼容、一致、可恢复的方式执行。

---

## 6. 统一开发约束（冻结）

所有后续 Codex 开发必须遵守以下规则：

1. 只遵循本文件，不再重复讨论目录和架构。
2. 不创建新的历史 Phase 目录或重启旧架构。
3. 保留有效历史内容，迁移到 V2.0 结构内。
4. 每个 Skill 都必须具备统一 Package 结构。
5. 所有能力必须通过 `runtime/` 注册与发现。
6. 所有 Prompt、SOP、Playbook、Case、Metric、Dashboard 必须放入对应中心。
7. All future AI projects must reference HHAI-Skills as the canonical shared runtime, not copy business knowledge.
8. HHAI-Standards remains the canonical development standard repository.
9. HHAI-MCP remains the tool capability repository.
10. Personal-AI-Command-Center remains the application layer that invokes Skills + MCP.

---

## 7. 架构冻结后的职责边界

### HHAI-Skills

唯一的 Skills SDK / Runtime / Core Skeleton。

### HHAI-Standards

唯一开发规范仓库，提供编码、命名、测试、结构和提交规范。

### HHAI-MCP

唯一工具能力仓库，负责浏览器、Filesystem、GitHub、SQLite、Firecrawl 等 M C P 能力。

### Personal-AI-Command-Center

应用层，负责调用 Skills + MCP，并生成任务执行与用户交互脚本。

---

## 8. 执行口令（冻结指令）

Codex 在后续所有开发中，必须把以下规则当作唯一优先级：

> HHAI V2.0 Architecture Freeze is the only authoritative architecture. All future Skill, MCP, Agent, Dashboard, and Plugin development must comply with this architecture and the frozen directory structure.

任何未遵守此规则的方案，都视为不合规。

---

## 9. 最终状态

执行完成后，仓库进入：

HHAI V2.0 Frozen Architecture State

后续所有开发都必须遵循：

- 目录冻结
- Runtime 注册
- Skill Package 统一
- Knowledge + Metadata + Schema + Dashboard 统一
- Legacy 迁移保留
- 单一规范来源

这份文档即为 HHAI V2.0 第一次架构冻结，作为以后所有 Codex 会话的唯一开发基线。
