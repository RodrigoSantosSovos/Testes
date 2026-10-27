import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { mockDocuments } from "@/data/mockDocuments";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { FiscalDocument } from "@/types/documents";

export function GlobalSearchModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (doc: FiscalDocument) => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockDocuments.slice(0, 6);
    return mockDocuments.filter(
      (d) =>
        d.number.toLowerCase().includes(q) ||
        d.company.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHighlight(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      }
      if (e.key === "Enter" && results[highlight]) {
        onSelect(results[highlight]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, highlight, onClose, onSelect]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="size-5 text-text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            placeholder={t("searchModal.placeholder")}
            className="flex-1 bg-transparent text-sm outline-none"
            aria-labelledby="search-modal-title"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-text-muted hover:bg-surface-elevated"
            aria-label={t("panel.close")}
          >
            <X className="size-4" />
          </button>
        </div>
        <p id="search-modal-title" className="sr-only">
          {t("searchModal.title")}
        </p>
        <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-text-muted">
              {t("searchModal.noResults")}
            </p>
          ) : (
            <ul>
              {results.map((doc, i) => (
                <li key={doc.id}>
                  <button
                    type="button"
                    className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      i === highlight ? "bg-accent-muted" : "hover:bg-surface-elevated"
                    }`}
                    onClick={() => onSelect(doc)}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {t(`docType.${doc.type}`)} · {doc.number}
                      </p>
                      <p className="truncate text-xs text-text-muted">
                        {doc.company}
                      </p>
                    </div>
                    <StatusBadge status={doc.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="border-t border-border px-4 py-2 text-xs text-text-muted">
          {t("searchModal.hint")}
        </p>
      </div>
    </div>
  );
}
