import type { DocumentStatus } from "@/types/documents";

/** Left-rail color for monitor rows — status communicated beyond badge color */
export const statusRailClass: Record<DocumentStatus, string> = {
  authorized: "bg-success",
  processing: "bg-accent/70",
  pending_authority: "bg-warning",
  rejected: "bg-error",
  technical_error: "bg-error",
  retry_scheduled: "bg-warning",
  slow_processing: "bg-warning",
};
