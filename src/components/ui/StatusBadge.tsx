import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import type { DocumentStatus } from "@/types/documents";

const styles: Record<DocumentStatus, string> = {
  authorized:
    "bg-success-muted text-success border-success/20 dark:border-success/30",
  processing:
    "bg-accent-muted text-accent border-accent/20 dark:border-accent/30",
  pending_authority:
    "bg-warning-muted text-warning border-warning/25 dark:border-warning/30",
  rejected: "bg-error-muted text-error border-error/25 dark:border-error/30",
  technical_error:
    "bg-error-muted text-error border-error/25 dark:border-error/30",
  retry_scheduled:
    "bg-warning-muted text-warning border-warning/25 dark:border-warning/30",
  slow_processing:
    "bg-warning-muted text-warning border-warning/25 dark:border-warning/30",
};

export function StatusBadge({
  status,
  className,
}: {
  status: DocumentStatus;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-tight",
        styles[status],
        className,
      )}
    >
      <span
        className="size-1.5 shrink-0 rounded-full bg-current opacity-80"
        aria-hidden
      />
      {t(`status.${status}`)}
    </span>
  );
}
