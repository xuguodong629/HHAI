# HHAI-Skills V2.0

HHAI Skills Platform 是面向 Codex、ChatGPT Agent 和业务应用的共享 Business Skill Runtime。
所有能力以可发现、可注册、可复用的 Package 形式发布。

## Platform Centers

- [Skills](./skills/)：RBOS、BOS、COS、UOS、RWOS、DOS 和 Industry
- [Prompt Center](./prompts/)
- [Playbook Center](./playbooks/)
- [SOP Center](./sop/)
- [Cases](./cases/)、[Metrics](./metrics/)、[Dashboards](./dashboards/)
- [Graphs](./graphs/)、[Schemas](./schemas/)、[Shared](./shared/)
- [Runtime](./runtime/registry.json)：注册表、路由、别名和能力契约

## Navigation

- [Summary](./index/SUMMARY.md)
- [Skills Index](./index/skills_index.json)
- [Knowledge Graph](./index/knowledge_graph.json)
- [Architecture](./docs/ARCHITECTURE.md)
- [Changelog](./docs/CHANGELOG.md)

## Local Validation

```powershell
py -3 runtime/validate.py
```
