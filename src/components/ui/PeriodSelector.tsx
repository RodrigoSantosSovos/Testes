import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import type { PeriodKey } from "@/types/documents";

const periods: PeriodKey[] = ["today", "24h", "7d", "30d"];

export function PeriodSelector({
  value,
  onChange,
  className,
}: {
  value: PeriodKey;
  onChange: (p: PeriodKey) => void;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
        {t("period.label")}
      </span>
      <div
        className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1"
        role="group"
        aria-label={t("period.label")}
      >
        {periods.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              value === p
                ? "bg-accent text-white shadow-sm dark:text-slate-900"
                : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary",
            )}
          >
            {t(`period.${p}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
