import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeading({ eyebrow, title, description, action }: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="page-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

export function Panel({ title, icon: Icon, meta, action, children, className = "" }: {
  title: string;
  icon?: LucideIcon;
  meta?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      <div className="card-header">
        <h2 className="card-title">{Icon && <Icon size={15} strokeWidth={1.8} />}{title}</h2>
        {action ?? (meta && <span className="card-meta">{meta}</span>)}
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}

export function MetricCard({ label, value, detail, icon: Icon, tone = "positive" }: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <article className="card metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className={`metric-foot ${tone}`}><Icon size={12} />{detail}</div>
    </article>
  );
}

export function RiskTag({ level }: { level: string }) {
  const className = level.includes("高") || level.includes("严重") ? "tag tag-danger" : level.includes("中") || level.includes("关注") ? "tag tag-warning" : "tag";
  return <span className={className}>{level}</span>;
}

export function LoadingState({ label = "正在读取本地数据" }: { label?: string }) {
  return <div className="empty-state">{label}…</div>;
}