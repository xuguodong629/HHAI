# 贡献指南

新增内容必须遵循 HHAI-Skills V2.0 Frozen Architecture。所有贡献都必须落入统一目录、统一 Skill Package 结构和统一 Runtime 注册方式。

## 必须遵守的原则

- 仅在 V2.0 目录中新增或修正内容。
- Skill 必须提供 `SKILL.md`、`metadata.json` 与标准目录结构。
- Prompt、Playbook、SOP、Case、Metric、Dashboard 必须置于对应中心。
- 所有能力必须通过 `runtime/registry.json` 与 `runtime/validate.py` 进行校验。
- 不再沿用历史阶段组织方法。
