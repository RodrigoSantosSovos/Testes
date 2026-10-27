import { Copy, History, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { FiscalDocument } from "@/types/documents";

export function DocumentDetailsPanel({
  document,
  onClose,
}: {
  document: FiscalDocument | null;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [toast, setToast] = useState<string | null>(null);

  if (!document) return null;

  const locale = i18n.language;
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(t("panel.copied"));
    } catch {
      showToast(text);
    }
  };

  const canRetry = ["technical_error", "retry_scheduled", "rejected"].includes(
    document.status,
  );

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        aria-hidden
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex max-h-[85vh] w-full max-w-md flex-col border border-border bg-surface shadow-2xl transition-transform duration-200 sm:max-h-none sm:inset-y-auto sm:top-16 sm:bottom-4 sm:right-4 sm:rounded-lg xl:static xl:inset-auto xl:max-h-[calc(100vh-8rem)] xl:w-full xl:shadow-none",
          document ? "translate-x-0" : "translate-x-full",
        )}
        aria-label={t("panel.title")}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 className="font-display text-sm font-semibold">{t("panel.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-text-muted hover:bg-surface-elevated"
            aria-label={t("panel.close")}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-surface-elevated px-2 py-1 font-mono text-xs text-text-secondary">
              {t(`docType.${document.type}`)}
            </span>
            <StatusBadge status={document.status} />
          </div>
          <p className="font-display mt-3 text-2xl font-semibold tracking-tight text-text-primary">
            {document.number}
          </p>
          <p className="text-xs text-text-muted">{document.id}</p>

          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                {t("panel.company")}
              </dt>
              <dd className="mt-1 text-text-primary">{document.company}</dd>
            </div>
            {(document.municipality || document.authority) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {t("panel.location")}
                </dt>
                <dd className="mt-1 text-text-secondary">
                  {document.municipality ?? document.authority}
                </dd>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {t("panel.created")}
                </dt>
                <dd className="mt-1 text-text-secondary">
                  {formatDateTime(document.createdAt, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {t("panel.updated")}
                </dt>
                <dd className="mt-1 text-text-secondary">
                  {formatDateTime(document.updatedAt, locale)}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-6 border-t border-border-subtle pt-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t("panel.errorSection")}
            </h3>
            {document.errorCode ? (
              <div className="mt-2 rounded-lg border border-error/20 bg-error-muted/40 p-3 text-sm">
                <p className="font-mono text-xs text-error">
                  {t("panel.errorCode")}: {document.errorCode}
                </p>
                {document.errorMessageKey && (
                  <p className="mt-2 text-text-secondary">
                    {t(document.errorMessageKey)}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-text-muted">{t("panel.noError")}</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t("panel.history")}
            </h3>
            <ol className="mt-3 space-y-3 border-l border-border pl-4">
              {document.timeline.map((ev) => (
                <li key={ev.id} className="relative text-sm">
                  <span
                    className={cn(
                      "absolute -left-[21px] top-1.5 size-2 rounded-full ring-2 ring-surface",
                      ev.status === "success" && "bg-success",
                      ev.status === "error" && "bg-error",
                      ev.status === "warning" && "bg-warning",
                      ev.status === "info" && "bg-text-muted",
                    )}
                  />
                  <p className="font-medium text-text-primary">
                    {t(ev.labelKey)}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatDateTime(ev.timestamp, locale)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="border-t border-border p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
            {t("panel.actions")}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-surface-elevated"
              onClick={() => copy(document.id)}
            >
              <Copy className="size-3.5" />
              {t("panel.copyId")}
            </button>
            {document.errorCode && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-surface-elevated"
                onClick={() => copy(document.errorCode!)}
              >
                <Copy className="size-3.5" />
                {t("panel.copyError")}
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-surface-elevated"
              onClick={() => showToast(t("panel.viewHistory"))}
            >
              <History className="size-3.5" />
              {t("panel.viewHistory")}
            </button>
            {canRetry && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white dark:text-slate-900"
                onClick={() => showToast(t("panel.retryDemo"))}
              >
                <RefreshCw className="size-3.5" />
                {t("panel.retry")}
              </button>
            )}
          </div>
        </div>

        {toast && (
          <div
            className="absolute bottom-20 left-4 right-4 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-center text-xs shadow-lg"
            role="status"
          >
            {toast}
          </div>
        )}
      </aside>
    </>
  );
}
