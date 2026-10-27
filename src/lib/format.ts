import type { DocumentStatus, StatusFilter } from "@/types/documents";

export function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatDateTime(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function statusMatchesFilter(
  status: DocumentStatus,
  filter: StatusFilter,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "error":
      return status === "technical_error";
    case "rejected":
      return status === "rejected";
    case "processing":
      return (
        status === "processing" ||
        status === "pending_authority" ||
        status === "retry_scheduled" ||
        status === "slow_processing"
      );
    case "completed":
      return status === "authorized";
    default:
      return true;
  }
}

export function isAttentionStatus(status: DocumentStatus) {
  return !["authorized", "processing"].includes(status);
}
