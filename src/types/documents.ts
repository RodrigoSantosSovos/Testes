export type DocumentType = "NFE" | "NFSE" | "CTE" | "MDFE";

export type DocumentStatus =
  | "authorized"
  | "processing"
  | "pending_authority"
  | "rejected"
  | "technical_error"
  | "retry_scheduled"
  | "slow_processing";

export type StatusFilter =
  | "all"
  | "error"
  | "rejected"
  | "processing"
  | "completed";

export type PeriodKey = "today" | "24h" | "7d" | "30d" | "custom";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  labelKey: string;
  descriptionKey?: string;
  status: "info" | "success" | "warning" | "error";
}

export interface FiscalDocument {
  id: string;
  type: DocumentType;
  number: string;
  company: string;
  municipality?: string;
  authority?: string;
  createdAt: string;
  updatedAt: string;
  status: DocumentStatus;
  summaryKey: string;
  errorCode?: string;
  errorMessageKey?: string;
  periodGroup: PeriodKey[];
  timeline: TimelineEvent[];
}

export interface OperationalMetrics {
  processed: number;
  processing: number;
  failed: number;
  successRate: number;
}

export interface ChartPoint {
  label: string;
  processed: number;
  failures: number;
  successRate: number;
}
