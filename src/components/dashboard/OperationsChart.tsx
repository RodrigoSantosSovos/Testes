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
        "rounded-xl border border-border bg-surface p-4 lg:p-5",
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          {t("chart.title")}
        </h3>
        <p className="text-xs text-text-muted">{t("chart.subtitle")}</p>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-accent" />
          {t("chart.legendProcessed")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-error" />
          {t("chart.legendFailures")}
        </span>
      </div>
      <div className="mt-4 h-48 w-full min-h-[12rem]" role="img" aria-label={t("chart.title")}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--ff-border-subtle)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--ff-text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--ff-text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "var(--ff-surface-elevated)",
                border: "1px solid var(--ff-border)",
                borderRadius: 8,
                fontSize: 12,
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
              strokeWidth={2}
              dot={false}
              name="processed"
            />
            <Line
              type="monotone"
              dataKey="failures"
              stroke="var(--ff-error)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="failures"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
