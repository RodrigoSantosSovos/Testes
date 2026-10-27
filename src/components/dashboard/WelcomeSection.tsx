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
    <section className="border-b border-border-subtle bg-surface/50 px-4 py-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            {t(greetingKey(hour), { name: firstName })}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {t("welcome.subtitle")}
          </p>
        </div>
        <PeriodSelector value={period} onChange={onPeriodChange} />
      </div>
    </section>
  );
}
