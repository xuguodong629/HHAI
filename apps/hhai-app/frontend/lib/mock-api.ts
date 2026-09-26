export async function getMockData<T>(name: string): Promise<T> {
  const response = await fetch(`/api/mock/${name}`);
  if (!response.ok) throw new Error("本地 Mock 数据读取失败");
  return response.json() as Promise<T>;
}

export type ReportListItem = { id: string; title: string; skill_id: string; scope: string; created_at: string; risk_level: string; format: string };

export async function getReportList(): Promise<ReportListItem[]> {
  const [mockReports, savedReports] = await Promise.all([
    getMockData<ReportListItem[]>("reports"),
    Promise.resolve(typeof window === "undefined" ? null : localStorage.getItem("hhai-reports-v1")),
  ]);
  let databaseReports: ReportListItem[] = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"}/api/reports`, { signal: AbortSignal.timeout(1500) });
    if (response.ok) {
      const rows = await response.json() as Omit<ReportListItem, "scope" | "format">[];
      databaseReports = rows.map((report) => ({ ...report, scope: "平台报告", format: "Markdown + JSON" }));
    }
  } catch {
    databaseReports = [];
  }
  const localReports = savedReports ? JSON.parse(savedReports) as ReportListItem[] : [];
  const reports = [...localReports, ...databaseReports, ...mockReports];
  return [...new Map(reports.map((report) => [report.id, report])).values()];
}

export type Territory = {
  id: string;
  name: string;
  owner: string;
  organization: string;
  category: string;
  channel: string;
  region: string;
  target: number;
  status: "运行中" | "待启用" | "已归档";
};

export type StoreHealthReport = {
  report_id: string;
  skill_id: string;
  generated_at: string;
  store: { id: string; name: string; region: string };
  summary: { sales_amount: number; gross_margin_rate: number; inventory_days: number; health_score: number; risk_level: string };
  trends: { month: string; sales: number; gross_margin_rate: number; inventory_days: number; health_score: number }[];
  risks: { title: string; severity: string; detail: string }[];
  actions: { title: string; owner: string; due_date: string; priority: string }[];
  markdown: string;
};