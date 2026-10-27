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
      <div className="space-y-6 px-4 py-6 lg:px-8">
        <OperationalSummary
          period={period}
          onFilterFromMetric={handleMetricFilter}
          onFailuresFilter={applyFailuresFilter}
          activeFilter={statusFilter}
          failuresActive={failuresOnly}
        />

        <OperationsChart period={period} />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
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
          {selected && (
            <DocumentDetailsPanel
              document={selected}
              onClose={() => selectDocument(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
