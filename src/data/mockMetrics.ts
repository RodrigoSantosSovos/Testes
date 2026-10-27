import type { ChartPoint, OperationalMetrics, PeriodKey } from "@/types/documents";

export const metricsByPeriod: Record<PeriodKey, OperationalMetrics> = {
  today: { processed: 2847, processing: 42, failed: 6, successRate: 99.1 },
  "24h": { processed: 4120, processing: 58, failed: 9, successRate: 98.9 },
  "7d": { processed: 28410, processing: 126, failed: 18, successRate: 98.7 },
  "30d": { processed: 124820, processing: 126, failed: 18, successRate: 98.7 },
  custom: { processed: 124820, processing: 126, failed: 18, successRate: 98.7 },
};

export const chartByPeriod: Record<PeriodKey, ChartPoint[]> = {
  today: [
    { label: "06h", processed: 180, failures: 0, successRate: 100 },
    { label: "08h", processed: 420, failures: 1, successRate: 99.8 },
    { label: "10h", processed: 890, failures: 2, successRate: 99.5 },
    { label: "12h", processed: 1350, failures: 4, successRate: 99.2 },
    { label: "14h", processed: 2847, failures: 6, successRate: 99.1 },
  ],
  "24h": [
    { label: "00h", processed: 320, failures: 1, successRate: 99.7 },
    { label: "06h", processed: 980, failures: 2, successRate: 99.6 },
    { label: "12h", processed: 2100, failures: 5, successRate: 99.1 },
    { label: "18h", processed: 3400, failures: 7, successRate: 99.0 },
    { label: "24h", processed: 4120, failures: 9, successRate: 98.9 },
  ],
  "7d": [
    { label: "Seg", processed: 3800, failures: 3, successRate: 99.0 },
    { label: "Ter", processed: 4100, failures: 4, successRate: 98.9 },
    { label: "Qua", processed: 3950, failures: 2, successRate: 99.2 },
    { label: "Qui", processed: 4200, failures: 5, successRate: 98.8 },
    { label: "Sex", processed: 4500, failures: 2, successRate: 99.3 },
    { label: "Sáb", processed: 2100, failures: 1, successRate: 99.5 },
    { label: "Dom", processed: 1760, failures: 1, successRate: 99.4 },
  ],
  "30d": [
    { label: "S1", processed: 28000, failures: 5, successRate: 99.0 },
    { label: "S2", processed: 30500, failures: 4, successRate: 99.1 },
    { label: "S3", processed: 31200, failures: 3, successRate: 99.2 },
    { label: "S4", processed: 35120, failures: 6, successRate: 98.8 },
  ],
  custom: [
    { label: "S1", processed: 28000, failures: 5, successRate: 99.0 },
    { label: "S2", processed: 30500, failures: 4, successRate: 99.1 },
    { label: "S3", processed: 31200, failures: 3, successRate: 99.2 },
    { label: "S4", processed: 35120, failures: 6, successRate: 98.8 },
  ],
};
