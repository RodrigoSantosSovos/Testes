import { useCallback, useEffect } from "react";
import { DocumentDetailsPanel } from "@/components/documents/DocumentDetailsPanel";
import { OperationalMonitor } from "@/components/documents/OperationalMonitor";
import { OperationsChart } from "@/components/dashboard/OperationsChart";
import { OperationalSummary } from "@/components/dashboard/OperationalSummary";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { useDocumentFilters } from "@/hooks/useDocumentFilters";
import type { FiscalDocument, StatusFilter } from "@/types/documents";

export function OverviewPage({
  externalSelect,
  onExternalSelectHandled,
}: {
  externalSelect: FiscalDocument | null;
  onExternalSelectHandled: () => void;
}) {
  const {
    period,
    setPeriod,
    statusFilter,
    setStatusFilter,
    applyFailuresFilter,
    failuresOnly,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    filtered,
    selected,
    selectDocument,
    selectedId,
  } = useDocumentFilters("7d");

  useEffect(() => {
    if (!externalSelect) return;
    selectDocument(externalSelect);
    if (!externalSelect.periodGroup.includes(period)) {
      setPeriod(externalSelect.periodGroup[0]!);
    }
    onExternalSelectHandled();
  }, [
    externalSelect,
    onExternalSelectHandled,
    period,
    selectDocument,
    setPeriod,
  ]);

  const handleMetricFilter = useCallback(
    (f: StatusFilter) => {
      setStatusFilter(f);
    },
    [setStatusFilter],
  );

  return (
    <>
      <WelcomeSection period={period} onPeriodChange={setPeriod} />
      <OperationalSummary
        period={period}
        onFilterFromMetric={handleMetricFilter}
        onFailuresFilter={applyFailuresFilter}
        activeFilter={statusFilter}
        failuresActive={failuresOnly}
      />

      <div className="px-4 py-8 lg:px-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1 xl:pr-4">
            <OperationalMonitor
              documents={filtered}
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              selectedId={selectedId}
              onSelect={selectDocument}
            />
          </div>
          <aside className="flex w-full shrink-0 flex-col gap-6 xl:w-[min(100%,22rem)] xl:sticky xl:top-16">
            <OperationsChart period={period} />
            {selected && (
              <DocumentDetailsPanel
                document={selected}
                onClose={() => selectDocument(null)}
              />
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
