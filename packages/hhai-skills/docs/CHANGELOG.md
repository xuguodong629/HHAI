# 变更记录

## 2026-09-25 - V2.0 Frozen Architecture

- 正式冻结 HHAI-Skills V2.0 架构，后续所有开发以该架构为唯一准绳。
- 明确 Runtime、Metadata、Knowledge、Schema、Dashboard、Tests 与 Legacy Migration 的统一职责。
- 统一主文档表述，移除历史阶段的实时开发语义，保留历史记录仅用于参考。
- 完成 README、架构文档、目录说明和索引说明的 V2.0 统一改写。

## 2026-09-24 - V2.0.0

- 将仓库升级为统一的 HHAI Skills Platform V2.0 架构。
- 将 1,060 个业务 Skills 迁移到 `skills/<system>/<skill-id>/`，并将 40 个 SOP 包迁移到 `sop/`。
- 新增 Prompt、Playbook、Cases、Metrics、Dashboards、Graphs、Schemas 和 Runtime 中心。
- 新增运行时注册表、路由、别名、能力契约、版本文件和自动索引生成器。
- 生成 `index/SUMMARY.md`、`skills_index.json`、`navigation.json` 和 `knowledge_graph.json`。
- 新增 `runtime/validate.py`，CI 改为校验 V2 目录和包契约。

## 2026-09-23

- 建立 15 个固定一级目录。
- 建立二级目录 README 和统一 metadata.json。
- 建立正式 Skill 模板、全局索引、资源目录和文档入口。
- 形成历史阶段性结构，作为 V2.0 迁移前的背景信息。
