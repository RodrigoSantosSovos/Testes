import { useTranslation } from "react-i18next";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { metricsByPeriod } from "@/data/mockMetrics";
import type { PeriodKey, StatusFilter } from "@/types/documents";

type MetricKey = "processed" | "processing" | "failed" | "successRate";

const metricConfig: {
  key: MetricKey;
  filter?: StatusFilter;
  accent?: string;
}[] = [
  { key: "processed", filter: "completed", accent: "text-text-primary" },
  { key: "processing", filter: "processing", accent: "text-accent" },
  { key: "failed", accent: "text-error" },
  { key: "successRate", accent: "text-success" },
];

export function OperationalSummary({
  period,
  onFilterFromMetric,
  onFailuresFilter,
  activeFilter,
  failuresActive,
}: {
  period: PeriodKey;
  onFilterFromMetric: (f: StatusFilter) => void;
  onFailuresFilter: () => void;
  activeFilter: StatusFilter;
  failuresActive: boolean;
}) {
  const { t, i18n } = useTranslation();
  const metrics = metricsByPeriod[period];
  const locale = i18n.language;

  return (
    <section
      className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4"
      aria-label={t("metrics.processed")}
    >
      {metricConfig.map(({ key, filter, accent }) => {
        const isFailedMetric = key === "failed";
        const isClickable = Boolean(filter) || isFailedMetric;
        const isActive =
          (filter && activeFilter === filter) ||
          (isFailedMetric && failuresActive);
        const value =
          key === "successRate"
            ? formatPercent(metrics.successRate, locale)
            : formatNumber(metrics[key], locale);

        const inner = (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t(`metrics.${key}`)}
            </p>
            <p className={cn("mt-1 text-2xl font-semibold tabular-nums", accent)}>
              {value}
            </p>
            {isClickable && (
              <p className="mt-2 text-[11px] text-text-muted">
                {t("metrics.filterHint")}
              </p>
            )}
          </>
        );

        return isClickable ? (
          <button
            key={key}
            type="button"
            onClick={() =>
              isFailedMetric ? onFailuresFilter() : onFilterFromMetric(filter!)
            }
            className={cn(
              "bg-surface px-4 py-4 text-left transition hover:bg-surface-elevated",
              isActive && "ring-2 ring-inset ring-accent/40",
            )}
          >
            {inner}
          </button>
        ) : (
          <div key={key} className="bg-surface px-4 py-4">
            {inner}
          </div>
        );
      })}
    </section>
  );
}
