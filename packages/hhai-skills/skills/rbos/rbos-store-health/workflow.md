# 门店健康诊断工作流

1. 确认业务 Territory、门店编码和统计周期。
2. 按输入 Schema 校验 Metadata 字段、类型、单位和必填项。
3. 分析销量、毛利率、库存天数与历史趋势。
4. 将偏差关联到证据，输出风险等级和影响说明。
5. 按 `report-template.md` 生成 JSON 与 Markdown 报告。
6. 每项行动明确责任角色、优先级和截止日期。
7. MVP 只返回固定 Mock Report，不调用 AI。