import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import type { DocumentStatus } from "@/types/documents";

const styles: Record<DocumentStatus, string> = {
  authorized: "text-success",
  processing: "text-accent",
  pending_authority: "text-warning",
  rejected: "text-error",
  technical_error: "text-error",
  retry_scheduled: "text-warning",
  slow_processing: "text-warning",
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
        "inline-flex items-center gap-1.5 text-xs font-medium leading-tight",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden />
      {t(`status.${status}`)}
    </span>
  );
}
