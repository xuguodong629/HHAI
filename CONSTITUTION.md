# HHAI V2.0 Ultimate Blueprint

**版本：** V2.0 Ultimate Freeze（2026）  
**状态：** Architecture Frozen / Business Expandable  
**适用阶段：** Phase 0.6 → Phase 5  
**文档级别：** HHAI 主项目唯一最高设计文档

本文件是 HHAI 主项目的架构宪法与终极蓝图。Codex、ChatGPT、Claude、Cursor、VS Code 及其他 AI Agent 在修改 HHAI 前，必须先读取并遵守本文件。子项目 README 只说明运行与开发，不得另行定义冲突的顶层架构。

## 1. 项目总纲

### 1.1 项目定位

HHAI 是厂家区域经营 AI 操作系统（AI Operating System for Regional Business Management），帮助厂家区域经理经营整个区域市场，而不是管理一家门店或替代代理商 ERP。

### 1.2 项目使命

HHAI 不是单一 AI 助手，而是驱动区域经营的操作系统，支持五类经营目标：

| 目标 | 核心问题 |
| --- | --- |
| 销量增长 | 卖什么、卖给谁、怎么卖 |
| 利润增长 | 卖多少钱、哪些产品最赚钱 |
| 用户增长 | 用户是谁、为什么买、怎么买更多 |
| 运营增长 | 区域、渠道、门店如何经营 |
| 能力增长 | 业务员、代理商、店长、导购如何成长 |

### 1.3 业务范围

V2.0 聚焦家电全品类、厨电、热水器、净水、小家电和厂家区域经营。消费电子、数码、汽车、建材家居、快消渠道作为未来扩展接口。先用家电跑通，再抽象为实体渠道经营 OS。

## 2. 五大宪法原则

| 原则 | 不可违背的定义 |
| --- | --- |
| Territory First | 经营数据首先归属业务 Territory；行政区只是 Territory 的组成属性。 |
| Metadata First | 业务字段由 Metadata 定义并驱动；不得在业务页面和流程中另写一套固定字段。 |
| Skill = Business Capability | Skill 是可发现、可执行、可验证、可复用的完整业务能力，不是孤立 Prompt。 |
| Local First | 默认本地运行、本地数据、本地 SQLite；外部 AI、云服务和遥测均不得成为默认依赖。 |
| Chinese First | UI、业务文案、README、Docs、Prompt、Playbook 和 Metadata Label 使用中文；代码 Key、API、目录和工程标识使用规范英文。 |

任何实现都必须同时满足五项原则。发生冲突时，以本宪法为最高裁决。

## 3. 冻结 Monorepo 架构

```text
G:\工具库\AI\_Projects\GitHub\
├── HHAI/                           唯一主项目
│   ├── apps/
│   │   └── hhai-app/               React 前端 + FastAPI Runtime
│   ├── packages/
│   │   └── hhai-skills/            共享业务能力与 Runtime 注册
│   ├── data/                       SQLite、日志、上传、导出与备份
│   ├── docs/                       中文文档中心
│   ├── assets/
│   ├── docker/
│   ├── scripts/
│   ├── .vscode/
│   ├── README.md
│   ├── CHANGELOG.md
│   └── CONSTITUTION.md             唯一最高设计文档
└── HHAI-Standards/                 独立全局规范仓库
```

一级目录永久冻结。扩展通过既有归属目录下的子目录、Skill、页面、Dashboard、API、Metadata 对象和文档完成；未经明确的架构版本升级，不得增加一级目录或改变 `apps + packages + data + docs` 的分层。

### 3.1 软件层目录

`apps/hhai-app/` 包含 `frontend/`、`backend/`、`shared/`、`config/`、`scripts/`、`docker/`、`tests/` 和项目 README。前端固定采用 React、Tailwind CSS、Zustand；后端固定采用 FastAPI 与 Python 3.10。

### 3.2 能力层目录

`packages/hhai-skills/` 包含 `skills/`、`runtime/`、`territory/`、`metadata/`、`schemas/`、`prompts/`、`knowledge/`、`playbooks/`、`dashboards/`、`templates/`、`datasets/`、`docs/` 和 `tests/`。

### 3.3 数据与规范

SQLite、日志、上传、导出和备份内容位于 `HHAI/data/` 的既有子目录。全局跨项目编码、测试、数据库、FastAPI、Skill 和命名规范位于同级独立的 `HHAI-Standards/`，不得复制成 HHAI 内另一套规范真相。

## 4. 四层系统架构

| 层 | 职责 |
| --- | --- |
| Presentation Layer | React 页面、交互、Dashboard 与报告呈现。 |
| Runtime Layer | FastAPI、Runtime Router、执行编排、权限边界和报告生成。 |
| Capability Layer | 可注册的 Skills、Prompts、Playbooks、指标、Schema 与模板。 |
| Knowledge & Data Layer | Territory、Metadata、知识资产、SQLite、案例和本地文件。 |

依赖单向流动：Presentation 消费 Runtime；Runtime 发现并调用 Capability；Capability 通过 Metadata、Territory 和 Knowledge 获得业务上下文。底层不得反向依赖上层 UI。

## 5. 四大 Engine

| Engine | 职责 |
| --- | --- |
| Territory Engine | 定义业务战区、责任人、组织、品类、渠道、行政区域、目标与历史版本。 |
| Metadata Engine | 定义业务对象、字段、类型、校验、说明和动态表单契约。 |
| Knowledge Engine | 管理品牌、产品、竞品、案例、政策、零售、渠道、消费者、培训和术语知识。 |
| Runtime Engine | Skill 注册、发现、路由、执行、契约校验、报告与运行记录。 |

标准业务链路：`Territory → Metadata → Knowledge → Runtime → Skill → Dashboard / Report / API`。不得跳过 Territory 或 Metadata 直接硬编码业务流程。

## 6. 六大 Business Operating System

| OS | 中文名称 | 业务边界与能力地图 |
| --- | --- | --- |
| RWOS | 区域经营系统 | 区域战略、市场容量、竞争格局、渠道布局与经营责任。 |
| RBOS | 零售经营系统 | 门店销量、利润、活动、商品、库存、陈列、人效和导购能力。 |
| BGOS | 代理商治理系统 | 厂家对代理商的经营、组织、能力、风险和整改治理；不是代理商 ERP。 |
| UOS | 用户经营系统 | 用户画像、需求与 JTBD、决策链路、生命周期、会员和私域。 |
| COS | AI 企业大学 | 岗位课程、案例学习、AI 陪练、面试、考试与认证。 |
| DOS | AI 驾驶舱 | 日报、周报、区域/渠道/终端/竞品/价格/库存/费用驾驶舱、风险和行动中心。 |

能力规模是长期规划目标，不是当前实现承诺：700+ Business Skills、300+ Prompts、200+ Playbooks、80+ Dashboards、30+ Metadata Objects、40+ 核心数据表和 30–50 个业务页面。所有扩张都必须保持现有冻结边界。

## 7. RWOS 与 RBOS 业务模型

### 7.1 RWOS 区域战略地图

RWOS 覆盖十二个模块：区域底盘、市场容量、竞争格局、渠道生态、终端零售、用户经营、价格秩序、库存供应链、组织人才、费用资源、风险治理、数据驾驶舱。

统一分析模型为六个穿透：目标穿透、库存穿透、价格穿透、用户穿透、渠道穿透、数据穿透。行政区域组合成业务 Territory；Territory 决定经营归属与责任链。

### 7.2 RBOS 五大增长中心

销量增长中心回答卖什么、卖给谁、怎么卖；利润增长中心经营价格、结构、费用和库存；用户增长中心经营拉新、成交、复购和私域；运营增长中心经营门店、活动、SOP 与督导；能力增长中心建设业务员、店长和导购能力体系。

门店健康、门店增长、活动策划、价格、库存、陈列、导购教练和门店 SOP 均作为独立业务 Skill 扩展。预期 150+ RBOS Skills，不以页面或 Prompt 数量替代业务能力闭环。

### 7.3 其他 OS 边界

BGOS 管理代理商健康、厂家协同、授信回款、团队能力、乱价窜货风险与整改；UOS 管理画像、需求、痛点、决策链路、复购和私域；COS 管理岗位学习、案例、陪练和认证；DOS 以 AI Action 为中心呈现经营日报、风险雷达和行动闭环，而非单纯 BI 图表集合。

## 8. Territory 与 Metadata 契约

Territory 是业务组织和经营分析的首要边界，至少描述负责人、组织、品类、渠道、行政区域和目标；支持多个行政区域组合为一个 Territory，并保留历史调整记录。

Metadata 对象覆盖 Territory、Dealer、Store、SKU、User、Competitor、Policy、Activity 等。每个字段必须提供稳定的英文 Key，以及中文 Label、Description、Placeholder、Example、类型和校验规则。React 表单、API Schema、Skill 输入和报表字段由 Metadata 驱动；业务逻辑不得绕过字段定义。

## 9. Skill SDK 与 Runtime

### 9.1 Skill = 完整业务能力

每个 Skill 至少有中文业务说明、唯一 ID、Domain、版本、状态、输入 Schema、业务流程、指标与输出报告契约；按需配套 Prompt、知识引用、示例、测试和资源。Skill 通过契约表达能力，不把隐式文件名当作调用接口。

参考包结构：

```text
<skill-id>/
├── README.md
├── SKILL.md
├── metadata.json
├── manifest.json
├── prompt.md
├── workflow.md
├── metrics.json
├── report-template.md
├── references.md
├── examples/
├── tests.json
└── assets/
```

具体包以 `packages/hhai-skills/` 当前冻结的 V2.0 Skill 标准为准；本蓝图不授权批量重命名、迁移或破坏既有 Skill 包。若现有标准对文件命名与参考结构有差异，必须先提出显式版本迁移方案。

### 9.2 Runtime 注册与调用

所有能力必须通过 `packages/hhai-skills/runtime/` 注册、发现和路由。Runtime 注册表及配套 routes、packages、capabilities、domains、index 是能力发现的统一入口。HHAI-App 只消费 Runtime 契约，不复制或重做 Skill Runtime。

软件 API 由 FastAPI 提供，当前 MVP 接口包括 Skill 列表、Skill 详情、Skill 执行和报告创建/读取。执行必须校验输入/输出契约、返回结构化 Report，并支持无云端、无 AI 的本地 Mock 验证。

### 9.3 Knowledge Engine

知识按品牌、产品、竞品、政策、零售、渠道、消费者、案例、培训和术语分类，采用可版本管理、可引用来源的中文 Markdown 资料。Skill 通过显式引用消费知识，不把知识副本散落在页面实现中。

## 10. HHAI-App 与本地数据

HHAI-App 是本地软件产品和 Runtime 消费者，不是第二套业务能力仓库。UI 中文优先，包含 AI 指挥中心与六大 OS 导航、Territory Builder、Metadata Studio、Skills Center、Knowledge/Report Center 和 AI Action Dashboard。页面可以逐步扩展，但不改变分层和依赖方向。

默认本地优先：SQLite 保存平台、配置、执行和报告记录；业务对象定义由 Metadata 管理。Phase 1.5 可先使用 JSON Mock 与少量平台表，不能提前创建 Dealer、Store、SKU 等未经批准的业务实体表。

数据库长期规模约 40 张核心表是规划目标。每阶段仅实现验收范围内的表，迁移必须可重复、可测试、可回滚；数据文件和日志不得误提交到源码仓库。

## 11. 阶段路线图

| 阶段 | 目标 | 约束 |
| --- | --- | --- |
| Phase 0 | Skills 插件化 | Skill 包结构可发现、可复用。 |
| Phase 0.5 | Territory / Metadata / Runtime | 建立能力运行基础。 |
| Phase 0.6 | Monorepo、中文化、HHAI-App 骨架 | 依照本宪法完成唯一项目根和依赖方向。 |
| Phase 1 | 核心 Skills 闭环 | 先打通 10 个核心业务能力。 |
| Phase 1.5 | React 软件 MVP | Territory → Metadata → Skill → Report → Dashboard 完整闭环。 |
| Phase 2 | RWOS + RBOS | 按冻结架构扩展业务能力。 |
| Phase 3 | 六大 OS 能力库 | 规划规模 700+ Skills。 |
| Phase 4 | 地图、Dashboard、AI 指挥中心 | 强化空间分析和行动闭环。 |
| Phase 5 | 企业部署版 | 多用户、权限和 PostgreSQL 等企业能力；通过版本化扩展，不破坏 Local First。 |

## 12. 冻结与变更治理

### 12.1 永久冻结

- 项目定位：厂家区域经营 AI 操作系统。
- Monorepo：`apps + packages + data + docs`，HHAI 是唯一主项目。
- 五大原则、四层架构、四大 Engine 和六大 OS。
- Skill 是完整 Business Capability；Runtime 是唯一发现和调用入口。
- Metadata First、Territory First、Local First、Chinese First。
- 软件层消费能力层；不得复制或重新设计 Skills Runtime。

### 12.2 可扩展内容

允许新增 Skill、知识、页面、Dashboard、API、Metadata 对象、数据集、模板和业务能力。新增内容必须进入已冻结目录体系、保持依赖单向，并补齐契约与测试。

### 12.3 架构升级

不得以日常功能开发名义修改冻结架构。需要变更一级目录、Engine、OS 边界、Runtime 协议或 Skill 基础标准时，必须先提交独立的架构变更提案，说明兼容性、迁移、验证和回滚方案；提案批准并升级本宪法版本后方可实施。

## 13. Agent 开发前置检查

任何 AI Agent 开发前必须：

1. 读取本文件，并读取受影响模块的局部 README、Skill Standard 与对应 HHAI-Standards 规范。
2. 确认改动属于哪个 OS、Engine、层和冻结目录，不要从聊天上下文推断未写明的架构。
3. 先检查工作树和相关文件，保护已有修改与本地数据。
4. 以最小范围实现；不越界改动 HHAI-Skills 架构或业务数据模型。
5. 运行对应测试、类型检查、Skill/Metadata 验证，并报告未验证项。

本条为开发流程强制门槛，不得被 Agent 的默认工作流绕过。