import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime } from "@/lib/format";
import { statusRailClass } from "@/lib/statusVisual";
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
    <section className="min-h-[420px] flex-1">
      <div className="mb-4 flex flex-col gap-4 border-b border-border-subtle pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
            {t("monitor.title")}
          </h3>
          <p className="mt-1 text-sm text-text-secondary">{t("monitor.subtitle")}</p>
        </div>
        <p className="font-mono text-xs text-text-muted">
          {t("monitor.rows", { count: documents.length })}
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div
          className="flex flex-wrap gap-x-3 gap-y-1 border-b border-transparent"
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
                "-mb-px border-b-2 px-1 py-2 text-xs font-medium uppercase tracking-wide transition",
                statusFilter === f
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-muted hover:text-text-secondary",
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
          className="rounded-md border-0 border-b border-border bg-transparent px-0 py-2 text-xs font-medium text-text-secondary lg:ml-auto"
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
        className="mb-4 max-w-md"
        value={search}
        onChange={onSearchChange}
        placeholder={t("monitor.search")}
      />

      <div className="overflow-hidden rounded-lg border border-border/80 bg-surface/90">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <p className="font-display text-lg font-medium text-text-primary">
              {t("monitor.empty")}
            </p>
            <p className="mt-2 max-w-sm text-sm text-text-muted">
              {t("monitor.emptyFiltered")}
            </p>
          </div>
        ) : (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id} className="ff-hairline last:shadow-none">
                <button
                  type="button"
                  onClick={() => onSelect(doc)}
                  className={cn(
                    "group relative flex w-full gap-4 px-4 py-4 text-left transition-colors hover:bg-surface-elevated/60 lg:px-5",
                    selectedId === doc.id && "bg-accent-muted/35",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full",
                      statusRailClass[doc.status],
                    )}
                    aria-hidden
                  />
                  <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[7rem_1fr] sm:items-center lg:grid-cols-[8rem_1fr_auto]">
                    <div>
                      <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted">
                        {t(`docType.${doc.type}`)}
                      </p>
                      <p className="font-mono text-sm font-medium text-text-primary">
                        {doc.number}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {t(doc.summaryKey)}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-text-muted">
                        {doc.company}
                        {(doc.municipality || doc.authority) &&
                          ` · ${doc.municipality ?? doc.authority}`}
                      </p>
                    </div>
                    <div className="flex flex-row flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-end">
                      <StatusBadge status={doc.status} />
                      <time
                        className="font-mono text-[11px] tabular-nums text-text-muted"
                        dateTime={doc.updatedAt}
                      >
                        {formatDateTime(doc.updatedAt, locale)}
                      </time>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 self-center text-text-muted opacity-0 transition group-hover:opacity-100"
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
