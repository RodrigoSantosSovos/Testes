import {
  BarChart3,
  FileText,
  LayoutDashboard,
  PanelLeft,
  Radio,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_NAME } from "@/config/branding";
import { cn } from "@/lib/cn";

const navItems = [
  { key: "overview", icon: LayoutDashboard, active: true },
  { key: "monitoring", icon: Radio, active: false },
  { key: "documents", icon: FileText, active: false },
  { key: "reports", icon: BarChart3, active: false },
  { key: "settings", icon: Settings, active: false },
] as const;

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#14110e]/30 backdrop-blur-[2px] lg:hidden"
          aria-label={t("panel.close")}
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--ff-rail-border)] bg-[var(--ff-rail)] backdrop-blur-xl transition-[width,transform] duration-200 ease-out lg:static lg:translate-x-0",
          collapsed ? "w-[4.25rem]" : "w-[15.5rem]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center gap-2 px-3",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed ? (
            <div className="min-w-0 px-1">
              <p className="font-display truncate text-lg font-semibold tracking-tight text-text-primary">
                {APP_NAME}
              </p>
              <p className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-text-muted">
                {t("branding.tagline")}
              </p>
            </div>
          ) : (
            <span
              className="font-display flex size-10 items-center justify-center text-sm font-bold text-accent"
              aria-hidden
            >
              F
            </span>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="hidden size-8 shrink-0 items-center justify-center rounded-md text-text-muted transition hover:bg-surface-elevated hover:text-text-primary lg:inline-flex"
            aria-label={t("a11y.sidebarToggle")}
          >
            <PanelLeft
              className={cn("size-4 transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-2" aria-label="Main">
          {navItems.map(({ key, icon: Icon, active }) => (
            <button
              key={key}
              type="button"
              title={collapsed ? t(`nav.${key}`) : undefined}
              className={cn(
                "relative flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center px-0" : "px-3",
                active
                  ? "bg-accent-muted/80 text-text-primary"
                  : "text-text-secondary hover:bg-surface-elevated/80 hover:text-text-primary",
              )}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--ff-rail-active)]"
                  aria-hidden
                />
              )}
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  active ? "text-accent" : "opacity-70",
                )}
              />
              {!collapsed && <span>{t(`nav.${key}`)}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-border-subtle p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2",
              collapsed && "justify-center px-0",
            )}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated font-mono text-[11px] font-medium text-text-secondary"
              aria-hidden
            >
              AR
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {t("user.name")}
                </p>
                <p className="truncate text-xs text-text-muted">{t("user.org")}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
