# RBOS 门店健康诊断

## 能力

评估指定门店在统计周期内的销量、毛利和库存效率，识别健康风险，并形成带责任人和截止日期的行动建议。

## 输入

输入由 `schemas/input.schema.json` 描述，并与 HHAI Metadata 中的 Store 对象字段对应。必填字段为门店编码和统计周期。

## 执行流程

1. 校验门店标识、统计周期及 Metadata 字段类型。
2. 对照 Territory 目标和历史经营趋势检查销量、毛利、库存表现。
3. 标注风险等级、关键证据和影响范围。
4. 为每项风险生成明确负责人、优先级和完成日期的行动建议。
5. 按 Report 契约输出结构化结果及 Markdown 摘要。

当前软件 MVP 使用固定 Mock Report，不调用 AI 或外部服务。

## 输出

输出契约以 `apps/hhai-app/mock/store-health.json` 中的 Report JSON 为演示样例，Dashboard 只消费该结构化报告。