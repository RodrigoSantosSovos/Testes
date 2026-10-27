import { useCallback, useMemo, useState } from "react";
import { mockDocuments } from "@/data/mockDocuments";
import { statusMatchesFilter } from "@/lib/format";
import type {
  DocumentType,
  FiscalDocument,
  PeriodKey,
  StatusFilter,
} from "@/types/documents";

export function useDocumentFilters(initialPeriod: PeriodKey = "7d") {
  const [period, setPeriod] = useState<PeriodKey>(initialPeriod);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [failuresOnly, setFailuresOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockDocuments.filter((doc) => {
      if (!doc.periodGroup.includes(period)) return false;
      if (
        failuresOnly &&
        !["rejected", "technical_error"].includes(doc.status)
      ) {
        return false;
      }
      if (!statusMatchesFilter(doc.status, statusFilter)) return false;
      if (typeFilter !== "all" && doc.type !== typeFilter) return false;
      if (!q) return true;
      return (
        doc.number.toLowerCase().includes(q) ||
        doc.company.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q) ||
        (doc.municipality?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [period, statusFilter, typeFilter, search, failuresOnly]);

  const selected = useMemo(
    () => filtered.find((d) => d.id === selectedId) ?? mockDocuments.find((d) => d.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  const selectDocument = useCallback((doc: FiscalDocument | null) => {
    setSelectedId(doc?.id ?? null);
  }, []);

  const applyStatusFilter = useCallback((f: StatusFilter) => {
    setFailuresOnly(false);
    setStatusFilter(f);
  }, []);

  const applyFailuresFilter = useCallback(() => {
    setFailuresOnly(true);
    setStatusFilter("all");
  }, []);

  return {
    period,
    setPeriod,
    statusFilter,
    setStatusFilter: applyStatusFilter,
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
  };
}
