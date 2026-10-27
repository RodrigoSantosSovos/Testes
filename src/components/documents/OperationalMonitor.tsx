import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, isAttentionStatus } from "@/lib/format";
import { cn } from "@/lib/cn";
import type {
  DocumentType,
  FiscalDocument,
  StatusFilter,
} from "@/types/documents";

const statusFilters: StatusFilter[] = [
  "all",
  "error",
  "rejected",
  "processing",
  "completed",
];

const docTypes: (DocumentType | "all")[] = ["all", "NFE", "NFSE", "CTE", "MDFE"];

export function OperationalMonitor({
  documents,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  selectedId,
  onSelect,
}: {
  documents: FiscalDocument[];
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (f: StatusFilter) => void;
  typeFilter: DocumentType | "all";
  onTypeFilterChange: (t: DocumentType | "all") => void;
  selectedId: string | null;
  onSelect: (doc: FiscalDocument) => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <section className="flex min-h-[420px] flex-1 flex-col rounded-xl border border-border bg-surface lg:rounded-r-none lg:border-r-0">
      <div className="border-b border-border px-4 py-4 lg:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {t("monitor.title")}
            </h3>
            <p className="text-sm text-text-muted">{t("monitor.subtitle")}</p>
          </div>
          <p className="text-xs text-text-muted">
            {t("monitor.rows", { count: documents.length })}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div
            className="flex flex-wrap gap-1"
            role="tablist"
            aria-label={t("monitor.title")}
          >
            {statusFilters.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={statusFilter === f}
                onClick={() => onStatusFilterChange(f)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition",
                  statusFilter === f
                    ? "bg-text-primary text-background dark:bg-slate-100 dark:text-slate-900"
                    : "text-text-secondary hover:bg-surface-elevated",
                )}
              >
                {t(`monitor.filters.${f}`)}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={(e) =>
              onTypeFilterChange(e.target.value as DocumentType | "all")
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-secondary lg:ml-auto"
            aria-label={t("monitor.typeFilter")}
          >
            {docTypes.map((dt) => (
              <option key={dt} value={dt}>
                {dt === "all" ? t("monitor.typeAll") : t(`docType.${dt}`)}
              </option>
            ))}
          </select>
        </div>

        <SearchInput
          className="mt-3"
          value={search}
          onChange={onSearchChange}
          placeholder={t("monitor.search")}
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-sm font-medium text-text-primary">
              {t("monitor.empty")}
            </p>
            <p className="mt-1 max-w-sm text-sm text-text-muted">
              {t("monitor.emptyFiltered")}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {documents.map((doc) => {
              const attention = isAttentionStatus(doc.status);
              return (
                <li key={doc.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(doc)}
                    className={cn(
                      "group flex w-full gap-4 px-4 py-3.5 text-left transition hover:bg-surface-elevated/80 lg:px-5",
                      selectedId === doc.id && "bg-accent-muted/40",
                      attention && "border-l-2 border-l-warning",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                          {t(`docType.${doc.type}`)}
                        </span>
                        <span className="font-mono text-sm font-medium text-text-primary">
                          {doc.number}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">
                        {t(doc.summaryKey)}
                      </p>
                      <p className="mt-1 truncate text-xs text-text-muted">
                        {doc.company}
                        {(doc.municipality || doc.authority) &&
                          ` · ${doc.municipality ?? doc.authority}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                      <StatusBadge status={doc.status} />
                      <time
                        className="text-[11px] tabular-nums text-text-muted"
                        dateTime={doc.updatedAt}
                      >
                        {formatDateTime(doc.updatedAt, locale)}
                      </time>
                      <span
                        className="inline-flex items-center gap-0.5 text-xs font-medium text-accent opacity-0 transition group-hover:opacity-100"
                      >
                        {t("monitor.action")}
                        <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
