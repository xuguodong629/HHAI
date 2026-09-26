export type RuntimeSkill = {
  id: string;
  kind: "skill";
  system: string;
  path: string;
  metadata: {
    id: string;
    name: string;
    version: string;
    status: string;
    capability?: string;
  };
};

export type RuntimeReport = {
  report_id: string;
  skill_id: string;
  generated_at: string;
  summary: {
    sales_amount: number;
    gross_margin_rate: number;
    inventory_days: number;
    health_score: number;
    risk_level: string;
  };
};