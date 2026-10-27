import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import { chartByPeriod } from "@/data/mockMetrics";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { PeriodKey } from "@/types/documents";

export function OperationsChart({
  period,
  className,
}: {
  period: PeriodKey;
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const data = chartByPeriod[period];
  const locale = i18n.language;

  return (
    <section
      className={cn(
        "border border-border/80 bg-surface/80 p-4 backdrop-blur-sm lg:p-5",
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold text-text-primary">
            {t("chart.title")}
          </h3>
          <p className="text-xs text-text-muted">{t("chart.subtitle")}</p>
        </div>
        <div className="flex gap-4 font-mono text-[10px] uppercase tracking-wider text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            {t("chart.legendProcessed")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-error" />
            {t("chart.legendFailures")}
          </span>
        </div>
      </div>
      <div
        className="h-44 w-full min-h-[11rem]"
        role="img"
        aria-label={t("chart.title")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--ff-border-subtle)"
              vertical={false}
              strokeDasharray="4 6"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--ff-text-muted)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--ff-text-muted)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                background: "var(--ff-surface-elevated)",
                border: "1px solid var(--ff-border)",
                borderRadius: 6,
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
              formatter={(value, name) => [
                formatNumber(Number(value ?? 0), locale),
                name === "processed"
                  ? t("chart.processed")
                  : t("chart.failures"),
              ]}
            />
            <Line
              type="monotone"
              dataKey="processed"
              stroke="var(--ff-accent)"
              strokeWidth={1.5}
              dot={false}
              name="processed"
            />
            <Line
              type="monotone"
              dataKey="failures"
              stroke="var(--ff-error)"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              name="failures"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
