import { useTranslation } from "react-i18next";
import { PeriodSelector } from "@/components/ui/PeriodSelector";
import type { PeriodKey } from "@/types/documents";

function greetingKey(hour: number) {
  if (hour < 12) return "welcome.morning";
  if (hour < 18) return "welcome.afternoon";
  return "welcome.evening";
}

export function WelcomeSection({
  period,
  onPeriodChange,
}: {
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
}) {
  const { t } = useTranslation();
  const hour = new Date().getHours();
  const firstName = t("user.name").split(" ")[0];

  return (
    <section className="px-4 pb-2 pt-8 lg:px-10 lg:pt-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
            {t("header.pageContext")}
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl">
            {t(greetingKey(hour), { name: firstName })}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            {t("welcome.subtitle")}
          </p>
        </div>
        <PeriodSelector value={period} onChange={onPeriodChange} />
      </div>
    </section>
  );
}
