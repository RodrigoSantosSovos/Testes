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
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
        {t("period.label")}
      </span>
      <div
        className="flex flex-wrap gap-x-1 gap-y-1 border-b border-border"
        role="group"
        aria-label={t("period.label")}
      >
        {periods.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              value === p
                ? "border-accent text-text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary",
            )}
          >
            {t(`period.${p}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
