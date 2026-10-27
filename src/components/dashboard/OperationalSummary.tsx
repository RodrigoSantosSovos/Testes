import { useTranslation } from "react-i18next";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { metricsByPeriod } from "@/data/mockMetrics";
import type { PeriodKey, StatusFilter } from "@/types/documents";

type MetricKey = "processed" | "processing" | "failed" | "successRate";

const metricConfig: {
  key: MetricKey;
  filter?: StatusFilter;
}[] = [
  { key: "processed", filter: "completed" },
  { key: "processing", filter: "processing" },
  { key: "failed" },
  { key: "successRate" },
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
      className="ff-hairline flex flex-col gap-4 bg-surface/60 px-4 py-5 backdrop-blur-sm sm:flex-row sm:items-stretch sm:divide-x sm:divide-border-subtle lg:px-10"
      aria-label={t("metrics.processed")}
    >
      {metricConfig.map(({ key, filter }, index) => {
        const isFailedMetric = key === "failed";
        const isClickable = Boolean(filter) || isFailedMetric;
        const isActive =
          (filter && activeFilter === filter) ||
          (isFailedMetric && failuresActive);
        const value =
          key === "successRate"
            ? formatPercent(metrics.successRate, locale)
            : formatNumber(metrics[key], locale);

        const content = (
          <>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
              {String(index + 1).padStart(2, "0")} · {t(`metrics.${key}`)}
            </span>
            <span
              className={cn(
                "font-display mt-1 block text-3xl font-semibold tabular-nums tracking-tight",
                key === "failed" && "text-error",
                key === "successRate" && "text-success",
                key === "processing" && "text-accent",
              )}
            >
              {value}
            </span>
          </>
        );

        return (
          <div key={key} className="min-w-0 flex-1 sm:px-5 first:sm:pl-0">
            {isClickable ? (
              <button
                type="button"
                onClick={() =>
                  isFailedMetric ? onFailuresFilter() : onFilterFromMetric(filter!)
                }
                className={cn(
                  "group w-full text-left transition-opacity hover:opacity-90",
                  isActive && "opacity-100",
                )}
              >
                {content}
                <span
                  className={cn(
                    "mt-2 block h-0.5 w-8 rounded-full bg-transparent transition-all group-hover:w-12 group-hover:bg-accent/40",
                    isActive && "w-12 bg-accent",
                  )}
                />
              </button>
            ) : (
              <div>{content}</div>
            )}
          </div>
        );
      })}
    </section>
  );
}
